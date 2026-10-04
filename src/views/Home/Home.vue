<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatSize } from '../../utils/file';
import axios from 'axios';
import home_json from "../../config/home.json";

// Components
import DropZone from './components/ui/DropZone.vue';
import FileList from './components/ui/FileList.vue';
import UploadProgress from './components/ui/UploadProgress.vue';
import TransferResult from './components/ui/TransferResult.vue';
import FaqSection from './components/ui/FaqSection.vue';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Types
interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

// State
const isDragging = ref(false);
const files = ref<FileItem[]>([]);
const isUploading = ref(false);
const uploadPct = ref(0);
const done = ref(false);
const link = ref('');
const copied = ref(false);
const copyFailed = ref(false);
const uploadError = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);
const passwordLength = ref(12);
const MIN_PASSWORD_LENGTH = 10;
const uploadStartTime = ref(0);
const uploadSpeed = ref(0);
const termsAccepted = ref(false);
// Le site annonce 10 Go, mais le serveur garde une petite marge technique
// jusqu'à 11.5 Go : on aligne le blocage côté client sur cette vraie limite
// plutôt que d'être rigide pile à 10 Go.
const MAX_TOTAL_SIZE = 11.5 * 1024 * 1024 * 1024;

// Feature icons mapping
const featureIcons: string[] = ['bi-lightning-charge', 'bi-shield-lock', 'bi-incognito'];

function getFeatureIcon(index: number): string {
  return featureIcons[index] || 'bi-lightning-charge';
}

// Computed
const totalSize = computed(() => files.value.reduce((s, f) => s + f.size, 0));
const exceedsLimit = computed(() => totalSize.value > MAX_TOTAL_SIZE);

