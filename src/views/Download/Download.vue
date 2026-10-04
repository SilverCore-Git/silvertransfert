<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getConfigValue } from '../../utils/config';
import download_json from '../../config/download.json';
// import { formatSize } from '../../utils/file';

const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const transferId = ref('');
const password = ref('');
const status = ref<'loading' | 'ready' | 'decrypting' | 'downloading' | 'error' | 'not_found'>('loading');
const transferInfo = ref<any>(null);
const errorMsg = ref('');

onMounted(async () => {
  // Parse URL: /download/:id#:passwd or similar
  // The route path is /download/:id
  transferId.value = route.params.id as string;
  password.value = window.location.hash.substring(1);

  if (!transferId.value || !password.value) {
    status.value = 'error';
    errorMsg.value = download_json.errors?.invalidLink || 'Lien de téléchargement invalide.';
    return;
  }

  await checkStatus();
});

async function checkStatus() {
  try {

    const response = await axios.get(`${API_URL}/data/status?id=${transferId.value}`);

    if (response.data) {
      transferInfo.value = response.data;
      status.value = 'ready';
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      status.value = 'not_found';
    } else {
      status.value = 'error';
      errorMsg.value = download_json.errors?.statusCheckFailed || 'Erreur lors de la récupération des informations.';
    }
  }
}

async function startDownload() {
  if (status.value !== 'ready') return;

  try {
    status.value = 'decrypting';
    
    // Step 1: Decrypt
    const decryptRes = await axios.post(`${API_URL}/data/decrypt`, {
      id: transferId.value,
      passwd: password.value
    });

    if (decryptRes.data.ready_to_download || decryptRes.data.status === 'processing') {
      // Wait for it to be ready if processing
      if (decryptRes.data.status === 'processing') {
        let attempts = 0;
        while (attempts < 30) {
          const statusRes = await axios.get(`${API_URL}/data/status`, {
            params: { id: transferId.value }
          });
          if (statusRes.data.canBeDownload) break;
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
        }
      }

      // Step 2: Download
      status.value = 'downloading';
      
      // Use a hidden form to trigger a native browser download via POST
      // This avoids loading the entire file into RAM (Blob) and respects server-side filename headers
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${API_URL}/data/download`;
      
      const fields = { id: transferId.value, passwd: password.value };
      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      // Wait a bit before resetting status so the UI feels responsive
      setTimeout(() => {
        status.value = 'ready';
      }, 2000);
    }
  } catch (error: any) {
    status.value = 'error';
    errorMsg.value = error.response?.data?.message || download_json.errors?.downloadFailed || 'Erreur lors du téléchargement.';
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

        <div v-else class="state-ready">
          <div class="file-row">
            <span class="file-icon" aria-hidden="true">
              <i class="bi" :class="transferInfo?.isZip ? 'bi-file-earmark-zip' : 'bi-file-earmark-lock2'"></i>
            </span>
            <div class="file-info">
              <h2>{{ (transferInfo?.isZip ? download_json.ready?.filesReady : download_json.ready?.fileReady) || 'Fichier prêt' }}</h2>
              <p class="meta">{{ getConfigValue('download.ready.fileId', { id: transferId }) }}</p>
            </div>
          </div>

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

.file-info .meta {
  margin-top: 0.15rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  word-break: break-all;
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

@media (min-width: 768px) {
  .dl-card {
    padding: 2rem;
  }
}
</style>
