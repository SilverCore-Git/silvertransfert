<script setup lang="ts">
import { ref, computed } from 'vue';

// --- Types ---
interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

// --- State ---
const isDragging = ref(false);
const files = ref<FileItem[]>([]);
const transferMode = ref<'link' | 'email'>('link');
const emailRecipient = ref('');
const emailSender = ref('');
const message = ref('');
const password = ref('');
const expiryDays = ref(7);
const showAdvanced = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadDone = ref(false);
const generatedLink = ref('');
const linkCopied = ref(false);

// --- Computed ---
const totalSize = computed(() =>
  files.value.reduce((acc, f) => acc + f.size, 0)
);

const totalSizeFormatted = computed(() => formatSize(totalSize.value));

const canTransfer = computed(() =>
  files.value.length > 0 && (transferMode.value === 'link' || emailRecipient.value.trim() !== '')
);

// --- Helpers ---
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'bi-file-image-fill';
  if (type.startsWith('video/')) return 'bi-file-play-fill';
  if (type.startsWith('audio/')) return 'bi-file-music-fill';
  if (type.includes('pdf')) return 'bi-file-pdf-fill';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'bi-file-zip-fill';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'bi-file-spreadsheet-fill';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'bi-file-slides-fill';
  if (type.includes('word') || type.includes('document')) return 'bi-file-word-fill';
  if (type.includes('text/')) return 'bi-file-text-fill';
  if (type.includes('javascript') || type.includes('json') || type.includes('html') || type.includes('css')) return 'bi-file-code-fill';
  return 'bi-file-earmark-fill';
}

function getFileColor(type: string): string {
  if (type.startsWith('image/')) return '#8b5cf6';
  if (type.startsWith('video/')) return '#f59e0b';
  if (type.startsWith('audio/')) return '#ec4899';
  if (type.includes('pdf')) return '#ef4444';
  if (type.includes('zip') || type.includes('rar')) return '#f97316';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return '#10b981';
  if (type.includes('presentation') || type.includes('powerpoint')) return '#f97316';
  if (type.includes('word')) return '#3b82f6';
  if (type.includes('text/')) return '#6366f1';
  return '#6b7280';
}

function addFiles(newFiles: FileList | null) {
  if (!newFiles) return;
  for (const file of Array.from(newFiles)) {
    const exists = files.value.some(f => f.name === file.name && f.size === file.size);
    if (exists) continue;
    const item: FileItem = {
      id: Math.random().toString(36).slice(2),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    };
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => { item.preview = e.target?.result as string; };
      reader.readAsDataURL(file);
    }
    files.value.push(item);
  }
}

function removeFile(id: string) {
  files.value = files.value.filter(f => f.id !== id);
}

// --- Drag & Drop ---
function onDragOver(e: DragEvent) {
  e.preventDefault();
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  addFiles(e.dataTransfer?.files ?? null);
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement;
  addFiles(input.files);
  input.value = '';
}

// --- Simulate Upload ---
async function startTransfer() {
  if (!canTransfer.value) return;
  isUploading.value = true;
  uploadProgress.value = 0;

  // Simulate progress
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 12;
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100;
      clearInterval(interval);
      setTimeout(() => {
        isUploading.value = false;
        uploadDone.value = true;
        generatedLink.value = 'https://swiftdrop.io/t/' + Math.random().toString(36).slice(2, 10).toUpperCase();
      }, 400);
    }
  }, 180);
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    linkCopied.value = true;
    setTimeout(() => { linkCopied.value = false; }, 2000);
  } catch {
    // fallback
  }
}

function reset() {
  files.value = [];
  uploadDone.value = false;
  uploadProgress.value = 0;
  generatedLink.value = '';
  emailRecipient.value = '';
  emailSender.value = '';
  message.value = '';
  password.value = '';
}
</script>

