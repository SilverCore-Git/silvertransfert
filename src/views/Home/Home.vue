<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { formatSize } from '../../utils/file';
import { uploadTransfer } from '../../lib/transfer';
import home_json from "../../config/home.json";

// Components
import DropZone from './components/ui/DropZone.vue';
import FileList from './components/ui/FileList.vue';
import UploadProgress from './components/ui/UploadProgress.vue';
import TransferResult from './components/ui/TransferResult.vue';
import FaqSection from './components/ui/FaqSection.vue';
import { scrollToCurrentHash } from '../../router';

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
// Mot de passe optionnel, en plus de la clé contenue dans le lien
const protect = ref(false);
const userPassword = ref('');
const showPassword = ref(false);
const MIN_USER_PASSWORD = 6;
const uploadStartTime = ref(0);
const uploadSpeed = ref(0);
const termsAccepted = ref(false);
// "Mode envoi": the tool panel glides to the centre while the hero copy fades out
const focusMode = ref(false);
const panelRef = ref<HTMLElement | null>(null);
const copyRef = ref<HTMLElement | null>(null);
const showCopy = ref(true);
const copyLeaving = ref(false);
const copyStyle = ref<Record<string, string>>({});
// Le site annonce 10 Go, mais le serveur garde une petite marge technique
// jusqu'à 11.5 Go : on aligne le blocage côté client sur cette vraie limite
// plutôt que d'être rigide pile à 10 Go.
const MAX_TOTAL_SIZE = 11.5 * 1024 * 1024 * 1024;

// Icons for the "steps" and "guarantees" sections, in config order
const stepIcons: string[] = ['bi-cloud-arrow-up', 'bi-link-45deg', 'bi-trash3'];
const featureIcons: string[] = ['bi-geo-alt', 'bi-shield-lock', 'bi-hdd-stack'];

// Computed
const totalSize = computed(() => files.value.reduce((s, f) => s + f.size, 0));
const exceedsLimit = computed(() => totalSize.value > MAX_TOTAL_SIZE);
const passwordTooShort = computed(() => protect.value && userPassword.value.length < MIN_USER_PASSWORD);

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
  const change = () => { files.value = files.value.filter(f => f.id !== id); };
  // Removing the last file also leaves the centred mode: one single animation for both
  if (files.value.length === 1) exitFocus(change);
  else animateLayout(change);
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  const list = e.dataTransfer?.files ?? null;
  if (!list?.length) return;
  // Move to the centre and grow with the new files in the same animation
  enterFocus(() => addFiles(list));
}

function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  // Copy the list first: clearing the input empties input.files
  const list = input.files ? Array.from(input.files) : [];
  input.value = '';
  if (!list.length) return onPickerCancel();
  const dt = new DataTransfer();
  list.forEach(f => dt.items.add(f));
  animateLayout(() => addFiles(dt.files));
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Quick start, soft landing: efficient but never abrupt
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const MOVE_MS = 560;
const FADE_MS = 220;

// Animations pause in background tabs: never let the layout switch wait on them forever
// (a cancelled animation rejects .finished: treat it as settled too)
function settle(anim: Animation, ms: number) {
  return Promise.race([anim.finished.catch(() => {}), new Promise(r => setTimeout(r, ms + 50))]);
}

/**
 * FLIP on the tool panel: measure its box, apply the change (content and/or centred mode),
 * then animate position, width and height together from the old box to the new one.
 * Width/height are animated for real (no scale), so the content keeps its size and never
 * jumps. The layout box moves with its size (centred / right-aligned), so we measure where
 * it sits at the starting size and translate from there: first and last frames are exact.
 */
