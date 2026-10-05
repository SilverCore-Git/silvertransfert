// Chiffrement de bout en bout des transferts (v2), 100 % WebCrypto.
//
// - Clé du lien : 32 octets aléatoires, placés dans le fragment de l'URL
//   (/t/<id>#<clé>) : le navigateur ne l'envoie jamais au serveur.
// - Mot de passe optionnel : PBKDF2-SHA256 (600 000 itérations, sel stocké
//   côté serveur) mélangé à la clé du lien via HKDF.
// - Contenu : AES-256-GCM par chunk de 8 Mio. IV = compteur, AAD =
//   "st2|<id>|<index>|<dernier>" : un chunk tronqué, réordonné, échangé
//   avec un autre transfert ou une fin coupée fait échouer le déchiffrement.
// - Métadonnées (nom, taille, type) chiffrées avec la même clé.
//
// Doit rester aligné avec l'API (config.chunkPlainBytes / chunkMaxBytes).

export const CHUNK_SIZE = 8 * 1024 * 1024;
export const PBKDF2_ITERATIONS = 600_000;

export interface Meta {
  name: string;
  size: number;      // taille en clair (octets)
  type: string;
  isZip: boolean;
  files: number;     // nombre de fichiers d'origine
}

const enc = new TextEncoder();
const dec = new TextDecoder();

export function toB64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

export const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));
export const newTransferId = () => toB64url(randomBytes(16));   // 22 caractères
export const newLinkKey = () => randomBytes(32);
export const isLinkKey = (s: string) => /^[A-Za-z0-9_-]{43}$/.test(s);

export async function deriveKey(linkKey: Uint8Array<ArrayBuffer>, password?: string, salt?: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  let ikm = linkKey;
  if (password) {
    if (!salt) throw new Error('Sel manquant pour le mot de passe');
    const pw = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS }, pw, 256));
    ikm = new Uint8Array(linkKey.length + bits.length);
    ikm.set(linkKey);
    ikm.set(bits, linkKey.length);
  }
  const base = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: enc.encode('silvertransfert-v2') },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

// IV unique par (clé, usage) : la clé est propre au transfert, un compteur suffit.
function iv(index: number, meta = false): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(12);
  out[0] = meta ? 1 : 0;
  new DataView(out.buffer).setUint32(8, index);
  return out;
}

const chunkAad = (id: string, index: number, last: boolean) => enc.encode(`st2|${id}|${index}|${last ? 1 : 0}`);

export async function encryptChunk(key: CryptoKey, id: string, index: number, last: boolean, data: Uint8Array<ArrayBuffer>) {
  return new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv(index), additionalData: chunkAad(id, index, last) }, key, data));
}

export async function decryptChunk(key: CryptoKey, id: string, index: number, last: boolean, data: Uint8Array<ArrayBuffer>) {
  return new Uint8Array(await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv(index), additionalData: chunkAad(id, index, last) }, key, data));
}

export async function encryptMeta(key: CryptoKey, id: string, meta: Meta): Promise<string> {
  return toB64url(new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv(0, true), additionalData: enc.encode(`st2|${id}|meta`) },
    key, enc.encode(JSON.stringify(meta)))));
}

// Lève une erreur si la clé (lien ou mot de passe) est mauvaise.
export async function decryptMeta(key: CryptoKey, id: string, b64: string): Promise<Meta> {
  return JSON.parse(dec.decode(await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv(0, true), additionalData: enc.encode(`st2|${id}|meta`) },
    key, fromB64url(b64))));
}

// Redécoupe un flux en blocs de `size` octets en signalant le dernier (lecture
// d'un bloc d'avance). Un flux vide donne un unique bloc vide marqué dernier.
export async function* rechunk(stream: ReadableStream<Uint8Array>, size = CHUNK_SIZE): AsyncGenerator<{ data: Uint8Array<ArrayBuffer>, last: boolean }> {
  const reader = stream.getReader();
  let buf = new Uint8Array(size);
  let fill = 0;
  let pending: Uint8Array<ArrayBuffer> | null = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    let offset = 0;
    while (offset < value.length) {
      const n = Math.min(size - fill, value.length - offset);
      buf.set(value.subarray(offset, offset + n), fill);
      fill += n;
      offset += n;
      if (fill === size) {
        if (pending) yield { data: pending, last: false };
        pending = buf;
        buf = new Uint8Array(size);
        fill = 0;
      }
    }
  }

  if (fill > 0) {
    if (pending) yield { data: pending, last: false };
    yield { data: buf.slice(0, fill), last: true };
  } else {
    yield { data: pending ?? new Uint8Array(0), last: true };
  }
}
