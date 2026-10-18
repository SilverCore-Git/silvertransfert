// Envoi et réception des transferts chiffrés (API /v2/transfers).
import axios from 'axios';
import { downloadZip, predictLength } from 'client-zip';
import {
  type Meta, deriveKey, encryptChunk, decryptChunk, encryptMeta, decryptMeta,
  rechunk, newLinkKey, randomBytes, toB64url, fromB64url,
} from './e2ee';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE = `${API_URL}/v2/transfers`;
// Plusieurs envois en vol : un chunk lent (réseau instable, connexion
// lointaine) ne bloque pas les autres. 6 = limite de connexions HTTP/1.1
// par hôte dans les navigateurs.
const PARALLEL_UPLOADS = 6;
const RETRIES = 3;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      // 4xx = requête refusée, inutile de réessayer ; annulation = on s'arrête
      if (attempt >= RETRIES || axios.isCancel(err) || (status && status >= 400 && status < 500)) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// Noms uniques dans le zip : deux fichiers homonymes ne s'écrasent pas.
function zipEntries(files: File[]) {
  const used = new Set<string>();
  return files.map(file => {
    let name = file.name;
    const dot = name.lastIndexOf('.');
    const [base, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ''];
    for (let i = 1; used.has(name); i++) name = `${base} (${i})${ext}`;
    used.add(name);
    return { input: file, name };
  });
}

export function plainSize(files: File[]): number {
  return files.length > 1 ? Number(predictLength(zipEntries(files))) : (files[0]?.size ?? 0);
}

export interface UploadOptions {
  password?: string;
  onProgress?: (sent: number, total: number) => void;
  // Annulation par l'utilisateur : les envois en cours sont coupés et le
  // transfert est supprimé côté serveur.
  signal?: AbortSignal;
}

// Chiffre et envoie les fichiers (zippés s'il y en a plusieurs). Renvoie le
// chemin du lien de téléchargement, clé incluse dans le fragment.
export async function uploadTransfer(files: File[], { password, onProgress, signal }: UploadOptions = {}): Promise<string> {
  const linkKey = newLinkKey();
  const salt = password ? randomBytes(16) : undefined;
  const key = await deriveKey(linkKey, password, salt);

  // L'id est tiré par le serveur (un id choisi par le client permettait de
  // reprendre l'id d'un transfert expiré).
  const { data } = await axios.post<{ id: string, uploadToken: string }>(BASE, { salt: salt && toB64url(salt) }, { signal });
  const { id } = data;
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(id)) throw new Error('Identifiant de transfert invalide');
  const headers = { Authorization: `Bearer ${data.uploadToken}` };

  const isZip = files.length > 1;
  const entries = zipEntries(files);
  const total = plainSize(files);
  const stream = isZip ? downloadZip(entries).body! : files[0]!.stream();

  const inflight = new Set<Promise<void>>();
  try {
    let index = 0;
    let size = 0;
    let sent = 0;
    let failure: unknown;

    for await (const { data: chunk, last } of rechunk(stream)) {
      signal?.throwIfAborted();
      if (failure) throw failure;
      const n = index++;
      size += chunk.length;
      const body = await encryptChunk(key, id, n, last, chunk);
      const job: Promise<void> = withRetry(() => axios.put(`${BASE}/${id}/chunks/${n}`, body, {
        headers: { ...headers, 'Content-Type': 'application/octet-stream' },
        signal,
      }))
        .then(() => { sent += chunk.length; onProgress?.(Math.min(sent, total), total); })
        .catch(err => { failure ??= err; })
        .finally(() => inflight.delete(job));
      inflight.add(job);
      if (inflight.size >= PARALLEL_UPLOADS) await Promise.race(inflight);
    }
    await Promise.all(inflight);
    if (failure) throw failure;

    const meta: Meta = {
      name: isZip ? `SilverTransfert_${new Date().toISOString().slice(0, 10)}.zip` : files[0]!.name,
      size,
      type: isZip ? 'application/zip' : (files[0]!.type || 'application/octet-stream'),
      isZip,
      files: files.length,
    };
    await axios.post(`${BASE}/${id}/complete`, { chunks: index, meta: await encryptMeta(key, id, meta) }, { headers, signal });
  } catch (err) {
    // Attendre la fin des envois coupés : un chunk écrit après la suppression
    // resterait orphelin sur le serveur.
    await Promise.allSettled(inflight);
    await axios.delete(`${BASE}/${id}`, { headers }).catch(() => {});
    throw err;
  }

  return `/t/${id}#${toB64url(linkKey)}`;
}