let layoutToken = 0;
async function animateLayout(change: () => void, toFocus?: boolean) {
  const panel = panelRef.value;
  const token = ++layoutToken;
  const first = panel?.getBoundingClientRect();
  // A newer change interrupts the running one: start from the current visual box, with the
  // previous animation's temporary styles removed (otherwise its max-width override leaks)
  panel?.getAnimations().forEach(a => a.cancel());
  panel?.classList.remove('is-resizing');
  if (panel) panel.style.maxWidth = '';
  change();
  if (toFocus !== undefined) focusMode.value = toFocus;
  await nextTick();
  if (!panel || !first || reducedMotion()) return;
  const last = panel.getBoundingClientRect();
  const resizes = Math.abs(first.width - last.width) > 1 || Math.abs(first.height - last.height) > 1;
  let start = last;
  if (resizes) {
    panel.style.maxWidth = 'none';
    panel.style.width = `${first.width}px`;
    panel.style.height = `${first.height}px`;
    start = panel.getBoundingClientRect();
    panel.style.width = '';
    panel.style.height = '';
  }
  const opts = { duration: MOVE_MS, easing: EASE };
  const anims = [panel.animate(
    [{ transform: `translate(${first.left - start.left}px, ${first.top - start.top}px)` }, { transform: 'none' }],
    opts
  )];
  if (resizes) {
    panel.classList.add('is-resizing');
    anims.push(panel.animate(
      [
        { width: `${first.width}px`, height: `${first.height}px` },
        { width: `${last.width}px`, height: `${last.height}px` }
      ],
      opts
    ));
  }
  await Promise.all(anims.map(a => settle(a, MOVE_MS)));
  if (token !== layoutToken) return; // a newer animation owns the panel now
  panel.classList.remove('is-resizing');
  panel.style.maxWidth = '';
}

