<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getConfigValue } from '../../utils/config';
import { formatSize } from '../../utils/file';
import download_json from '../../config/download.json';
import { isLinkKey, type Meta } from '../../lib/e2ee';
import {
  type RemoteTransfer, fetchTransfer, openTransfer, saveTransfer,
  canStreamToDisk, MEMORY_DOWNLOAD_LIMIT,
} from '../../lib/transfer';

const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

type Status = 'loading' | 'locked' | 'ready' | 'decrypting' | 'downloading' | 'error' | 'not_found';

const transferId = ref('');
const secret = ref('');            // clé du lien (v2) ou mot de passe (ancien format)
const status = ref<Status>('loading');
const errorMsg = ref('');

// v2 : chiffrement de bout en bout, tout se passe dans ce navigateur
const remote = ref<RemoteTransfer | null>(null);
const meta = ref<Meta | null>(null);
let key: CryptoKey | null = null;
const password = ref('');
const passwordError = ref('');
const unlocking = ref(false);
const passwordInput = ref<HTMLInputElement | null>(null);
const progress = ref(0);           // 0..1
const finished = ref(false);

// Ancien format : déchiffrement côté serveur (liens créés avant le passage au E2EE)
const legacyInfo = ref<{ isZip?: boolean } | null>(null);

const isV2 = computed(() => remote.value !== null);
const memoryWarning = computed(() => !!meta.value && !canStreamToDisk() && meta.value.size > MEMORY_DOWNLOAD_LIMIT);
const expiresOn = computed(() => remote.value
  ? new Date(remote.value.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  : '');

function fail(message: string) {
  status.value = 'error';
  errorMsg.value = message;
}

onMounted(async () => {
  transferId.value = route.params.id as string;
  secret.value = window.location.hash.substring(1);

  if (!transferId.value || !secret.value) {
    return fail(download_json.errors?.invalidLink || 'Lien de téléchargement invalide.');
  }

  if (!isLinkKey(secret.value)) return checkLegacyStatus();

  try {
    remote.value = await fetchTransfer(transferId.value);
  } catch {
    return fail(download_json.errors?.statusCheckFailed || 'Erreur lors de la récupération des informations.');
  }
  if (!remote.value) {
    status.value = 'not_found';
    return;
  }
  if (remote.value.salt) {
    status.value = 'locked';
    return;
  }
  try {
    ({ key, meta: meta.value } = await openTransfer(remote.value, secret.value));
    status.value = 'ready';
  } catch {
    fail('Ce lien est incomplet ou abîmé. Vérifiez que vous l’avez copié en entier.');
  }
});

async function unlock() {
  if (!remote.value || unlocking.value) return;
  passwordError.value = '';
  if (!password.value) {
    passwordError.value = 'Saisissez le mot de passe communiqué par l’expéditeur.';
    passwordInput.value?.focus();
    return;
  }
  unlocking.value = true;
  try {
    ({ key, meta: meta.value } = await openTransfer(remote.value, secret.value, password.value));
    status.value = 'ready';
  } catch {
    passwordError.value = 'Mot de passe incorrect. Vérifiez-le auprès de l’expéditeur.';
    passwordInput.value?.select();
  } finally {
    unlocking.value = false;
  }
}

async function startDownload() {
  if (status.value !== 'ready') return;
  if (!isV2.value) return startLegacyDownload();
  if (!remote.value || !key || !meta.value) return;

  status.value = 'downloading';
  progress.value = 0;
  finished.value = false;
  try {
    await saveTransfer(remote.value, key, meta.value, (done, total) => {
      progress.value = total ? done / total : 1;
    });
    finished.value = true;
    status.value = 'ready';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      status.value = 'ready';   // enregistrement annulé par l'utilisateur
      return;
    }
    console.error('Download failed:', error);
    fail('Le téléchargement a échoué. Vérifiez votre connexion puis réessayez.');
  }
}

// --- Ancien format ---

async function checkLegacyStatus() {
  try {
    const response = await axios.get(`${API_URL}/data/status`, { params: { id: transferId.value } });
    legacyInfo.value = response.data;
    status.value = 'ready';
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      status.value = 'not_found';
    } else {
      fail(download_json.errors?.statusCheckFailed || 'Erreur lors de la récupération des informations.');
    }
  }
}

