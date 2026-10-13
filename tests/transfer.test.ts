import { test, expect } from "bun:test";
import { saveTransfer, type RemoteTransfer } from "../src/lib/transfer";
import type { Meta } from "../src/lib/e2ee";

// Un serveur compromis ne doit pas pouvoir faire accepter un fichier tronqué (F2).
test("a non-integer or zero chunk count from the server is refused", async () => {
  const meta: Meta = { name: "a.bin", size: 24, type: "application/octet-stream", isZip: false, files: 1 };
  const key = {} as CryptoKey;
  for (const chunks of [1.5, 0, NaN, -1]) {
    const t: RemoteTransfer = { id: "x".repeat(22), chunks, size: 0, meta: "", salt: null, expiresAt: 0 };
    await expect(saveTransfer(t, key, meta)).rejects.toThrow("Transfert corrompu");
  }
});