// Hero copy leaving: taken out of the flow at its current spot, so the panel can start
// moving immediately while the text fades (no empty gap, no waiting). Anchored to the hero
// section, which does not move (the grid re-centres itself once the copy leaves the flow).
let copyToken = 0;
function releaseCopy() {
  const copy = copyRef.value;
  const grid = copy?.closest('.hero');
  const token = ++copyToken;
  if (!copy || !grid || reducedMotion()) {
    showCopy.value = false;
    return;
  }
  const c = copy.getBoundingClientRect();
  const g = grid.getBoundingClientRect();
  copyStyle.value = { top: `${c.top - g.top}px`, left: `${c.left - g.left}px`, width: `${c.width}px` };
  copyLeaving.value = true;
  settle(copy.animate(
    [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-24px)' }],
    { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' }
  ), FADE_MS).then(() => {
    if (token !== copyToken) return;
    showCopy.value = false;
    copyLeaving.value = false;
    copyStyle.value = {};
  });
}

async function enterFocus(change: () => void = () => {}) {
  if (focusMode.value) return animateLayout(change);
  releaseCopy();
  await animateLayout(change, true);
}

async function exitFocus(change?: () => void) {
  if (!focusMode.value) return change && animateLayout(change);
  // Cancel a copy fade still running, then let the copy come back in the final layout
  copyToken++;
  copyRef.value?.getAnimations().forEach(a => a.cancel());
  copyLeaving.value = false;
  copyStyle.value = {};
  showCopy.value = true;
  await animateLayout(change ?? (() => {}), false);
}

function openPicker() {
  // Open the dialog right away, inside the click's user activation (Safari is strict about
  // it); the panel glides to the centre behind it.
  fileInputRef.value?.click();
  if (focusMode.value) return;
  enterFocus();
  watchPickerClose();
}

// Browsers without the input "cancel" event: once the window gets focus back and nothing
// was picked, return to the split layout
function watchPickerClose() {
  window.addEventListener('focus', () => {
    setTimeout(() => {
      if (!files.value.length && !isUploading.value && !done.value) exitFocus();
    }, 400);
  }, { once: true });
}

// Dialog closed without choosing anything: go back to the split layout
function onPickerCancel() {
  if (!files.value.length) exitFocus();
}

async function transfer() {
  if (!files.value.length || isUploading.value || exceedsLimit.value || passwordTooShort.value) return;

  // Panel shrinks to the progress ring in the same smooth animation
  animateLayout(() => {
    isUploading.value = true;
    uploadError.value = '';
  });
  uploadPct.value = 0;
  uploadStartTime.value = Date.now();
  uploadSpeed.value = 0;

  try {
    // Chiffrement dans le navigateur : la clé ne quitte jamais cette page.
    const path = await uploadTransfer(files.value.map(f => f.file), {
      password: protect.value ? userPassword.value : undefined,
      onProgress: (sent, total) => {
        const elapsed = (Date.now() - uploadStartTime.value) / 1000;
        if (elapsed > 0) uploadSpeed.value = sent / elapsed;
        uploadPct.value = total ? Math.round((sent * 100) / total) : 100;
      }
    });
    link.value = `${window.location.host}${path}`;
    animateLayout(() => {
      done.value = true;
      isUploading.value = false;
    });
  } catch (error) {
    console.error('Upload failed:', error);
    animateLayout(() => {
      uploadError.value = "L'envoi a échoué. Vérifiez votre connexion puis réessayez.";
      isUploading.value = false;
    });
  }
}

async function copyLink() {
  copyFailed.value = false;
  try {
    await navigator.clipboard.writeText('https://' + link.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    copyFailed.value = true;
  }
}

function reset() {
  // "Nouveau transfert": stay centred, back to an empty drop zone, and open the file dialog
  // straight away (inside the click). Cancelling it returns to the split layout.
  fileInputRef.value?.click();
  watchPickerClose();
  animateLayout(() => {
    files.value = [];
    done.value = false;
    uploadPct.value = 0;
    link.value = '';
    copyFailed.value = false;
    uploadError.value = '';
    isUploading.value = false;
    termsAccepted.value = false;
    protect.value = false;
    userPassword.value = '';
    showPassword.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  });
}
</script>

<template>
  <div class="home">
    <section class="hero" :class="{ 'is-focus': focusMode }" id="accueil">
      <div class="container hero-grid">
        <div v-if="showCopy" ref="copyRef" class="hero-copy" :class="{ 'is-leaving': copyLeaving }" :style="copyStyle">
          <h1 class="hero-title">
            {{ home_json.hero.headline }}
            <span class="hero-title-soft">{{ home_json.hero.headlineAccent }}</span>
          </h1>
          <p class="hero-sub">{{ home_json.hero.subtitle }}</p>
        </div>

        <div ref="panelRef" class="tool-panel">
          <!-- Lives outside the v-if/v-else below so "Nouveau transfert" can open it from the result screen -->
          <input ref="fileInputRef" type="file" multiple class="hidden" @change="onInput" @cancel="onPickerCancel" />
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

                <div v-if="files.length > 0 && !isUploading" class="file-actions">
                  <div class="protect-field">
                    <label class="terms-checkbox">
                      <input type="checkbox" v-model="protect" class="checkbox-input" aria-controls="userPassword" />
                      <span class="checkbox-custom checkbox-square" aria-hidden="true"></span>
                      <span class="terms-text">
                        Protéger par un mot de passe
                        <span class="field-hint">En plus du lien. À transmettre par un autre canal.</span>
                      </span>
                    </label>
                    <div v-if="protect" class="password-row">
                      <label for="userPassword" class="sr-only">Mot de passe du transfert</label>
                      <input
                        id="userPassword"
                        v-model="userPassword"
                        :type="showPassword ? 'text' : 'password'"
                        class="password-input"
                        autocomplete="new-password"
                        placeholder="Mot de passe"
                        :aria-invalid="passwordTooShort && userPassword.length > 0"
                        aria-describedby="userPasswordHint"
                      />
                      <button type="button" class="password-toggle" :aria-pressed="showPassword" @click="showPassword = !showPassword">
                        <i aria-hidden="true" class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                        <span class="sr-only">{{ showPassword ? 'Masquer' : 'Afficher' }} le mot de passe</span>
                      </button>
                    </div>
                    <p v-if="protect" id="userPasswordHint" class="field-hint" :class="{ 'is-error': passwordTooShort && userPassword.length > 0 }">
                      {{ MIN_USER_PASSWORD }} caractères minimum. Sans lui, le fichier ne pourra pas être ouvert.
                    </p>
                  </div>

                  <label class="terms-checkbox">
                    <input
                      type="checkbox"
                      v-model="termsAccepted"
                      id="acceptTerms"
                      class="checkbox-input"
                    />
                    <span class="checkbox-custom" aria-hidden="true"></span>
                    <span class="terms-text">
                      {{ home_json.hero.termsAcceptance?.checkboxLabel || 'J\'ai lu et j\'accepte les ' }}
                      <router-link to="/cgu" class="legal-link">{{ home_json.hero.termsAcceptance?.cguLink || 'conditions générales d\'utilisation' }}</router-link>
                      {{ home_json.hero.termsAcceptance?.checkboxLabel && ' et la ' }}
                      <router-link to="/politique-de-confidentialite" class="legal-link">{{ home_json.hero.termsAcceptance?.privacyLink || 'politique de confidentialité' }}</router-link>
                    </span>
                  </label>

                  <p v-if="exceedsLimit" role="alert" class="form-error">
                    Taille totale trop importante ({{ formatSize(totalSize) }}). Maximum autorisé : 10 Go par envoi.
                  </p>

                  <p v-if="uploadError" role="alert" class="form-error">{{ uploadError }}</p>

                  <div class="send-row">
                    <span class="size-hint">
                      {{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ formatSize(totalSize) }}
                    </span>
                    <button class="send-btn" @click="transfer" :disabled="!termsAccepted || exceedsLimit || passwordTooShort">
                      <i aria-hidden="true" class="bi bi-send-fill"/> {{ home_json.hero.sendButton?.label || 'Envoyer' }}
                    </button>
                  </div>
                  <p v-if="!termsAccepted" class="send-hint">{{ home_json.hero.sendButton?.disabled }}</p>
                </div>
            </div>

          <ul class="tool-facts" aria-label="Conditions d'envoi">
            <li v-for="fact in home_json.hero.toolFacts" :key="fact.label">
              <i aria-hidden="true" class="bi" :class="fact.icon"></i>{{ fact.label }}
            </li>
          </ul>
        </div>
      </div>

      <router-link v-if="!focusMode" to="/#comment-ca-marche" class="scroll-cue" aria-label="Voir comment ça marche" @click="scrollToCurrentHash('/#comment-ca-marche')">
        <i aria-hidden="true" class="bi bi-chevron-down"></i>
      </router-link>
    </section>

    <section class="steps" id="comment-ca-marche">
      <div class="container">
        <h2 class="section-title">{{ home_json.steps.title }}</h2>
        <ol class="steps-list">
          <li v-for="(step, index) in home_json.steps.items" :key="step.title" class="step">
            <span class="step-icon" aria-hidden="true"><i class="bi" :class="stepIcons[index]"></i></span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="guarantees" id="presentation">
      <div class="container">
        <h2 class="section-title">{{ home_json.presentation.title }}</h2>
        <div class="bento">
          <article
            v-for="(feature, index) in home_json.presentation.features"
            :key="feature.title"
            class="bento-cell"
            :class="{ 'bento-main': index === 0 }"
          >
            <i aria-hidden="true" class="bi bento-icon" :class="featureIcons[index]"></i>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </article>
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
.home {
  color: var(--color-text-soft);
}

.container {
  max-width: var(--container-page);
  margin: 0 auto;
  padding: 0 1.25rem;
}

.section-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: 2.5rem;
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  min-height: calc(100dvh - 64px);
  display: flex;
  align-items: center;
  padding: 3rem 0 5rem;
  background: var(--color-bg-deep);
}

.hero-grid {
  width: 100%;
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

.hero-copy {
  /* comes back once the panel has slid home */
  animation: copy-in 0.4s cubic-bezier(0.32, 0.72, 0, 1) 0.18s both;
}

@keyframes copy-in {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: none; }
}

/* Mode envoi: one centred column, slightly wider panel */
/* leaving copy floats where it was while it fades */
.hero-copy.is-leaving {
  position: absolute;
  pointer-events: none;
  animation: none;
}

.hero.is-focus .hero-grid {
  grid-template-columns: 1fr;
}

.hero.is-focus .tool-panel {
  justify-self: center;
  max-width: 560px;
}

.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  width: 44px;
  height: 44px;
  margin-left: -22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  animation: cue-in 0.6s ease-out 0.5s both, cue-bounce 2.8s ease-in-out 1.1s infinite;
  transition: color 0.2s ease;
}