async function startLegacyDownload() {
  try {
    status.value = 'decrypting';
    const decryptRes = await axios.post(`${API_URL}/data/decrypt`, { id: transferId.value, passwd: secret.value });

    if (decryptRes.data.status === 'processing') {
      for (let attempts = 0; attempts < 30; attempts++) {
        const statusRes = await axios.get(`${API_URL}/data/status`, { params: { id: transferId.value } });
        if (statusRes.data.canBeDownload) break;
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    status.value = 'downloading';
    // Formulaire caché : téléchargement natif en POST, sans charger le fichier en mémoire
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${API_URL}/data/download`;
    for (const [name, value] of Object.entries({ id: transferId.value, passwd: secret.value })) {
      form.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name, value }));
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    setTimeout(() => { status.value = 'ready'; }, 2000);
  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
    fail(message || download_json.errors?.downloadFailed || 'Erreur lors du téléchargement.');
  }
}
</script>

<template>
  <section class="dl">
    <div class="dl-card">
      <h1 class="dl-title">{{ download_json.pageTitle || 'Réception de fichiers sécurisée' }}</h1>

      <div class="dl-body" aria-live="polite">
        <div v-if="status === 'loading'" class="state-loading">
          <span class="spinner" aria-hidden="true"></span>
          <p>{{ download_json.loading?.title || 'Vérification du transfert…' }}</p>
        </div>

        <div v-else-if="status === 'not_found' || status === 'error'" class="state-error">
          <span class="state-icon" aria-hidden="true">
            <i class="bi" :class="status === 'not_found' ? 'bi-exclamation-triangle' : 'bi-x-circle'"></i>
          </span>
          <div>
            <h2>{{ status === 'not_found' ? (download_json.notFound?.title || 'Transfert introuvable') : (download_json.error?.title || 'Une erreur est survenue') }}</h2>
            <p>{{ status === 'not_found' ? (download_json.notFound?.message || 'Le lien est expiré ou n’existe pas.') : errorMsg }}</p>
          </div>
          <router-link to="/" class="btn-secondary">
            <i aria-hidden="true" class="bi bi-arrow-left"></i>
            {{ download_json.notFound?.backButton || 'Retour à l’accueil' }}
          </router-link>
        </div>

        <form v-else-if="status === 'locked'" class="state-locked" @submit.prevent="unlock">
          <div class="file-row">
            <span class="file-icon" aria-hidden="true"><i class="bi bi-shield-lock"></i></span>
            <div class="file-info">
              <h2>Transfert protégé</h2>
              <p class="meta">Saisissez le mot de passe communiqué par l’expéditeur.</p>
            </div>
          </div>
          <label for="dlPassword" class="field-label">Mot de passe</label>
          <input
            id="dlPassword"
            ref="passwordInput"
            name="transfer-password"
            v-model="password"
            type="password"
            class="password-input"
            autocomplete="off"
            autofocus
            :aria-invalid="!!passwordError"
            :aria-describedby="passwordError ? 'dlPasswordError' : undefined"
          />
          <p v-if="passwordError" id="dlPasswordError" role="alert" class="form-error">{{ passwordError }}</p>
          <button type="submit" class="download-btn" :disabled="unlocking">
            <template v-if="unlocking"><span class="spinner-small" aria-hidden="true"></span> Vérification…</template>
            <template v-else><i aria-hidden="true" class="bi bi-unlock"></i> Déverrouiller</template>
          </button>
        </form>

        <div v-else class="state-ready">
          <div class="file-row">
            <span class="file-icon" aria-hidden="true">
              <i class="bi" :class="(meta?.isZip ?? legacyInfo?.isZip) ? 'bi-file-earmark-zip' : 'bi-file-earmark-lock2'"></i>
            </span>
            <div class="file-info">
              <template v-if="meta">
                <h2 class="file-name">{{ meta.name }}</h2>
                <p class="meta">
                  {{ formatSize(meta.size) }}<template v-if="meta.files > 1"> · {{ meta.files }} fichiers</template>
                  · disponible jusqu’au {{ expiresOn }}
                </p>
              </template>
              <template v-else>
                <h2>{{ (legacyInfo?.isZip ? download_json.ready?.filesReady : download_json.ready?.fileReady) || 'Fichier prêt' }}</h2>
                <p class="meta">{{ getConfigValue('download.ready.fileId', { id: transferId }) }}</p>
              </template>
            </div>
          </div>

          <p v-if="memoryWarning" class="dl-note" role="note">
            <i aria-hidden="true" class="bi bi-info-circle"></i>
            <span>
              Votre navigateur va reconstituer ce fichier en mémoire avant de l’enregistrer.
              Pour un fichier de cette taille, préférez Chrome ou Edge sur ordinateur.
            </span>
          </p>

          <div v-if="status === 'downloading' && isV2" class="dl-progress">
            <div
              class="dl-progress-track"
              role="progressbar"
              aria-label="Téléchargement et déchiffrement"
              :aria-valuenow="Math.round(progress * 100)"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="dl-progress-bar" :style="{ transform: `scaleX(${progress})` }"></div>
            </div>
            <span class="dl-progress-label">{{ Math.round(progress * 100) }} %</span>
          </div>

          <p v-if="finished && status === 'ready'" class="dl-done">
            <i aria-hidden="true" class="bi bi-check-circle"></i> Fichier déchiffré et enregistré.
          </p>

          <button
            class="download-btn"
            :disabled="status === 'decrypting' || status === 'downloading'"
            @click="startDownload"
          >
            <template v-if="status === 'decrypting'">
              <span class="spinner-small" aria-hidden="true"></span> {{ download_json.ready?.downloadButton?.decrypting || 'Déchiffrement…' }}
            </template>
            <template v-else-if="status === 'downloading'">
              <span class="spinner-small" aria-hidden="true"></span> {{ download_json.ready?.downloadButton?.downloading || 'Téléchargement…' }}
            </template>
            <template v-else>
              <i aria-hidden="true" class="bi bi-cloud-download"></i> {{ download_json.ready?.downloadButton?.default || 'Télécharger' }}
            </template>
          </button>

          <p v-if="isV2" class="dl-trust">
            <i aria-hidden="true" class="bi bi-lock"></i>
            Déchiffré dans votre navigateur. Nos serveurs n’ont jamais eu accès à ce fichier.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Same dark top block as the home hero: a single task, centred */
.dl {
  min-height: calc(100dvh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem 5rem;
  background: var(--color-bg-deep);
}

.dl-card {
  width: 100%;
  max-width: var(--container-card);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 1.75rem;
  animation: card-in 0.35s cubic-bezier(0.32, 0.72, 0, 1) both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

.dl-title {
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

/* Loading */
.state-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 64px;
  color: var(--color-text-secondary);
}

/* Not found / error */
.state-error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.state-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-button);
  background: color-mix(in srgb, var(--color-danger) 14%, var(--color-surface-2));
  color: var(--color-danger-soft);
  font-size: var(--text-lg);
}

.state-error h2,
.file-info h2 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.state-error p {
  margin-top: 0.25rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

@media (hover: hover) {
  .btn-secondary:hover {
    background: var(--color-bg);
  }
}

/* Locked (password) */
.state-locked {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.state-locked .file-row {
  margin-bottom: 0.65rem;
}

.field-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.password-input {
  min-height: 48px;
  padding: 0 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-bg-deep);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.password-input:focus-visible {
  outline: none;
  border-color: var(--color-primary);
}

.password-input[aria-invalid='true'] {
  border-color: var(--color-danger);
}

.form-error {
  font-size: var(--text-sm);
  color: var(--color-danger-soft);
}

.state-locked .download-btn {
  margin-top: 0.4rem;
}

/* Ready */
.file-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  margin-bottom: 1.25rem;
}

.file-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-button);
  background: color-mix(in srgb, var(--color-primary-strong) 16%, var(--color-surface));
  color: var(--color-primary);
  font-size: var(--text-xl);
}

.file-info {
  min-width: 0;
}

.file-name {
  overflow-wrap: anywhere;
}

.file-info .meta {
  margin-top: 0.15rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

/* Notes, progress, trust line */
.dl-note,
.dl-done,
.dl-trust {
  display: flex;
  gap: 0.5rem;
  font-size: var(--text-sm);
  line-height: 1.5;
}

.dl-note {
  margin-bottom: 1rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-button);
  background: color-mix(in srgb, var(--color-primary-strong) 10%, var(--color-surface));
  color: var(--color-text-secondary);
}

.dl-note i {
  color: var(--color-primary);
}

.dl-done {
  margin-bottom: 1rem;
  color: var(--color-success);
}

.dl-trust {
  margin-top: 1rem;
  justify-content: center;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.dl-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.dl-progress-track {
  flex: 1;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-surface);
  overflow: hidden;
}

.dl-progress-bar {
  height: 100%;
  background: var(--color-primary);
  transform-origin: left;
  transition: transform 0.2s ease-out;
}

.dl-progress-label {
  min-width: 3.5ch;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
  text-align: right;
}

.download-btn {
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: none;
  border-radius: var(--radius-button);
  background: var(--color-primary-strong);
  color: #fff;
  font-family: inherit;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

@media (hover: hover) {
  .download-btn:hover:not(:disabled) {
    background: var(--color-primary-strong-hover);
  }
}

.download-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.download-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.download-btn:disabled {
  cursor: progress;
  background: color-mix(in srgb, var(--color-primary-strong) 55%, var(--color-surface-2));
}

.spinner,
.spinner-small {
  display: inline-block;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 2.5px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-top-color: var(--color-primary);
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dl-progress-bar {
    transition: none;
  }
}

@media (min-width: 768px) {
  .dl-card {
    padding: 2rem;
  }
}
</style>
