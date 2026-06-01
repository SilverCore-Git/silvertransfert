<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { formatSize } from '../../utils/file';
import axios from 'axios';

// Components
import DropZone from './components/ui/DropZone.vue';
import FileList from './components/ui/FileList.vue';
import UploadProgress from './components/ui/UploadProgress.vue';
import TransferResult from './components/ui/TransferResult.vue';

// Configuration
const API_URL = 'http://localhost:84';

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
const fileInputRef = ref<HTMLInputElement | null>(null);

// Computed
const totalSize = computed(() => files.value.reduce((s, f) => s + f.size, 0));

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
    if (f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = e => { item.preview = e.target?.result as string; };
      r.readAsDataURL(f);
    }
    files.value.push(item);
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
  if (!files.value.length || isUploading.value) return;
  
  isUploading.value = true;
  uploadPct.value = 0;
  
  const file = files.value[0].file;
  const transferId = Math.random().toString(36).slice(2, 10);
  const passwd = Math.random().toString(36).slice(2, 8);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', transferId);

  try {
    const response = await axios.post(`${API_URL}/upload/file`, formData, {
      params: { id: transferId, passwd },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadPct.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    });

    if (response.data.status === 'await_crypting' || response.data.status === 'OK') {
      link.value = response.data.downloadPath || `localhost:5173/download/${transferId}#${passwd}`;
      done.value = true;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Erreur lors de l\'envoi du fichier. Assurez-vous que le serveur API est lancé.');
  } finally {
    isUploading.value = false;
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText('https://' + link.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {}
}

function reset() {
  files.value = [];
  done.value = false;
  uploadPct.value = 0;
  link.value = '';
}

// Scroll Reveal Logic
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
</script>

<template>
  <div class="site-container">
    <!-- Background Grid -->
    <div class="bg-grid" aria-hidden="true"></div>

    <!-- Hero Section (Full Viewport) -->
    <section class="hero-section">
      <!-- Ambient glows -->
      <div class="glow g1" aria-hidden="true"></div>
      <div class="glow g2" aria-hidden="true"></div>

      <!-- Top navigation -->
      <nav class="top-nav reveal">
        <a href="#accueil" class="nav-btn">Accueil</a>
        <a href="#presentation" class="nav-btn">Présentation</a>
        <a href="#faq" class="nav-btn">FAQ</a>
      </nav>

      <!-- Main center -->
      <div class="center" id="accueil">
        <!-- Wordmark -->
        <h1 class="wordmark reveal">Silver<span>Transfer</span></h1>
        <p class="tagline reveal">Souveraineté. Sécurité. Simplicité.</p>

        <!-- SUCCESS -->
        <Transition name="fade" mode="out-in">
          <TransferResult 
            v-if="done"
            :files-count="files.length"
            :total-size="totalSize"
            :link="link"
            :copied="copied"
            @copy="copyLink"
            @reset="reset"
          />

          <!-- DROP ZONE -->
          <div v-else class="upload-wrap reveal">
            <DropZone 
              :is-dragging="isDragging"
              :files="files"
              :is-uploading="isUploading"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
              @open-picker="openPicker"
            >
              <!-- File List Slot -->
              <FileList 
                :files="files" 
                @remove="removeFile" 
                @add="openPicker" 
              />

              <!-- Uploading Slot -->
              <template #uploading>
                <UploadProgress :upload-pct="uploadPct" />
              </template>
            </DropZone>

            <input ref="fileInputRef" type="file" multiple style="display:none" @change="onInput" />

            <!-- Below -->
            <Transition name="fade">
              <div v-if="files.length > 0 && !isUploading" class="below-ring">
                <span class="size-hint">
                  {{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ formatSize(totalSize) }}
                </span>
                <button class="send-btn" @click="transfer">
                  <i class="bi bi-send-fill"></i> Envoyer
                </button>
              </div>
              <p v-else-if="!isUploading" class="drop-hint">Chiffrement AES-256 · Infrastructure Souveraine · Conservation 7j</p>
            </Transition>
          </div>
        </Transition>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator reveal">
        <i class="bi bi-chevron-down"></i>
      </div>
    </section>

    <!-- Presentation Section -->
    <section class="presentation-section" id="presentation">
      <div class="content-limit">
        <header class="section-header reveal">
          <span class="eyebrow">Engagement</span>
          <h2 class="section-title">L'excellence au service de vos échanges</h2>
        </header>

        <div class="grid-features">
          <div class="feature-card reveal">
            <div class="f-icon-wrap">
              <i class="bi bi-shield-lock"></i>
            </div>
            <h3>Souveraineté Totale</h3>
            <p>Vos données sont protégées par le droit français, loin de toute ingérence étrangère. Nous opérons nos propres clusters de stockage.</p>
          </div>
          <div class="feature-card reveal">
            <div class="f-icon-wrap">
              <i class="bi bi-lightning-charge"></i>
            </div>
            <h3>Vitesse de Pointe</h3>
            <p>Notre infrastructure est optimisée pour le transit massif de données, garantissant des débits symétriques constants.</p>
          </div>
          <div class="feature-card reveal">
            <div class="f-icon-wrap">
              <i class="bi bi-incognito"></i>
            </div>
            <h3>Confidentialité Absolue</h3>
            <p>Zéro connaissance. Nous ne pouvons pas lire vos fichiers. Le lien est votre clé de déchiffrement unique.</p>
          </div>
        </div>

        <div class="premium-banner reveal">
          <div class="pb-content">
            <h2>Plus qu'un transfert, un standard.</h2>
            <p>Découvrez comment Silvercore redéfinit la confiance numérique pour les professionnels et les particuliers exigeants.</p>
            <a href="https://www.silvercore.fr" target="_blank" class="premium-btn">Visiter Silvercore</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" id="faq">
      <div class="content-limit">
        <header class="section-header reveal">
          <span class="eyebrow">Support</span>
          <h2 class="section-title">Vos questions, nos réponses</h2>
        </header>

        <div class="faq-grid">
          <div class="faq-card reveal">
            <h4>Capacité de stockage ?</h4>
            <p>Chaque envoi est limité à 10 Go. Pour des besoins supérieurs, nos offres entreprises sont à votre disposition.</p>
          </div>
          <div class="faq-card reveal">
            <h4>Sécurité des serveurs ?</h4>
            <p>Nos serveurs sont durcis selon les recommandations de l'ANSSI et font l'objet d'audits réguliers.</p>
          </div>
          <div class="faq-card reveal">
            <h4>Disponibilité ?</h4>
            <p>Nos services affichent un taux de disponibilité (SLA) de 99,99%, assurant la continuité de vos activités.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Footer -->
    <footer class="site-footer reveal">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <div class="f-logo">Silver<span>Transfer</span></div>
          <p class="f-tagline">L'infrastructure souveraine pour vos données sensibles.</p>
        </div>

        <div class="footer-links-grid">
          <div class="f-group">
            <h6>Produit</h6>
            <a href="#accueil">Transfert</a>
            <a href="#presentation">Fonctionnalités</a>
            <a href="#faq">Questions</a>
          </div>
          <div class="f-group">
            <h6>Légal</h6>
            <a href="#">Confidentialité</a>
            <a href="#">CGU</a>
            <a href="#">Mentions</a>
          </div>
          <div class="f-group">
            <h6>Compagnie</h6>
            <a href="https://www.silvercore.fr" target="_blank">Silvercore</a>
            <a href="https://status.silvercore.fr" target="_blank">Status</a>
          </div>
        </div>
      </div>

      <div class="footer-copyright">
        <span>© 2026 Silvercore — Hébergé en France</span>
        <div class="f-socials">
          <a href="#"><i class="bi bi-twitter-x"></i></a>
          <a href="#"><i class="bi bi-github"></i></a>
          <a href="#"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.site-container {
  background: #06050a;
  color: #e2e0f0;
  font-family: 'Outfit', sans-serif;
  scroll-behavior: smooth;
  position: relative;
}

/* Background Grid */
.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Glows */
.glow {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(120px); animation: breathe 10s ease-in-out infinite;
}
.g1 {
  width: 800px; height: 600px; top: -10%; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(99, 86, 22, 0.12) 0%, transparent 70%);
}
.g2 {
  width: 400px; height: 350px; bottom: 5%; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(167, 139, 250, 0.06) 0%, transparent 70%);
  animation-delay: -5s;
}
@keyframes breathe {
  0%,100% { opacity:0.6; transform: translateX(-50%) scale(1); }
  50%      { opacity:1;   transform: translateX(-50%) scale(1.15); }
}