@media (hover: hover) {
  .scroll-cue:hover {
    color: var(--color-text);
  }
}

@keyframes cue-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cue-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.hero-title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--color-text);
}

.hero-title-soft {
  display: block;
  color: var(--color-text-secondary);
}

.hero-sub {
  margin-top: 1.25rem;
  max-width: 34ch;
  font-size: var(--text-lg);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* ---------- Tool panel (the product is the hero visual) ---------- */
.tool-panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--container-card);
  justify-self: center;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 1rem;
}

/* While the panel resizes, the content area absorbs the change (clipped) and the facts row
   rides on the bottom edge instead of jumping */
.tool-panel > :not(.tool-facts) {
  flex: 1 1 auto;
  min-height: 0;
}

.tool-panel.is-resizing {
  overflow: hidden;
}

.tool-panel.is-resizing > :not(.tool-facts) {
  overflow: hidden;
}

.tool-facts {
  flex-shrink: 0;
}

.upload-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tool-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 1rem;
  padding: 0.9rem 0.25rem 0.1rem;
  border-top: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.tool-facts li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tool-facts i {
  color: var(--color-primary);
}

.file-actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0 0.25rem;
}

.protect-field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field-hint {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.field-hint.is-error {
  color: var(--color-danger-soft);
}

.checkbox-custom.checkbox-square {
  border-radius: 5px;
}

.password-row {
  display: flex;
  gap: 0.5rem;
  padding-left: calc(18px + 0.75rem);
}

.password-input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 0 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-bg-deep);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--text-sm);
  transition: border-color 0.2s;
}