const estimatedTimeRemaining = computed(() => {
  if (uploadPct.value <= 0 || uploadSpeed.value <= 0) return null;
  const remainingPct = 100 - uploadPct.value;
  const remainingSize = (totalSize.value * remainingPct) / 100;
  const secondsRemaining = remainingSize / uploadSpeed.value;
  return formatTime(secondsRemaining);
});

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// Logic
async function getSecurePass(len: number = 8) {
  try {
    const res = await axios.get(`${API_URL}/passwd/${len}`);
    return res.data;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

function addFiles(list: FileList | null) {
  if (!list) return;
  for (const f of Array.from(list)) {
    if (files.value.some(x => x.name === f.name && x.size === f.size)) continue;
    const item: FileItem = { 
      id: Math.random().toString(36).slice(2), 
      file: f, 
      name: f.name, 
      size: f.size, 
      type: f.type 
    };
    
    files.value.push(item);

    if (f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = e => { 
        const index = files.value.findIndex(x => x.id === item.id);
        if (index !== -1) {
          files!.value[index]!.preview = e.target?.result as string;
        }
      };
      r.readAsDataURL(f);
    }
  }
}

function removeFile(id: string) {
  files.value = files.value.filter(f => f.id !== id);
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  addFiles(e.dataTransfer?.files ?? null);
}

function onInput(e: Event) {
  addFiles((e.target as HTMLInputElement).files);
  (e.target as HTMLInputElement).value = '';
}

function openPicker() {
  fileInputRef.value?.click();
}

async function transfer() {
  if (!files.value.length || isUploading.value || exceedsLimit.value) return;

  isUploading.value = true;
  uploadError.value = '';
  uploadPct.value = 0;
  uploadStartTime.value = Date.now();
  uploadSpeed.value = 0;
  
  const transferId = Math.random().toString(36).slice(2, 10);
  const passwd = await getSecurePass(passwordLength.value);
  
  const formData = new FormData();
  files.value.forEach(f => {
    formData.append('file', f.file);
  });

  try {
    const response = await axios.post(`${API_URL}/upload/file`, formData, {
      params: { id: transferId, passwd },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const now = Date.now();
          const elapsed = (now - uploadStartTime.value) / 1000; // en secondes
          const currentSpeed = progressEvent.loaded / elapsed;
          uploadSpeed.value = currentSpeed > 0 ? currentSpeed : uploadSpeed.value;
          uploadPct.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    });

    if (response.data.status === 'await_crypting' || response.data.status === 'OK') {
      const origin = window.location.origin;
      link.value = `${origin.replace('http://', '').replace('https://', '')}/t/${transferId}#${passwd}`;
      done.value = true;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    uploadError.value = "L'envoi a échoué. Vérifiez votre connexion puis réessayez.";
  } finally {
    isUploading.value = false;
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText('https://' + link.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    copyFailed.value = true;
  }
}

function reset() {
  files.value = [];
  done.value = false;
  uploadPct.value = 0;
  link.value = '';
  copyFailed.value = false;
  uploadError.value = '';
  isUploading.value = false;
  termsAccepted.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}


</script>

<template>
  <div class="site-container " id="accueil">
    <div class="bg-grid" aria-hidden="true"></div>

    <section class="hero-section">
      <div class="glow g1" aria-hidden="true"></div>
      <div class="glow g2" aria-hidden="true"></div>

      <div class="center px-4">
        <p class="wordmark" >{{ home_json.hero.title1 }}<span>{{ home_json.hero.title2 }}</span></p>
        <h1 class="tagline">
          {{ home_json.hero.tagline || 'Transfert sécurisé de fichiers' }}
        </h1>

        <Transition name="fade" mode="out-in">
          <TransferResult 
            v-if="done"
            :files-count="files.length"
            :total-size="totalSize"
            :link="link"
            :copied="copied"
            :copy-failed="copyFailed"
            @copy="copyLink"
            @reset="reset"
          />

          <div v-else class="upload-wrap">
            <DropZone 
              :is-dragging="isDragging"
              :files="files"
              :is-uploading="isUploading"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
              @open-picker="openPicker"
            >
              <FileList 
                :files="files" 
                @remove="removeFile" 
                @add="openPicker" 
              />

              <template #uploading>
                <UploadProgress :upload-pct="uploadPct" :estimated-time="estimatedTimeRemaining" />
              </template>
            </DropZone>

            <input ref="fileInputRef" type="file" multiple class="hidden" @change="onInput" />

            <Transition name="fade">
              <div v-if="files.length > 0 && !isUploading" class="file-actions-container">
                <div class="w-full font-sans">
                  <div class="flex justify-between items-baseline mb-2">
                    <label 
                      for="passwordLength" 
                      class="text-xs font-medium text-[var(--color-text)] uppercase tracking-wider"
                      >
                      {{ home_json.hero.encryptionSlider?.label || 'Complexité du chiffrement' }}
                    </label>
                    <span 
                      class="text-sm font-semibold text-(--color-primary) tabular-nums"
                      >
                      {{ passwordLength }}
                    </span>
                  </div>
                  
                  <div class="relative flex items-center">
                    <input 
                      type="range" 
                      id="passwordLength" 
                      v-model.number="passwordLength" 
                      :min="MIN_PASSWORD_LENGTH" 
                      :max="32"
                      class="w-full h-1 appearance-none cursor-pointer rounded-full bg-(--color-primary)
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110
                            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--color-primary) [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-transform active:[&::-moz-range-thumb]:scale-110"
                      :style="{ '--progress': ((passwordLength - MIN_PASSWORD_LENGTH) / (32 - MIN_PASSWORD_LENGTH)) * 100 + '%' }"
                    />
                  </div>
                </div>

                <div class="terms-container">
                  <label class="terms-checkbox">
                    <input 
                      type="checkbox" 
                      v-model="termsAccepted"
                      id="acceptTerms"
                      class="checkbox-input"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="terms-text">
                      {{ home_json.hero.termsAcceptance?.checkboxLabel || 'J\'ai lu et j\'accepte les ' }}
                      <router-link to="/cgu" class="legal-link">{{ home_json.hero.termsAcceptance?.cguLink || 'conditions générales d\'utilisation' }}</router-link> 
                      {{ home_json.hero.termsAcceptance?.checkboxLabel && ' et la ' }}
                      <router-link to="/politique-de-confidentialite" class="legal-link">{{ home_json.hero.termsAcceptance?.privacyLink || 'politique de confidentialité' }}</router-link>
                    </span>
                  </label>
                </div>

                <p v-if="exceedsLimit" role="alert" class="size-limit-warning">
                  Taille totale trop importante ({{ formatSize(totalSize) }}). Maximum autorisé : 10 Go par envoi.
                </p>

                <p v-if="uploadError" role="alert" class="size-limit-warning">{{ uploadError }}</p>

                <div class="below-ring">
                  <span class="size-hint">
                    {{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ formatSize(totalSize) }}
                  </span>
                  <button class="send-btn" @click="transfer" :disabled="!termsAccepted || exceedsLimit">
                    <i aria-hidden="true" class="bi bi-send-fill"/> {{ home_json.hero.sendButton?.label || 'Envoyer' }}
                  </button>
                </div>
                <p v-if="!termsAccepted" class="send-hint">{{ home_json.hero.sendButton?.disabled }}</p>
              </div>
              <p v-else-if="!isUploading" class="drop-hint">
                {{ home_json.hero.dropHint || 'Chiffrement AES‑256‑CBC · Hébergement en France · Conservation 30 j · 10 Go' }}
              </p>
            </Transition>
          </div>
        </Transition>
      </div>

      <div class="scroll-indicator" aria-hidden="true">
        <i aria-hidden="true" class="bi bi-chevron-down"/>
      </div>
    </section>

    <section class="presentation-section" id="presentation">
      <div class="content-limit">
        <header class="section-header">
          <h2 class="section-title">{{ home_json.presentation?.title || 'Hébergé en France, chiffré, supprimé après 30 jours' }}</h2>
        </header>

        <div class="grid-features">
          <div v-for="(feature, index) in home_json.presentation?.features || []" :key="index" class="feature-card">
            <div class="f-icon-wrap">
              <i aria-hidden="true" class="bi" :class="getFeatureIcon(Number(index))"/>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>

        <div class="premium-banner">
          <div class="pb-content">
            <h2>{{ home_json.presentation?.premiumBanner?.title || 'Silvertransfert, un service de Silvercore.' }}</h2>
            <p>{{ home_json.presentation?.premiumBanner?.description || 'Silvercore conçoit des services en ligne simples et sécurisés, hébergés en France, pour les particuliers comme pour les professionnels.' }}</p>
            <a href="https://www.silvercore.fr" target="_blank" rel="noopener" class="premium-btn">{{ home_json.presentation?.premiumBanner?.button || 'Visiter Silvercore' }}</a>
          </div>
        </div>
      </div>
    </section>

    <FaqSection />

  </div>
  
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.site-container {
  background: var(--color-bg);
  color: var(--color-text-soft);
  font-family: 'Outfit', sans-serif;
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

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  padding: 1rem;
  width: 100%;
}

.file-actions-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 24rem;
  gap: 1.5rem;
  margin: 0 auto;
}

.below-ring {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;
}

.size-hint {
  font-variant-numeric: tabular-nums;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.size-limit-warning {
  font-size: var(--text-xs);
  color: var(--color-danger-soft);
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.terms-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  max-width: 100%;
  font-size: var(--text-xs);
  color: var(--color-text);
  line-height: 1.5;
  transition: color 0.3s;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  position: relative;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 2px solid var(--color-text-secondary);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.checkbox-custom:before {
  content: '';
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary-strong);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-custom:before {
  opacity: 1;
}

.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-strong) 20%, transparent);
}

.terms-text {
  flex: 1;
}

.legal-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

@media (hover: hover) {
  .legal-link:hover {
    color: var(--color-primary-soft);
    text-decoration: underline;
  }
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-disabled);
  box-shadow: none;
  transform: none;
}

@media (hover: hover) {
  .send-btn:disabled:hover {
    background: var(--color-disabled);
    transform: none;
    box-shadow: none;
  }
}

@media (hover: hover) {
  .send-btn:hover {
    background: var(--color-primary-strong-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px color-mix(in srgb, var(--color-primary-strong) 50%, transparent);
  }
}

.drop-hint {
  font-size: var(--text-xs);
  color: var(--color-text);
  letter-spacing: 0.04em;
  text-align: center;
}

.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  font-size: var(--text-xl);
  color: color-mix(in srgb, var(--color-primary-strong) 40%, transparent);
  animation: bounce 2s infinite;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

@media (hover: hover) {
  .scroll-indicator:hover {
    color: var(--color-primary);
    transform: scale(1.2);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.hero-section {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 90vh;
    padding: 1rem 0;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 85vh;
  }
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
  background: var(--color-primary);
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
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.feature-card {
  opacity: 0;
  transform: translateY(30px);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-primary-strong), transparent);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

@media (hover: hover) {
  .feature-card:hover::before {
    transform: scaleX(1);
  }
}

.feature-card:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.feature-card:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.feature-card:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.f-icon-wrap {
  transition: color 0.4s ease, background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease, opacity 0.4s ease;
}

@media (hover: hover) {
  .feature-card:hover .f-icon-wrap {
    background: color-mix(in srgb, var(--color-primary-strong) 20%, transparent);
    transform: scale(1.1) rotate(5deg);
  }
}

.premium-banner {
  margin-top: 6rem;
  position: relative;
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-strong) 10%, transparent) 0%, transparent 100%);
  border: 1px solid color-mix(in srgb, var(--color-primary-strong) 20%, transparent);
  border-radius: var(--radius-4xl);
  padding: 4rem 2rem;
  text-align: center;
  overflow: hidden;
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
}

