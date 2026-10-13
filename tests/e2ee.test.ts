import { test, expect } from "bun:test";
import {
  deriveKey, encryptChunk, decryptChunk, encryptMeta, decryptMeta,
  rechunk, newLinkKey, randomBytes, toB64url, fromB64url, isLinkKey,
} from "../src/lib/e2ee";

const streamOf = (parts: Uint8Array[]) => new ReadableStream<Uint8Array>({
  start(c) { parts.forEach(p => c.enqueue(p)); c.close(); },
});

async function collect(s: ReadableStream<Uint8Array>, size: number) {
  const out: { len: number, last: boolean }[] = [];
  for await (const { data, last } of rechunk(s, size)) out.push({ len: data.length, last });
  return out;
}

test("rechunk splits on exact boundaries and flags only the last block", async () => {
  expect(await collect(streamOf([new Uint8Array(10)]), 4)).toEqual([{ len: 4, last: false }, { len: 4, last: false }, { len: 2, last: true }]);
  expect(await collect(streamOf([new Uint8Array(3), new Uint8Array(5)]), 4)).toEqual([{ len: 4, last: false }, { len: 4, last: true }]);
  expect(await collect(streamOf([]), 4)).toEqual([{ len: 0, last: true }]);
});

test("b64url round trip and link key format", () => {
  const k = newLinkKey();
  expect(isLinkKey(toB64url(k))).toBe(true);
  expect([...fromB64url(toB64url(k))]).toEqual([...k]);
  expect(isLinkKey("motdepasse12")).toBe(false); // ancien format de lien
});

test("chunks: round trip, and tampering / reorder / truncation / other transfer rejected", async () => {
  const key = await deriveKey(newLinkKey());
  const data = randomBytes(1000);
  const c0 = await encryptChunk(key, "idA", 0, false, data);
  expect([...await decryptChunk(key, "idA", 0, false, c0)]).toEqual([...data]);

  const tampered = c0.slice(); tampered[5] ^= 1;
  await expect(decryptChunk(key, "idA", 0, false, tampered)).rejects.toThrow();
  await expect(decryptChunk(key, "idA", 1, false, c0)).rejects.toThrow();   // réordonné
  await expect(decryptChunk(key, "idA", 0, true, c0)).rejects.toThrow();    // fin tronquée
  await expect(decryptChunk(key, "idB", 0, false, c0)).rejects.toThrow();   // autre transfert
});

test("meta: password required and checked", async () => {
  const link = newLinkKey();
  const salt = randomBytes(16);
  const good = await deriveKey(link, "correct horse", salt);
  const meta = { name: "a.txt", size: 3, type: "text/plain", isZip: false, files: 1 };
  const blob = await encryptMeta(good, "id1", meta);
  expect(await decryptMeta(await deriveKey(link, "correct horse", salt), "id1", blob)).toEqual(meta);
  await expect(decryptMeta(await deriveKey(link, "wrong", salt), "id1", blob)).rejects.toThrow();
  await expect(decryptMeta(await deriveKey(link), "id1", blob)).rejects.toThrow();
});