<template>
  <main class="upload-page">
    <!-- Hero headline -->
    <div class="hero-text">
      <h1>Transférez vos fichiers,<br><span class="gradient-text">instantanément.</span></h1>
      <p class="hero-sub">Sans limite de taille · Chiffré de bout en bout · Lien valable jusqu'à 30 jours</p>
    </div>

    <!-- Upload Card -->
    <div class="upload-card">

      <!-- SUCCESS STATE -->
      <div v-if="uploadDone" class="success-state">
        <div class="success-icon">
          <i class="bi bi-check-lg"></i>
        </div>
        <h2>Transfert prêt !</h2>
        <p class="success-sub">
          {{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ totalSizeFormatted }}
        </p>

        <div v-if="transferMode === 'link'" class="link-result">
          <div class="link-box">
            <i class="bi bi-link-45deg"></i>
            <span class="link-url">{{ generatedLink }}</span>
          </div>
          <button class="btn-copy" @click="copyLink">
            <i :class="linkCopied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
            {{ linkCopied ? 'Copié !' : 'Copier le lien' }}
          </button>
        </div>

        <div v-else class="email-sent-notice">
          <i class="bi bi-envelope-check-fill"></i>
          <span>Email envoyé à <strong>{{ emailRecipient }}</strong></span>
        </div>

        <button class="btn-new-transfer" @click="reset">
          <i class="bi bi-arrow-counterclockwise"></i>
          Nouveau transfert
        </button>
      </div>

      <!-- UPLOAD STATE -->
      <template v-else>

        <!-- Drop Zone -->
        <div
          class="dropzone"
          :class="{ dragging: isDragging, 'has-files': files.length > 0 }"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          @click="($refs.fileInput as HTMLInputElement)?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            style="display: none"
            @change="onFileInput"
          />

          <!-- Empty state -->
          <div v-if="files.length === 0" class="dropzone-empty">
            <div class="drop-icon-wrap">
              <div class="drop-icon-ring"></div>
              <i class="bi bi-cloud-upload drop-icon"></i>
            </div>
            <p class="drop-label">Glissez vos fichiers ici</p>
            <p class="drop-sublabel">ou <span class="click-link">parcourez vos fichiers</span></p>
            <p class="drop-hint">Tous formats · Taille illimitée</p>
          </div>

          <!-- Files list -->
          <div v-else class="file-list" @click.stop>
            <div
              v-for="item in files"
              :key="item.id"
              class="file-item"
            >
              <div class="file-thumb">
                <img v-if="item.preview" :src="item.preview" :alt="item.name" />
                <i v-else :class="'bi ' + getFileIcon(item.type)" :style="{ color: getFileColor(item.type) }"></i>
              </div>
              <div class="file-info">
                <span class="file-name">{{ item.name }}</span>
                <span class="file-size">{{ formatSize(item.size) }}</span>
              </div>
              <button class="file-remove" @click.stop="removeFile(item.id)" aria-label="Supprimer">
                <i class="bi bi-x"></i>
              </button>
            </div>

            <!-- Add more -->
            <button
              class="add-more-btn"
              @click.stop="($refs.fileInput as HTMLInputElement)?.click()"
            >
              <i class="bi bi-plus-circle"></i>
              Ajouter des fichiers
            </button>
          </div>
        </div>

        <!-- Summary bar (when files added) -->
        <div v-if="files.length > 0" class="file-summary">
          <div class="summary-info">
            <i class="bi bi-files"></i>
            <span>{{ files.length }} fichier{{ files.length > 1 ? 's' : '' }}</span>
            <span class="dot">·</span>
            <span>{{ totalSizeFormatted }}</span>
          </div>
        </div>

        <!-- Transfer Mode Toggle -->
        <div class="mode-toggle">
          <button
            class="mode-btn"
            :class="{ active: transferMode === 'link' }"
            @click="transferMode = 'link'"
          >
            <i class="bi bi-link-45deg"></i>
            Lien de partage
          </button>
          <button
            class="mode-btn"
            :class="{ active: transferMode === 'email' }"
            @click="transferMode = 'email'"
          >
            <i class="bi bi-envelope"></i>
            Par e-mail
          </button>
        </div>

        <!-- Email fields -->
        <div v-if="transferMode === 'email'" class="email-fields">
          <div class="input-group">
            <label>Destinataire</label>
            <div class="input-wrap">
              <i class="bi bi-person"></i>
              <input
                v-model="emailRecipient"
                type="email"
                placeholder="destinataire@exemple.com"
                autocomplete="email"
              />
            </div>
          </div>
          <div class="input-group">
            <label>Votre e-mail <span class="optional">optionnel</span></label>
            <div class="input-wrap">
              <i class="bi bi-envelope"></i>
              <input
                v-model="emailSender"
                type="email"
                placeholder="votre@email.com"
              />
            </div>
          </div>
          <div class="input-group">
            <label>Message <span class="optional">optionnel</span></label>
            <textarea
              v-model="message"
              placeholder="Ajoutez un message personnalisé..."
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Advanced options toggle -->
        <button class="advanced-toggle" @click="showAdvanced = !showAdvanced">
          <i class="bi bi-sliders2"></i>
          Options avancées
          <i :class="showAdvanced ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="chevron"></i>
        </button>

        <!-- Advanced options -->
        <div v-if="showAdvanced" class="advanced-options">
          <div class="option-row">
            <div class="input-group flex-1">
              <label><i class="bi bi-lock"></i> Mot de passe <span class="optional">optionnel</span></label>
              <div class="input-wrap">
                <i class="bi bi-key"></i>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Protéger avec un mot de passe"
                />
              </div>
            </div>
            <div class="input-group expiry-group">
              <label><i class="bi bi-calendar3"></i> Expiration</label>
              <div class="expiry-select">
                <select v-model="expiryDays">
                  <option :value="1">1 jour</option>
                  <option :value="3">3 jours</option>
                  <option :value="7">7 jours</option>
                  <option :value="14">14 jours</option>
                  <option :value="30">30 jours</option>
                </select>
                <i class="bi bi-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload progress -->
        <div v-if="isUploading" class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <span class="progress-label">Envoi en cours… {{ Math.round(uploadProgress) }}%</span>
        </div>

        <!-- CTA Button -->
        <button
          class="btn-transfer"
          :class="{ disabled: !canTransfer, uploading: isUploading }"
          :disabled="!canTransfer || isUploading"
          @click="startTransfer"
        >
          <template v-if="isUploading">
            <span class="spinner"></span>
            Envoi en cours…
          </template>
          <template v-else>
            <i class="bi bi-send-fill"></i>
            {{ transferMode === 'link' ? 'Générer le lien' : 'Envoyer par e-mail' }}
          </template>
        </button>

        <!-- Trust badges -->
        <div class="trust-row">
          <span class="trust-item"><i class="bi bi-shield-lock-fill"></i> Chiffrement E2E</span>
          <span class="trust-item"><i class="bi bi-server"></i> Stocké en France</span>
          <span class="trust-item"><i class="bi bi-infinity"></i> Taille illimitée</span>
        </div>

      </template>
    </div>
  </main>
