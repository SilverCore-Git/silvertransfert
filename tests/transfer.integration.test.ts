// Test d'intégration contre une API qui tourne (VITE_API_URL, défaut
// http://localhost:8080). Ignoré si l'API ne répond pas.
import { test, expect } from "bun:test";
import { unzipSync } from "fflate";
import { uploadTransfer, fetchTransfer, openTransfer } from "../src/lib/transfer";
import { decryptChunk } from "../src/lib/e2ee";

const API = process.env.VITE_API_URL || "http://localhost:8080";
const up = await fetch(`${API}/version`).then(r => r.ok, () => false);

async function downloadAll(id: string, linkKey: string, password?: string) {
  const t = await fetchTransfer(id);
  if (!t) throw new Error("transfer not found");
  const { key, meta } = await openTransfer(t, linkKey, password);
  const parts: Uint8Array[] = [];
  for (let n = 0; n < t.chunks; n++) {
    const c = new Uint8Array(await (await fetch(`${API}/v2/transfers/${id}/chunks/${n}`)).arrayBuffer());
    parts.push(await decryptChunk(key, id, n, n === t.chunks - 1, c));
  }
  return { meta, data: Buffer.concat(parts) };
}

const parse = (link: string) => {
  const [, id, key] = /^\/t\/([^#]+)#(.+)$/.exec(link)!;
  return { id: id!, key: key! };
};

test.skipIf(!up)("multi-chunk single file with password", async () => {
  const content = crypto.getRandomValues(new Uint8Array(65536)); // gabarit, répété ci-dessous
  const big = new Uint8Array(8 * 1024 * 1024 * 2 + 12345);
  for (let i = 0; i < big.length; i += content.length) big.set(content.subarray(0, Math.min(content.length, big.length - i)), i);
  const progress: number[] = [];
  const link = await uploadTransfer([new File([big], "vidéo.bin", { type: "application/octet-stream" })], {
    password: "s3cret", onProgress: (s) => progress.push(s),
  });
  const { id, key } = parse(link);

  const t = await fetchTransfer(id);
  expect(t?.chunks).toBe(3);
  expect(JSON.stringify(t)).not.toContain("vidéo"); // le serveur ne voit pas le nom

  await expect(openTransfer(t!, key)).rejects.toThrow();            // mot de passe requis
  await expect(openTransfer(t!, key, "wrong")).rejects.toThrow();
  const { meta, data } = await downloadAll(id, key, "s3cret");
  expect(meta).toMatchObject({ name: "vidéo.bin", size: big.length, isZip: false });
  expect(Buffer.compare(data, Buffer.from(big))).toBe(0);
  expect(progress.at(-1)).toBe(big.length);
}, 60_000);

test.skipIf(!up)("several files are zipped client-side, duplicate names kept", async () => {
  const link = await uploadTransfer([
    new File(["hello"], "a.txt"), new File(["world"], "a.txt"), new File([""], "empty.txt"),
  ]);
  const { id, key } = parse(link);
  const { meta, data } = await downloadAll(id, key);
  expect(meta).toMatchObject({ isZip: true, files: 3, type: "application/zip" });
  const files = unzipSync(new Uint8Array(data));
  expect(Object.keys(files).sort()).toEqual(["a (1).txt", "a.txt", "empty.txt"]);
  expect(new TextDecoder().decode(files["a (1).txt"])).toBe("world");
}, 30_000);

test.skipIf(!up)("empty single file", async () => {
  const { id, key } = parse(await uploadTransfer([new File([], "vide.txt")]));
  const { meta, data } = await downloadAll(id, key);
  expect(meta.size).toBe(0);
  expect(data.length).toBe(0);
});