.password-input::placeholder {
  color: var(--color-text-muted);
}

.password-input:focus-visible {
  outline: none;
  border-color: var(--color-primary);
}

.password-input[aria-invalid='true'] {
  border-color: var(--color-danger);
}

.password-toggle {
  width: 44px;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

@media (hover: hover) {
  .password-toggle:hover {
    background: var(--hover-background);
    color: var(--color-text);
  }
}

.password-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.protect-field > .field-hint {
  padding-left: calc(18px + 0.75rem);
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
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
  margin-top: 2px;
  border: 1.5px solid var(--color-text-muted);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;
}

.checkbox-custom::before {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: translateY(-1px) rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary-strong);
  border-color: var(--color-primary-strong);
}

.checkbox-input:checked + .checkbox-custom::before {
  opacity: 1;
}

.checkbox-input:focus-visible + .checkbox-custom {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.legal-link {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
}

@media (hover: hover) {
  .legal-link:hover {
    text-decoration: underline;
  }
}

.form-error {
  font-size: var(--text-sm);
  color: var(--color-danger-soft);
}

.send-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.size-hint {
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

.send-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
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
  .send-btn:hover:not(:disabled) {
    background: var(--color-primary-strong-hover);
  }
}

.send-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.send-btn:disabled {
  background: var(--color-disabled);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.send-hint {
  margin-top: -0.5rem;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: right;
}

/* ---------- Steps ---------- */
.steps {
  padding: 4rem 0;
  border-top: 1px solid var(--color-border);
}

.steps-list {
  position: relative;
  display: grid;
  gap: 2rem;
  list-style: none;
}

/* vertical rail on mobile */
.steps-list::before {
  content: '';
  position: absolute;
  top: 22px;
  bottom: 22px;
  left: 21px;
  width: 1px;
  background: var(--color-border);
}

.step {
  position: relative;
  padding-left: 4rem;
}

.step-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface-2);
  color: var(--color-primary);
  font-size: var(--text-lg);
  z-index: 1;
}

.step h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  line-height: 44px;
}

.step p {
  margin-top: 0.25rem;
  max-width: 32ch;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ---------- Guarantees (bento) ---------- */
.guarantees {
  padding: 4rem 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.bento {
  display: grid;
  gap: 1rem;
}

.bento-cell {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 1.75rem;
}

.bento-main {
  background: color-mix(in srgb, var(--color-primary-strong) 12%, var(--color-surface-2));
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
}

.bento-icon {
  display: inline-block;
  font-size: var(--text-xl);
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.bento-main .bento-icon {
  font-size: 2.5rem;
}

.bento-cell h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.bento-main h3 {
  font-size: var(--text-xl);
}

.bento-cell p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 48ch;
}

/* Form appears with the panel growth (CSS animation, no Vue transition): it leaves the DOM
   instantly, so the panel can measure its final size and shrink in a single animation */
.file-actions {
  animation: reveal-in 0.35s cubic-bezier(0.32, 0.72, 0, 1) 0.12s both;
}

@keyframes reveal-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

/* ---------- Breakpoints ---------- */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }

  .steps, .guarantees {
    padding: 6rem 0;
  }

  .steps-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  /* horizontal segments joining each icon to the next one */
  .steps-list::before {
    display: none;
  }

  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 22px;
    left: calc(44px + 1rem);
    right: calc(-2.5rem + 1rem);
    height: 1px;
    background: var(--color-border);
  }

  .step {
    padding-left: 0;
  }

  .step-icon {
    position: relative;
    margin-bottom: 1.25rem;
  }

  .step h3 {
    line-height: 1.3;
  }

  .bento {
    grid-template-columns: 1.15fr 1fr;
    grid-template-rows: auto auto;
  }

  .bento-main {
    grid-row: span 2;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 320px;
  }

  .bento-main .bento-icon {
    margin-bottom: auto;
    padding-bottom: 2rem;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: 4rem 0 6rem;
  }

  .hero-grid {
    grid-template-columns: 1.05fr 1fr;
    gap: 4rem;
  }

  .tool-panel {
    justify-self: end;
  }
}

@media (max-width: 480px) {
  .send-row {
    flex-direction: column;
    align-items: stretch;
  }

  .send-btn {
    justify-content: center;
  }

  .send-hint {
    text-align: center;
  }
}
</style>