.premium-banner h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite;
  background-size: 200% auto;
}

.premium-banner p {
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  line-height: 1.6;
}

.premium-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  text-decoration: none;
  border-radius: 9999px;
  font-weight: 700;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
  position: relative;
  overflow: hidden;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.premium-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

@media (hover: hover) {
  .premium-btn:hover::before {
    left: 100%;
  }
}

.upload-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: var(--container-card);
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.send-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-primary-strong);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  font-family: 'Outfit',sans-serif;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary-strong) 40%, transparent);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.send-btn::before {
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
  .send-btn:hover:not(:disabled) {
    background: var(--color-primary-strong-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px color-mix(in srgb, var(--color-primary-strong) 50%, transparent);
  }
}

@media (hover: hover) {
  .send-btn:hover:not(:disabled)::before {
    left: 100%;
  }
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px color-mix(in srgb, var(--color-primary-strong) 40%, transparent);
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(120px);
  animation: breathe 10s ease-in-out infinite;
}

.g1 {
  width: 800px;
  height: 600px;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, color-mix(in srgb, var(--color-primary-strong) 10%, transparent) 0%, transparent 70%);
}

.g2 {
  width: 400px;
  height: 350px;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, color-mix(in srgb, var(--color-primary-soft) 6%, transparent) 0%, transparent 70%);
  animation-delay: -5s;
}

