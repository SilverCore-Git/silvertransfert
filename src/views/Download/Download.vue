<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getConfigValue } from '../../utils/config';
import home_json from '../../config/home.json';
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

  

  <div class="site-container">

    <div class="bg-grid" aria-hidden="true"></div>
    
    <section class="hero-section">

      <div class="glow g1" aria-hidden="true"></div>
      
      <div class="center">
        <router-link to="/" class="wordmark inline-block" aria-label="SilverTransfert, retour à l'accueil">{{ home_json.hero.title1 }}<span>{{ home_json.hero.title2 }}</span></router-link>
        <h1 class="tagline">{{ download_json.pageTitle || 'Réception de fichiers sécurisée' }}</h1>

        <div class="download-card" aria-live="polite">
          <div v-if="status === 'loading'" class="loading-state">
            <div class="spinner"></div>
            <p>{{ download_json.loading?.title || 'Vérification du transfert...' }}</p>
          </div>

          <div v-else-if="status === 'not_found'" class="error-state">
            <i aria-hidden="true" class="bi bi-exclamation-triangle"></i>
            <h2>{{ download_json.notFound?.title || 'Transfert introuvable' }}</h2>
            <p>{{ download_json.notFound?.message || 'Le lien est expiré ou n\'existe pas.' }}</p>
            <router-link to="/" class="back-btn">{{ download_json.notFound?.backButton || 'Retour à l\'accueil' }}</router-link>
          </div>

          <div v-else-if="status === 'error'" class="error-state">
            <i aria-hidden="true" class="bi bi-x-circle"></i>
            <h2>{{ download_json.error?.title || 'Une erreur est survenue' }}</h2>
            <p>{{ errorMsg }}</p>
            <router-link to="/" class="back-btn">{{ download_json.error?.backButton || 'Retour à l\'accueil' }}</router-link>
          </div>

          <div v-else class="ready-state">
            <div class="file-icon">
              <i aria-hidden="true" class="bi" :class="transferInfo?.isZip ? 'bi-file-earmark-zip' : 'bi-file-earmark-lock2'"></i>
            </div>
            <div class="file-info">
              <h2>{{ (transferInfo?.isZip ? download_json.ready?.filesReady : download_json.ready?.fileReady) || 'Fichier prêt' }}</h2>
              <p class="meta">{{ getConfigValue('download.ready.fileId', { id: transferId }) }}</p>
            </div>

            <button 
              class="download-btn" 
              :class="{ 'decrypting': status === 'decrypting', 'downloading': status === 'downloading' }"
              :disabled="status === 'decrypting' || status === 'downloading'"
              @click="startDownload"
            >
              <template v-if="status === 'decrypting'">
                <div class="spinner-small"></div> {{ download_json.ready?.downloadButton?.decrypting || 'Déchiffrement...' }}
              </template>
              <template v-else-if="status === 'downloading'">
                <div class="spinner-small"></div> {{ download_json.ready?.downloadButton?.downloading || 'Téléchargement...' }}
              </template>
              <template v-else>
                <i aria-hidden="true" class="bi bi-cloud-download"></i> {{ download_json.ready?.downloadButton?.default || 'Télécharger' }}
              </template>
            </button>
            
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.site-container {
  background: var(--color-bg);
  color: var(--color-text-soft);
  font-family: 'Outfit', sans-serif;
  min-height: 100dvh;
  position: relative;
}

.bg-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.hero-section {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(120px);
}

.g1 {
  width: 600px;
  height: 400px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, color-mix(in srgb, var(--color-primary-strong) 10%, transparent) 0%, transparent 70%);
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: var(--container-card);
  padding: 2rem;
}

.wordmark {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  color: var(--color-text);
  line-height: 0.9;
  margin: 0;
  animation: fadeInDown 0.6s ease-out;
}

.wordmark span {
  background: linear-gradient(135deg, var(--color-primary-strong) 0%, var(--color-primary-soft) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.tagline {
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  color: var(--color-text);
  font-weight: 400;
  margin: 1.5rem 0 2.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.download-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-3xl);
  padding: 3rem;
  backdrop-filter: blur(20px);
  text-align: center;
  animation: fadeInScale 0.6s ease-out;
}

.loading-state, .error-state, .ready-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-state {
  animation: fadeIn 0.6s ease-out;
}

.loading-state p {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes scalePulse {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
}

.ready-state {
  animation: fadeInUp 0.6s ease-out;
}

.file-icon {
  animation: scaleIn 0.5s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.file-icon::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-2xl);
  border: 2px solid color-mix(in srgb, var(--color-primary-strong) 30%, transparent);
  animation: borderPulse 2s ease-in-out infinite;
  opacity: 0;
}

@media (hover: hover) {
  .file-icon:hover::after {
    opacity: 1;
  }
}

@keyframes borderPulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.file-info {
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.download-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

@media (hover: hover) {
  .download-btn:hover:not(:disabled) {
    background: var(--color-primary);
    transform: translateY(-2px);
  }
}

@media (hover: hover) {
  .download-btn:not(:disabled):hover::before {
    left: 100%;
  }
}

.download-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.download-btn.decrypting {
  animation: decryptingPulse 1s ease-in-out infinite;
}

.download-btn.downloading {
  animation: downloadingPulse 0.8s ease-in-out infinite;
}

@keyframes decryptingPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-primary); }
  50% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--color-primary-strong) 0%, transparent); }
}

@keyframes downloadingPulse {
  0%, 100% { box-shadow: 0 0 0 green; }
  50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid color-mix(in srgb, var(--color-primary-strong) 20%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
  opacity: 0;
  transform: translateY(20px);
  }
  to {
  opacity: 1;
  transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
  opacity: 0;
  transform: scale(0.95);
  }
  to {
  opacity: 1;
  transform: scale(1);
  }
}

@keyframes scaleIn {
  from {
  opacity: 0;
  transform: scale(0.9);
  }
  to {
  opacity: 1;
  transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.error-state i {
  font-size: 3rem;
  color: var(--color-danger);
}

.error-state h2 {
  font-size: var(--text-lg);
  color: var(--color-text);
}

.error-state p {
  color: var(--color-text-muted);
  font-size: var(--text-base);
}

.back-btn {
  margin-top: 1rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--text-sm);
}

.file-icon {
  width: 64px;
  height: 64px;
  background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  color: var(--color-primary);
}

.file-info h2 {
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.file-info .meta {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-family: monospace;
}

@media (max-width: 640px) {
  .download-card {
    padding: 2rem 1.25rem;
  }
}
</style>