</template>

<style scoped>
/* ── Layout ────────────────────────────────────── */
.upload-page {
  min-height: calc(100vh - 64px - 280px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem 4rem;
  gap: 2rem;
}

/* ── Hero text ─────────────────────────────────── */
.hero-text {
  text-align: center;
}

.hero-text h1 {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, #a855f7 60%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 0.9rem;
  color: #71717a;
  letter-spacing: 0.01em;
}

/* ── Card ──────────────────────────────────────── */
.upload-card {
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.03),
    0 12px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Drop Zone ─────────────────────────────────── */
.dropzone {
  border: 2px dashed #e4e4e7;
  border-radius: 14px;
  background: #fafafa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.dropzone:hover,
.dropzone.dragging {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.03);
}

.dropzone.dragging {
  background: rgba(99, 102, 241, 0.06);
  box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.dropzone.has-files {
  cursor: default;
  min-height: auto;
  align-items: flex-start;
  border-style: solid;
  border-color: #e4e4e7;
}

.dropzone.has-files:hover {
  border-color: #e4e4e7;
  background: #fafafa;
}

/* Empty state */
.dropzone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 2rem;
  text-align: center;
  user-select: none;
}

.drop-icon-wrap {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.drop-icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  animation: pulse-ring 2.5s ease infinite;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.12); opacity: 0.3; }
}

.drop-icon {
  font-size: 1.75rem;
  color: var(--primary);
  position: relative;
  z-index: 1;
}

.drop-label {
  font-size: 0.975rem;
  font-weight: 600;
  color: var(--text);
}

.drop-sublabel {
  font-size: 0.85rem;
  color: #71717a;
}

.click-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.drop-hint {
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-top: 0.15rem;
}

/* File List */
.file-list {
  width: 100%;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.6rem;
  border-radius: 9px;
  background: white;
  border: 1px solid #f0f0f0;
  transition: border-color 0.15s;
}

.file-item:hover {
  border-color: #e4e4e7;
}

.file-thumb {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  overflow: hidden;
}

.file-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.file-name {
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.72rem;
  color: #a1a1aa;
}

.file-remove {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: none;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.15s;
  flex-shrink: 0;
}

.file-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}

.add-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem;
  border-radius: 9px;
  border: 1.5px dashed #d4d4d8;
  background: none;
  color: #71717a;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.15s;
  margin-top: 0.15rem;
}

.add-more-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99, 102, 241, 0.04);
}

/* Summary bar */
.file-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.25rem;
  border-top: 1px solid #f4f4f5;
  margin-top: -0.25rem;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #71717a;
}