@keyframes breathe {
  0%,100% { opacity:0.6; transform: translateX(-50%) scale(1); }
  50%      { opacity:1;   transform: translateX(-50%) scale(1.15); }
}

.content-limit {
  max-width: var(--container-page);
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .content-limit {
    padding: 0 2rem;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.presentation-section {
  padding: 8rem 0;
  background: #08070f99;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .presentation-section {
    padding: 10rem 0;
  }
}

@media (min-width: 1024px) {
  .presentation-section {
    padding: 12rem 0;
  }
}

.grid-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

@media (min-width: 1536px) {
  .grid-features {
    gap: 3rem;
  }
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 3.5rem 2.5rem;
  border-radius: var(--radius-3xl);
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

@media (hover: hover) {
  .feature-card:hover {
    transform: translateY(-8px);
    border-color: color-mix(in srgb, var(--color-primary-strong) 30%, transparent);
    background: color-mix(in srgb, var(--color-primary-strong) 3%, transparent);
  }
}

.f-icon-wrap {
  width: 54px;
  height: 54px;
  background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.feature-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-text);
}

.feature-card p {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .premium-banner {
    margin-top: 8rem;
    padding: 5rem 3rem;
  }

  .premium-banner h2 {
    font-size: 2.8rem;
  }
}

@media (min-width: 768px) {
  .premium-banner {
    margin-top: 8rem;
    padding: 5rem 3rem;
  }

  .premium-banner h2 {
    font-size: 2.8rem;
  }

  .premium-btn {
    padding: 1rem 2.8rem;
    font-size: var(--text-base);
  }
}

@media (min-width: 1024px) {
  .premium-banner {
    margin-top: 10rem;
    padding: 6rem 4rem;
  }

  .premium-banner h2 {
    font-size: 3rem;
  }

  .premium-btn {
    padding: 1.1rem 3rem;
    font-size: var(--text-base);
  }
}

@media (min-width: 1536px) {
  .premium-banner {
    padding: 7rem 5rem;
  }

  .premium-banner h2 {
    font-size: 3.5rem;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .send-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 1536px) {
  .feature-card {
    padding: 4rem 3rem;
  }

  .premium-banner {
    padding: 7rem 5rem;
  }

  .premium-banner h2 {
    font-size: 3.5rem;
  }
}

.send-btn {
  padding: 0.8rem 2rem;
  font-size: var(--text-base);
}

.send-hint {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-align: right;
  width: 100%;
  margin: -0.25rem 0 0;
}

.premium-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (hover: hover) {
  .premium-btn:hover {
    transform: none;
    box-shadow: none;
    border-color: var(--color-primary);
  }
}

.drop-hint {
  text-wrap: balance;
}
</style>