/* Top Nav */
.top-nav {
  position: fixed; top: 1.5rem; right: 2rem; z-index: 100;
  display: flex; align-items: center; gap: 0.75rem;
}
.nav-btn {
  background: rgba(10, 8, 20, 0.4); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a09cb4; padding: 0.55rem 1.35rem; border-radius: 100px; text-decoration: none;
  font-size: 0.8rem; font-weight: 500; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px); letter-spacing: 0.02em;
}
.nav-btn:hover { 
  background: rgba(99, 86, 229, 0.12); border-color: rgba(99, 86, 229, 0.4);
  color: #fff; transform: translateY(-1px);
}

/* Center */
.center {
  display: flex; flex-direction: column; align-items: center;
  z-index: 1; padding: 1rem; width: 100%;
}

/* Wordmark */
.wordmark {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  color: #fff;
  line-height: 0.9;
  margin: 0;
}
.wordmark span {
  background: linear-gradient(135deg, #6356e5 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Tagline */
.tagline {
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  color: #5c567e;
  font-weight: 400;
  margin: 1.5rem 0 2.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Upload wrap */
.upload-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: 1.2rem; width: 100%; max-width: 440px;
}

.below-ring { display:flex; align-items:center; justify-content:space-between; width:100%; gap:1.5rem; }
.size-hint  { font-size:0.75rem; color:#4a4468; font-weight: 500; }
.send-btn {
  display:flex; align-items:center; gap:0.6rem; padding:0.65rem 1.6rem;
  background:#6356e5; color:white; border:none; border-radius:12px;
  font-size:0.85rem; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif;
  box-shadow: 0 4px 20px rgba(99, 86, 229, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.send-btn:hover { 
  background:#7267f0; transform:translateY(-2px); 
  box-shadow: 0 8px 30px rgba(99, 86, 229, 0.5);
}
.drop-hint { font-size:0.7rem; color:#3a3652; letter-spacing:0.04em; text-align:center; }

/* Scroll Indicator */
.scroll-indicator {
  position: absolute; bottom: 3rem;
  font-size: 1.5rem; color: rgba(99, 86, 229, 0.4);
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Reveal Animation */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Sections Common */
.content-limit { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section-header { text-align: center; margin-bottom: 5rem; }
.eyebrow { 
  display: block; font-size: 0.75rem; font-weight: 700; color: #6356e5; 
  text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;
}
.section-title { 
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 4vw, 2.75rem); 
  font-weight: 700; color: #fff; letter-spacing: -0.02em;
}

/* Presentation Section */
.presentation-section {
  padding: 12rem 0; background: rgba(8, 7, 15, 0.6); position: relative; z-index: 1;
}
.grid-features {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem;
}
.feature-card {
  background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 3.5rem 2.5rem; border-radius: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative; overflow: hidden;
}
.feature-card:hover { 
  transform: translateY(-8px); border-color: rgba(99, 86, 229, 0.3);
  background: rgba(99, 86, 229, 0.03);
}
.f-icon-wrap {
  width: 54px; height: 54px; background: rgba(99, 86, 229, 0.1);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: #6356e5; margin-bottom: 2rem;
}
.feature-card h3 { 
  font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; 
  font-weight: 600; margin-bottom: 1.25rem; color: #fff; 
}
.feature-card p { font-size: 0.95rem; line-height: 1.7; color: #7a7499; }

.premium-banner {
  margin-top: 10rem; position: relative;
  background: linear-gradient(135deg, rgba(99, 86, 229, 0.1) 0%, transparent 100%);
  border: 1px solid rgba(99, 86, 229, 0.2); border-radius: 40px;
  padding: 6rem 4rem; text-align: center; overflow: hidden;
}
.premium-banner h2 { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; margin-bottom: 1.5rem; }
.premium-banner p { color: #8a84a5; max-width: 600px; margin: 0 auto 3rem; font-size: 1.1rem; }
.premium-btn {
  display: inline-block; padding: 1.1rem 3rem; background: #fff; color: #000;
  text-decoration: none; border-radius: 100px; font-weight: 700;
  transition: all 0.3s;
}
.premium-btn:hover { transform: scale(1.05); box-shadow: 0 10px 40px rgba(255, 255, 255, 0.2); }

/* FAQ Section */
.faq-section { padding: 10rem 0; z-index: 1; position: relative; }
.faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
.faq-card {
  padding: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.faq-card h4 { font-size: 1.15rem; font-weight: 600; margin-bottom: 1rem; color: #9490c8; }
.faq-card p { font-size: 0.95rem; line-height: 1.6; color: #5a547a; }

/* Footer */
.site-footer {
  background: #030207; padding: 8rem 2rem 4rem; z-index: 1; position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}
.footer-grid {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1.5fr 2fr; gap: 4rem;
  margin-bottom: 6rem;
}
.f-logo { 
  font-family: 'Space Grotesk', sans-serif; font-size: 1.75rem; font-weight: 700; 
  color: #fff; margin-bottom: 1.5rem; 
}
.f-logo span { color: #6356e5; }
.f-tagline { font-size: 0.95rem; color: #4a4468; line-height: 1.6; max-width: 280px; }

.footer-links-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.f-group h6 { font-size: 0.75rem; text-transform: uppercase; color: #33304d; margin-bottom: 1.75rem; letter-spacing: 0.1em; }
.f-group a { display: block; text-decoration: none; color: #5a547a; font-size: 0.9rem; margin-bottom: 0.85rem; transition: 0.2s; }
.f-group a:hover { color: #6356e5; }

.footer-copyright {
  max-width: 1200px; margin: 0 auto;
  padding-top: 3rem; border-top: 1px solid rgba(255, 255, 255, 0.03);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.85rem; color: #33304d;
}
.f-socials { display: flex; gap: 1.5rem; }
.f-socials a { color: #33304d; font-size: 1.25rem; transition: 0.3s; }
.f-socials a:hover { color: #6356e5; transform: translateY(-3px); }

.fade-enter-active,.fade-leave-active { transition:opacity 0.25s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }

@media (max-width: 992px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-links-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
}

@media (max-width: 480px) {
  .top-nav { display: none; }
  .below-ring { flex-direction:column; align-items:center; }
  .send-btn { width:100%; justify-content:center; }
}
</style>