.dot { color: #d4d4d8; }

/* ── Mode Toggle ───────────────────────────────── */
.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  background: #f4f4f5;
  border-radius: 12px;
  padding: 0.3rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 9px;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 500;
  color: #71717a;
  cursor: pointer;
  transition: all 0.18s ease;
}

.mode-btn.active {
  background: white;
  color: var(--primary);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(99,102,241,0.12);
}

/* ── Inputs ────────────────────────────────────── */
.email-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #52525b;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.optional {
  font-weight: 400;
  color: #a1a1aa;
  font-size: 0.72rem;
}

.input-wrap {
  position: relative;
}

.input-wrap > i {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a1a1aa;
  font-size: 0.85rem;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  padding: 0.6rem 0.875rem 0.6rem 2.25rem;
  border: 1.5px solid #e4e4e7;
  border-radius: 9px;
  font-size: 0.875rem;
  color: var(--text);
  background: white;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.input-wrap input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-group textarea {
  width: 100%;
  padding: 0.6rem 0.875rem;
  border: 1.5px solid #e4e4e7;
  border-radius: 9px;
  font-size: 0.875rem;
  color: var(--text);
  background: white;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;
  font-family: inherit;
  box-sizing: border-box;
}

.input-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* ── Advanced Options ──────────────────────────── */
.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: none;
  border: none;
  color: #71717a;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}

.advanced-toggle:hover { color: var(--primary); }

.chevron {
  margin-left: auto;
  font-size: 0.7rem;
}

.advanced-options {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 0.875rem;
}

.option-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.flex-1 { flex: 1; min-width: 160px; }

.expiry-group { min-width: 130px; }

.expiry-select {
  position: relative;
}

.expiry-select select {
  width: 100%;
  padding: 0.6rem 2rem 0.6rem 0.875rem;
  border: 1.5px solid #e4e4e7;
  border-radius: 9px;
  font-size: 0.875rem;
  color: var(--text);
  background: white;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s;
}

.expiry-select select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.select-arrow {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a1a1aa;
  font-size: 0.7rem;
  pointer-events: none;
}

/* ── Progress ──────────────────────────────────── */
.progress-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-bar {
  height: 5px;
  background: #f0f0f0;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #a855f7);
  border-radius: 99px;
  transition: width 0.2s ease;
}

.progress-label {
  font-size: 0.75rem;
  color: #71717a;
  text-align: right;
}

/* ── CTA Button ────────────────────────────────── */
.btn-transfer {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, #818cf8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  letter-spacing: 0.01em;
}

.btn-transfer:hover:not(.disabled):not(.uploading) {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(99, 102, 241, 0.45);
}

.btn-transfer.disabled {
  background: #e4e4e7;
  color: #a1a1aa;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-transfer.uploading {
  cursor: wait;
  opacity: 0.85;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Trust row ─────────────────────────────────── */
.trust-row {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: #a1a1aa;
  font-weight: 500;
}

.trust-item i {
  color: var(--accent);
  font-size: 0.75rem;
}

/* ── Success state ─────────────────────────────── */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-state h2 {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}

.success-sub {
  font-size: 0.85rem;
  color: #71717a;
}

.link-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.5rem 0;
}

.link-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-size: 0.85rem;
}

.link-box i {
  color: var(--primary);
  font-size: 1rem;
  flex-shrink: 0;
}

.link-url {
  color: var(--primary);
  font-weight: 600;
  word-break: break-all;
}

.btn-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.7rem;
  border-radius: 10px;
  border: 1.5px solid var(--primary);
  background: rgba(99, 102, 241, 0.06);
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-copy:hover {
  background: rgba(99, 102, 241, 0.12);
}

.email-sent-notice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #065f46;
  margin: 0.5rem 0;
}

.email-sent-notice i {
  color: var(--accent);
  font-size: 1.1rem;
}

.btn-new-transfer {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.25rem;
  border-radius: 9px;
  border: 1.5px solid #e4e4e7;
  background: none;
  color: #52525b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 0.5rem;
}

.btn-new-transfer:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99, 102, 241, 0.04);
}

/* ── Responsive ────────────────────────────────── */
@media (max-width: 600px) {
  .upload-page {
    padding: 1.5rem 0.75rem 3rem;
  }

  .upload-card {
    border-radius: 16px;
    padding: 1.25rem;
  }

  .option-row {
    flex-direction: column;
  }

  .trust-row {
    gap: 0.75rem;
  }
}
</style>