export interface RemoteTransfer {
  id: string;
  chunks: number;
  size: number;
  meta: string;
  salt: string | null;
  expiresAt: number;
}

// null si le transfert n'existe pas (ou plus) en v2.
export async function fetchTransfer(id: string): Promise<RemoteTransfer | null> {
  try {
    return (await axios.get<RemoteTransfer>(`${BASE}/${encodeURIComponent(id)}`)).data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  }
}

// Lève une erreur si la clé du lien ou le mot de passe est incorrect.
export async function openTransfer(t: RemoteTransfer, linkKey: string, password?: string) {
  const key = await deriveKey(fromB64url(linkKey), password, t.salt ? fromB64url(t.salt) : undefined);
  return { key, meta: await decryptMeta(key, t.id, t.meta) };
}

type Writable = { write(data: Uint8Array<ArrayBuffer>): Promise<void>; close(): Promise<void>; abort(): Promise<void> };
type SaveFilePicker = (opts: { suggestedName?: string }) => Promise<{ createWritable(): Promise<Writable> }>;
const savePicker = () => (window as unknown as { showSaveFilePicker?: SaveFilePicker }).showSaveFilePicker;

// Sans File System Access (Firefox, Safari), le fichier est reconstitué en
// mémoire avant l'enregistrement : au-delà, le navigateur peut échouer.
export const canStreamToDisk = () => typeof savePicker() === 'function';
export const MEMORY_DOWNLOAD_LIMIT = 2 * 1024 * 1024 * 1024;

async function openSink(meta: Meta): Promise<Writable> {
  const picker = savePicker();
  if (picker) return (await picker({ suggestedName: meta.name })).createWritable();

  const parts: Uint8Array<ArrayBuffer>[] = [];
  return {
    async write(data) { parts.push(data); },
    async abort() { parts.length = 0; },
    async close() {
      const url = URL.createObjectURL(new Blob(parts, { type: meta.type }));
      const a = Object.assign(document.createElement('a'), { href: url, download: meta.name });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    },
  };
}

// À appeler directement depuis le clic : le sélecteur de fichier exige une
// activation utilisateur. Lève AbortError si l'utilisateur annule.
export async function saveTransfer(t: RemoteTransfer, key: CryptoKey, meta: Meta, onProgress?: (done: number, total: number) => void) {
  // `chunks` vient du serveur, non authentifié : un nombre non entier ou nul
  // arrêterait la boucle avant le chunk marqué « dernier » et un fichier
  // tronqué passerait pour complet.
  if (!Number.isInteger(t.chunks) || t.chunks < 1) throw new Error('Transfert corrompu');
  const sink = await openSink(meta);
  const fetchChunk = (n: number) => withRetry(async () => new Uint8Array(
    (await axios.get<ArrayBuffer>(`${BASE}/${t.id}/chunks/${n}`, { responseType: 'arraybuffer' })).data));

  try {
    let done = 0;
    let next = fetchChunk(0);
    for (let n = 0; n < t.chunks; n++) {
      const cipher = await next;
      if (n + 1 < t.chunks) next = fetchChunk(n + 1);   // télécharge le suivant pendant le déchiffrement
      const plain = await decryptChunk(key, t.id, n, n === t.chunks - 1, cipher);
      await sink.write(plain);
      done += plain.length;
      onProgress?.(done, meta.size);
    }
    // meta.size est chiffré avec la clé du lien : le serveur ne peut pas le falsifier.
    if (done !== meta.size) throw new Error('Transfert corrompu');
    await sink.close();
  } catch (err) {
    await sink.abort().catch(() => {});
    throw err;
  }
}
