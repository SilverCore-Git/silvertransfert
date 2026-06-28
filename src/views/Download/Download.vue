<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
// import { formatSize } from '../../utils/file';

const route = useRoute();
const router = useRouter();
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
    errorMsg.value = 'Lien de téléchargement invalide.';
    return;
  }

  await checkStatus();
});

async function checkStatus() {
  try {
    const response = await axios.get(`${API_URL}/data/status`, {
      params: { id: transferId.value }
    });
    
    if (response.data) {
      transferInfo.value = response.data;
      status.value = 'ready';
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      status.value = 'not_found';
    } else {
      status.value = 'error';
      errorMsg.value = 'Erreur lors de la récupération des informations.';
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
    errorMsg.value = error.response?.data?.message || 'Erreur lors du téléchargement.';
  }
}
</script>

<template>

  

  <div class="site-container">

    <div class="bg-grid" aria-hidden="true"></div>
    
    <section class="hero-section">

      <div class="glow g1" aria-hidden="true"></div>
      
      <div class="center">
        <h1 class="wordmark" @click="router.push('/')">Silver<span>Transfert</span></h1>
        <p class="tagline">Réception de fichiers sécurisée</p>

        <div class="download-card">
          <div v-if="status === 'loading'" class="loading-state">
            <div class="spinner"></div>
            <p>Vérification du transfert...</p>
          </div>

          <div v-else-if="status === 'not_found'" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <h3>Transfert introuvable</h3>
            <p>Le lien est expiré ou n'existe pas.</p>
            <router-link to="/" class="back-btn">Retour à l'accueil</router-link>
          </div>

          <div v-else-if="status === 'error'" class="error-state">
            <i class="bi bi-x-circle"></i>
            <h3>Une erreur est survenue</h3>
            <p>{{ errorMsg }}</p>
            <router-link to="/" class="back-btn">Retour à l'accueil</router-link>
          </div>

          <div v-else class="ready-state">
            <div class="file-icon">
              <i class="bi" :class="transferInfo?.isZip ? 'bi-file-earmark-zip' : 'bi-file-earmark-lock2'"></i>
            </div>
            <div class="file-info">
              <h3>{{ transferInfo?.isZip ? 'Fichiers prêts' : 'Fichier prêt' }} au déchiffrement</h3>
              <p class="meta">ID: {{ transferId }}</p>
            </div>

            <button 
              class="download-btn" 
              :class="{ 'decrypting': status === 'decrypting', 'downloading': status === 'downloading' }"
              :disabled="status === 'decrypting' || status === 'downloading'"
              @click="startDownload"
            >
              <template v-if="status === 'decrypting'">
                <div class="spinner-small"></div> Déchiffrement...
              </template>
              <template v-else-if="status === 'downloading'">
                <div class="spinner-small"></div> Téléchargement...
              </template>
              <template v-else>
                <i class="bi bi-cloud-download"></i> Télécharger
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
  background: #06050a;
  color: #e2e0f0;
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  position: relative;
}

.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.glow {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(120px);
}
.g1 {
  width: 600px; height: 400px; top: 10%; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(99, 86, 229, 0.1) 0%, transparent 70%);
}

.center {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; max-width: 500px; padding: 2rem;
}

.wordmark {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  color: #fff;
  line-height: 0.9;
  margin: 0;
  animation: fadeInDown 0.6s ease-out;
}
.wordmark span {
  background: linear-gradient(135deg, #6356e5 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}


.tagline {
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  color: #fff;
  font-weight: 400;
  margin: 1.5rem 0 2.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.download-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
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

/* Loading Animation */
.loading-state {
  animation: fadeIn 0.6s ease-out;
}

.loading-state p {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Spinner Animation */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 86, 229, 0.2);
  border-top-color: #6356e5;
  border-radius: 50%;
  animation: spin 1s linear infinite, scalePulse 1.5s ease-in-out infinite;
}

@keyframes scalePulse {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
}

/* Ready State Animations */
.ready-state {
  animation: fadeInUp 0.6s ease-out;
}

.file-icon {
  width: 64px;
  height: 64px;
  background: rgba(99, 86, 229, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #6356e5;
  animation: scaleIn 0.5s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.file-icon::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  border: 2px solid rgba(99, 86, 229, 0.3);
  animation: borderPulse 2s ease-in-out infinite;
  opacity: 0;
}

.file-icon:hover::after {
  opacity: 1;
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
  background: #6356e5;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.download-btn:not(:disabled):hover {
  background: #7267f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 86, 229, 0.4);
}

.download-btn:not(:disabled):hover::before {
  left: 100%;
}

.download-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #4a475a;
}

.download-btn.decrypting {
  animation: decryptingPulse 1s ease-in-out infinite;
}

.download-btn.downloading {
  animation: downloadingPulse 0.8s ease-in-out infinite;
}

@keyframes decryptingPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 86, 229, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(99, 86, 229, 0); }
}

@keyframes downloadingPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 86, 229, 0.2);
  border-top-color: #6356e5;
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
  color: #ef4444;
}

.error-state h3 { font-size: 1.25rem; color: #fff; }
.error-state p { color: #a09cb4; font-size: 0.95rem; }

.back-btn {
  margin-top: 1rem;
  color: #6356e5;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.file-icon {
  width: 64px;
  height: 64px;
  background: rgba(99, 86, 229, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #6356e5;
}

.file-info h3 { font-size: 1.25rem; color: #fff; margin-bottom: 0.25rem; }
.file-info .meta { color: #635c87; font-size: 0.8rem; font-family: monospace; }

.download-btn {
  width: 100%;
  padding: 1rem;
  background: #6356e5;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.download-btn:hover:not(:disabled) {
  background: #7267f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 86, 229, 0.4);
}

.download-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.security-note {
  font-size: 0.75rem;
  color: #635c87;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
