<script setup lang="ts">
import { ref, computed } from 'vue';

const menuOpen = ref(false);

interface FileItem {
  id: string; file: File; name: string; size: number; type: string; preview?: string;
}

const isDragging   = ref(false);
const files        = ref<FileItem[]>([]);
const isUploading  = ref(false);
const uploadPct    = ref(0);
const done         = ref(false);
const link         = ref('');
const copied       = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const totalSize = computed(() => files.value.reduce((s, f) => s + f.size, 0));

function fmt(b: number) {
  if (!b) return '0 o';
  const u = ['o','Ko','Mo','Go','To'];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return (b / 1024 ** i).toFixed(1) + ' ' + u[i];
}

function fileIcon(t: string) {
  if (t.startsWith('image/')) return 'bi-file-image-fill';
  if (t.startsWith('video/')) return 'bi-film';
  if (t.startsWith('audio/')) return 'bi-music-note-beamed';
  if (t.includes('pdf'))      return 'bi-file-pdf-fill';
  if (t.includes('zip')||t.includes('rar')) return 'bi-file-zip-fill';
  if (t.includes('sheet')||t.includes('csv')) return 'bi-file-spreadsheet-fill';
  if (t.includes('word'))     return 'bi-file-word-fill';
  return 'bi-file-earmark-fill';
}

function addFiles(list: FileList | null) {
  if (!list) return;
  for (const f of Array.from(list)) {
    if (files.value.some(x => x.name === f.name && x.size === f.size)) continue;
    const item: FileItem = { id: Math.random().toString(36).slice(2), file: f, name: f.name, size: f.size, type: f.type };
    if (f.type.startsWith('image/')) {
      const r = new FileReader(); r.onload = e => { item.preview = e.target?.result as string; }; r.readAsDataURL(f);
    }
    files.value.push(item);
  }
}

function removeFile(id: string) { files.value = files.value.filter(f => f.id !== id); }
function onDragOver(e: DragEvent)  { e.preventDefault(); isDragging.value = true; }
function onDragLeave()             { isDragging.value = false; }
function onDrop(e: DragEvent)      { e.preventDefault(); isDragging.value = false; addFiles(e.dataTransfer?.files ?? null); }
function onInput(e: Event)         { addFiles((e.target as HTMLInputElement).files); (e.target as HTMLInputElement).value = ''; }
function openPicker()              { fileInputRef.value?.click(); }

async function transfer() {
  if (!files.value.length || isUploading.value) return;
  isUploading.value = true; uploadPct.value = 0;
  const iv = setInterval(() => {
    uploadPct.value = Math.min(uploadPct.value + Math.random() * 14, 100);
    if (uploadPct.value >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        isUploading.value = false; done.value = true;
        link.value = 'silvertransfer.io/' + Math.random().toString(36).slice(2, 10).toUpperCase();
      }, 300);
    }
  }, 160);
}

async function copyLink() {
  try { await navigator.clipboard.writeText('https://' + link.value); } catch {}
  copied.value = true; setTimeout(() => { copied.value = false; }, 2000);
}

function reset() { files.value = []; done.value = false; uploadPct.value = 0; link.value = ''; }
</script>

<template>
  <div class="page" :class="{ dragging: isDragging }"
    @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop="onDrop">

    <!-- Ambient glows -->
    <div class="glow g1" aria-hidden="true"></div>
    <div class="glow g2" aria-hidden="true"></div>

    <!-- ── Menu trigger ── -->
    <button class="menu-btn" @click="menuOpen = true" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>

    <!-- ── Drawer overlay ── -->
    <Transition name="overlay">
      <div v-if="menuOpen" class="overlay" @click.self="menuOpen = false">
        <div class="drawer">
          <button class="drawer-close" @click="menuOpen = false"><i class="bi bi-x-lg"></i></button>

          <!-- Drawer brand -->
          <div class="drawer-brand">
            <svg class="d-logo-svg" viewBox="15 15 120 120" xmlns="http://www.w3.org/2000/svg">
              <g fill="currentColor">
                <path d="M83.7,71.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C83,70.9,83.3,71.1,83.7,71.1z"/>
                <path d="M92.4,66.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C91.7,65.9,92,66.1,92.4,66.1z"/>
                <path d="M66.4,69l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C67,69.9,66.8,69.3,66.4,69z"/>
                <path d="M57.6,64.1l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C58.3,65,58.1,64.4,57.6,64.1z"/>
                <path d="M75,94c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,94.4,75.6,94,75,94z"/>
                <path d="M75,84c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,84.4,75.6,84,75,84z"/>
                <path d="M75,65.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,65.4,74.4,65.9,75,65.9z"/>
                <path d="M75,55.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,55.4,74.4,55.9,75,55.9z"/>
                <path d="M94.7,84.9l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C95.3,85.8,95.2,85.2,94.7,84.9z"/>
                <path d="M86,80l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4s-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C86.6,80.9,86.4,80.3,86,80z"/>
                <path d="M56.7,84.2l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C57.8,84.1,57.1,83.9,56.7,84.2z"/>
                <path d="M65.4,79.3l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C66.5,79.2,65.9,79,65.4,79.3z"/>
                <path d="M121.1,75c3.9-5.2,6.7-10.4,8-15.3c1.5-5.7,1.1-10.6-1.3-14.7c-4.6-7.8-15.8-10.8-29.8-9.2C92.4,23.1,84.2,15,75,15c-9.2,0-17.4,8.1-23,20.8c-14-1.6-25.2,1.4-29.8,9.2c-2.4,4.1-2.8,9-1.3,14.7c1.3,5,4.1,10.2,8,15.3c-3.9,5.2-6.7,10.4-8,15.3c-1.5,5.7-1.1,10.6,1.3,14.7c3.8,6.5,12.1,9.6,22.8,9.6c2.3,0,4.6-0.2,7.1-0.4c5.6,12.7,13.8,20.8,23,20.8c9.2,0,17.4-8.1,23-20.8c2.4,0.3,4.8,0.4,7.1,0.4c10.7,0,19-3.2,22.8-9.6c2.4-4.1,2.8-9,1.3-14.7C127.8,85.4,125.1,80.2,121.1,75z M105.2,37.3c9.9,0,17.5,2.9,20.9,8.8c2.1,3.6,2.5,8,1.1,13.1c-1.2,4.5-3.8,9.4-7.4,14.2c-3.2-4-7.2-8-11.7-11.8c0.4-0.8,0.7-1.7,0.7-2.6c0-3-2.5-5.5-5.5-5.5c-1.1-5.7-2.7-11-4.6-15.8C101,37.4,103.1,37.3,105.2,37.3z M106.8,90.9c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5S106.8,89,106.8,90.9z M103,85.4c-2.9,0.2-5.2,2.6-5.2,5.5c0,0.9,0.2,1.8,0.6,2.5c-2.9,2-6,4-9.2,5.8c-3.2,1.8-6.4,3.4-9.6,4.9c-1-1.5-2.7-2.5-4.6-2.5c-1.9,0-3.6,1-4.6,2.5c-3.2-1.5-6.4-3.1-9.6-4.9c-3.2-1.8-6.3-3.7-9.2-5.8c0.4-0.8,0.6-1.6,0.6-2.5c0-2.9-2.3-5.3-5.2-5.5c-0.3-3.4-0.5-6.8-0.5-10.4c0-3.5,0.2-7,0.5-10.4c2.9-0.2,5.2-2.6,5.2-5.5c0-0.9-0.2-1.8-0.6-2.5c2.9-2,6-4,9.2-5.8c3.2-1.8,6.4-3.4,9.6-4.9c1,1.5,2.7,2.5,4.6,2.5c1.9,0,3.6-1,4.6-2.5c3.2,1.5,6.4,3.1,9.6,4.9c3.2,1.8,6.2,3.7,9.1,5.7c-0.3,0.7-0.5,1.5-0.5,2.4c0,2.9,2.3,5.3,5.2,5.5c0.3,3.4,0.5,7,0.5,10.6C103.4,78.5,103.3,82,103,85.4z M78.5,107.1c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5S78.5,105.2,78.5,107.1z M46.7,87.4c1.9,0,3.5,1.6,3.5,3.5s-1.6,3.5-3.5,3.5c-1.9,0-3.5-1.6-3.5-3.5S44.7,87.4,46.7,87.4z M43.2,59.1c0-1.9,1.6-3.5,3.5-3.5c1.9,0,3.5,1.6,3.5,3.5c0,1.9-1.6,3.5-3.5,3.5C44.7,62.6,43.2,61,43.2,59.1z M71.5,42.9c0-1.9,1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5c0,1.9-1.6,3.5-3.5,3.5S71.5,44.8,71.5,42.9z M103.3,62.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S105.3,62.5,103.3,62.5z M99.5,54.9c-2.9-2-6.1-4-9.3-5.8c-3.3-1.9-6.5-3.5-9.8-5c0.1-0.4,0.1-0.8,0.1-1.2c0-0.3,0-0.6-0.1-1c5.7-2,11.2-3.3,16.4-4c1.9,4.7,3.5,10.1,4.6,15.9C100.7,54,100.1,54.4,99.5,54.9z M69.6,44.1c-3.3,1.5-6.5,3.1-9.8,5c-3.3,1.9-6.4,3.8-9.4,5.9c-0.5-0.5-1.2-0.9-1.8-1.1c1.1-5.9,2.7-11.3,4.6-16c5.1,0.7,10.7,2.1,16.4,4c-0.1,0.3-0.1,0.6-0.1,1C69.5,43.3,69.5,43.7,69.6,44.1z M43,63.2c0.6,0.5,1.3,0.9,2.1,1.2c-0.3,3.4-0.5,7-0.5,10.6c0,3.6,0.2,7.2,0.5,10.6c-0.8,0.2-1.5,0.6-2.1,1.2C38.6,83,34.7,79,31.5,75C34.7,71,38.6,67,43,63.2z M50.4,95c3,2.1,6.1,4,9.4,5.9c3.3,1.9,6.5,3.5,9.8,5c-0.1,0.4-0.1,0.8-0.1,1.2c0,0.3,0,0.6,0.1,1c-5.7,2-11.2,3.3-16.4,4c-1.9-4.8-3.5-10.2-4.6-16C49.2,95.9,49.9,95.5,50.4,95z M80.4,105.9c3.3-1.5,6.5-3.1,9.8-5c3.3-1.9,6.4-3.8,9.4-5.9c0.5,0.5,1.2,0.9,1.8,1.1c-1.1,5.9-2.7,11.3-4.6,16c-5.1-0.7-10.7-2.1-16.4-4c0.1-0.3,0.1-0.6,0.1-1C80.5,106.7,80.5,106.3,80.4,105.9z M107,86.8c-0.6-0.5-1.3-0.9-2.1-1.2c0.3-3.4,0.5-7,0.5-10.6c0-3.7-0.2-7.3-0.5-10.8c0.7-0.2,1.4-0.6,2-1.1c4.5,3.8,8.4,7.8,11.6,11.9C115.3,79,111.4,83,107,86.8z M75,17c8.3,0,15.8,7.4,21,19.1c-5.1,0.7-10.6,2.1-16.3,4c-1-1.6-2.7-2.7-4.8-2.7c-2,0-3.8,1.1-4.8,2.7c-5.6-1.9-11.1-3.3-16.3-4C59.2,24.4,66.7,17,75,17z M22.8,59.1c-1.4-5.1-1-9.5,1.1-13.1c3.5-5.9,11.1-8.8,20.9-8.8c2,0,4.2,0.1,6.4,0.4c-1.9,4.8-3.5,10.1-4.6,15.9c-3,0-5.4,2.5-5.4,5.5c0,0.9,0.2,1.7,0.6,2.5c-4.5,3.8-8.4,7.7-11.6,11.7C26.5,68.5,24,63.7,22.8,59.1z M23.9,104c-2.1-3.6-2.5-8-1.1-13.1c1.2-4.5,3.8-9.4,7.4-14.2c3.2,4,7.1,8,11.6,11.7c-0.4,0.8-0.6,1.6-0.6,2.5c0,3,2.4,5.5,5.4,5.5c1.1,5.8,2.7,11.2,4.6,15.9C38.3,113.8,28.1,111.1,23.9,104z M75,133c-8.3,0-15.8-7.4-21-19.1c5.1-0.7,10.6-2.1,16.3-4c1,1.6,2.7,2.7,4.8,2.7c2,0,3.8-1.1,4.8-2.7c5.6,1.9,11.1,3.3,16.3,4C90.8,125.6,83.3,133,75,133z M126.1,104c-4.2,7.1-14.4,9.8-27.3,8.4c1.9-4.8,3.5-10.1,4.6-15.9c3-0.1,5.4-2.5,5.4-5.5c0-0.9-0.2-1.7-0.6-2.5c4.5-3.8,8.4-7.7,11.6-11.7c3.6,4.8,6.2,9.7,7.4,14.2C128.6,96,128.2,100.4,126.1,104z"/>
                <path d="M75,69.5c-3.1,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S78.1,69.5,75,69.5z M75,78.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S76.9,78.5,75,78.5z"/>
              </g>
            </svg>
            <div>
              <p class="d-name">SilverTransfer</p>
              <p class="d-sub">by Silvercore</p>
            </div>
          </div>

          <nav class="drawer-nav">
            <a href="#" @click="menuOpen=false"><i class="bi bi-lightning-charge-fill"></i>Fonctionnalités</a>
            <a href="#" @click="menuOpen=false"><i class="bi bi-tag-fill"></i>Tarifs</a>
            <a href="#" @click="menuOpen=false"><i class="bi bi-code-slash"></i>API</a>
            <a href="#" @click="menuOpen=false"><i class="bi bi-shield-lock-fill"></i>Sécurité</a>
            <a href="#" @click="menuOpen=false"><i class="bi bi-people-fill"></i>À propos</a>
          </nav>

          <div class="drawer-actions">
            <a href="#" class="d-ghost">Connexion</a>
            <a href="#" class="d-filled">Créer un compte</a>
          </div>

          <div class="drawer-badges">
            <span><i class="bi bi-shield-lock-fill"></i>Chiffrement de bout en bout</span>
            <span><i class="bi bi-server"></i>Hébergé en France</span>
            <span><i class="bi bi-infinity"></i>Sans limite de taille</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Main center ── -->
    <div class="center">

      <!-- Logo -->
      <svg class="hero-logo" viewBox="15 15 120 120" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M83.7,71.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C83,70.9,83.3,71.1,83.7,71.1z"/>
          <path d="M92.4,66.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C91.7,65.9,92,66.1,92.4,66.1z"/>
          <path d="M66.4,69l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C67,69.9,66.8,69.3,66.4,69z"/>
          <path d="M57.6,64.1l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C58.3,65,58.1,64.4,57.6,64.1z"/>
          <path d="M75,94c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,94.4,75.6,94,75,94z"/>
          <path d="M75,84c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,84.4,75.6,84,75,84z"/>
          <path d="M75,65.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,65.4,74.4,65.9,75,65.9z"/>
          <path d="M75,55.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,55.4,74.4,55.9,75,55.9z"/>
          <path d="M94.7,84.9l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C95.3,85.8,95.2,85.2,94.7,84.9z"/>
          <path d="M86,80l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4s-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C86.6,80.9,86.4,80.3,86,80z"/>
          <path d="M56.7,84.2l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C57.8,84.1,57.1,83.9,56.7,84.2z"/>
          <path d="M65.4,79.3l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C66.5,79.2,65.9,79,65.4,79.3z"/>
          <path d="M121.1,75c3.9-5.2,6.7-10.4,8-15.3c1.5-5.7,1.1-10.6-1.3-14.7c-4.6-7.8-15.8-10.8-29.8-9.2C92.4,23.1,84.2,15,75,15c-9.2,0-17.4,8.1-23,20.8c-14-1.6-25.2,1.4-29.8,9.2c-2.4,4.1-2.8,9-1.3,14.7c1.3,5,4.1,10.2,8,15.3c-3.9,5.2-6.7,10.4-8,15.3c-1.5,5.7-1.1,10.6,1.3,14.7c3.8,6.5,12.1,9.6,22.8,9.6c2.3,0,4.6-0.2,7.1-0.4c5.6,12.7,13.8,20.8,23,20.8c9.2,0,17.4-8.1,23-20.8c2.4,0.3,4.8,0.4,7.1,0.4c10.7,0,19-3.2,22.8-9.6c2.4-4.1,2.8-9,1.3-14.7C127.8,85.4,125.1,80.2,121.1,75z M105.2,37.3c9.9,0,17.5,2.9,20.9,8.8c2.1,3.6,2.5,8,1.1,13.1c-1.2,4.5-3.8,9.4-7.4,14.2c-3.2-4-7.2-8-11.7-11.8c0.4-0.8,0.7-1.7,0.7-2.6c0-3-2.5-5.5-5.5-5.5c-1.1-5.7-2.7-11-4.6-15.8C101,37.4,103.1,37.3,105.2,37.3z M106.8,90.9c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5S106.8,89,106.8,90.9z M103,85.4c-2.9,0.2-5.2,2.6-5.2,5.5c0,0.9,0.2,1.8,0.6,2.5c-2.9,2-6,4-9.2,5.8c-3.2,1.8-6.4,3.4-9.6,4.9c-1-1.5-2.7-2.5-4.6-2.5c-1.9,0-3.6,1-4.6,2.5c-3.2-1.5-6.4-3.1-9.6-4.9c-3.2-1.8-6.3-3.7-9.2-5.8c0.4-0.8,0.6-1.6,0.6-2.5c0-2.9-2.3-5.3-5.2-5.5c-0.3-3.4-0.5-6.8-0.5-10.4c0-3.5,0.2-7,0.5-10.4c2.9-0.2,5.2-2.6,5.2-5.5c0-0.9-0.2-1.8-0.6-2.5c2.9-2,6-4,9.2-5.8c3.2-1.8,6.4-3.4,9.6-4.9c1,1.5,2.7,2.5,4.6,2.5c1.9,0,3.6-1,4.6-2.5c3.2,1.5,6.4,3.1,9.6,4.9c3.2,1.8,6.2,3.7,9.1,5.7c-0.3,0.7-0.5,1.5-0.5,2.4c0,2.9,2.3,5.3,5.2,5.5c0.3,3.4,0.5,7,0.5,10.6C103.4,78.5,103.3,82,103,85.4z M78.5,107.1c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5S78.5,105.2,78.5,107.1z M46.7,87.4c1.9,0,3.5,1.6,3.5,3.5s-1.6,3.5-3.5,3.5c-1.9,0-3.5-1.6-3.5-3.5S44.7,87.4,46.7,87.4z M43.2,59.1c0-1.9,1.6-3.5,3.5-3.5c1.9,0,3.5,1.6,3.5,3.5c0,1.9-1.6,3.5-3.5,3.5C44.7,62.6,43.2,61,43.2,59.1z M71.5,42.9c0-1.9,1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5c0,1.9-1.6,3.5-3.5,3.5S71.5,44.8,71.5,42.9z M103.3,62.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S105.3,62.5,103.3,62.5z M99.5,54.9c-2.9-2-6.1-4-9.3-5.8c-3.3-1.9-6.5-3.5-9.8-5c0.1-0.4,0.1-0.8,0.1-1.2c0-0.3,0-0.6-0.1-1c5.7-2,11.2-3.3,16.4-4c1.9,4.7,3.5,10.1,4.6,15.9C100.7,54,100.1,54.4,99.5,54.9z M69.6,44.1c-3.3,1.5-6.5,3.1-9.8,5c-3.3,1.9-6.4,3.8-9.4,5.9c-0.5-0.5-1.2-0.9-1.8-1.1c1.1-5.9,2.7-11.3,4.6-16c5.1,0.7,10.7,2.1,16.4,4c-0.1,0.3-0.1,0.6-0.1,1C69.5,43.3,69.5,43.7,69.6,44.1z M43,63.2c0.6,0.5,1.3,0.9,2.1,1.2c-0.3,3.4-0.5,7-0.5,10.6c0,3.6,0.2,7.2,0.5,10.6c-0.8,0.2-1.5,0.6-2.1,1.2C38.6,83,34.7,79,31.5,75C34.7,71,38.6,67,43,63.2z M50.4,95c3,2.1,6.1,4,9.4,5.9c3.3,1.9,6.5,3.5,9.8,5c-0.1,0.4-0.1,0.8-0.1,1.2c0,0.3,0,0.6,0.1,1c-5.7,2-11.2,3.3-16.4,4c-1.9-4.8-3.5-10.2-4.6-16C49.2,95.9,49.9,95.5,50.4,95z M80.4,105.9c3.3-1.5,6.5-3.1,9.8-5c3.3-1.9,6.4-3.8,9.4-5.9c0.5,0.5,1.2,0.9,1.8,1.1c-1.1,5.9-2.7,11.3-4.6,16c-5.1-0.7-10.7-2.1-16.4-4c0.1-0.3,0.1-0.6,0.1-1C80.5,106.7,80.5,106.3,80.4,105.9z M107,86.8c-0.6-0.5-1.3-0.9-2.1-1.2c0.3-3.4,0.5-7,0.5-10.6c0-3.7-0.2-7.3-0.5-10.8c0.7-0.2,1.4-0.6,2-1.1c4.5,3.8,8.4,7.8,11.6,11.9C115.3,79,111.4,83,107,86.8z M75,17c8.3,0,15.8,7.4,21,19.1c-5.1,0.7-10.6,2.1-16.3,4c-1-1.6-2.7-2.7-4.8-2.7c-2,0-3.8,1.1-4.8,2.7c-5.6-1.9-11.1-3.3-16.3-4C59.2,24.4,66.7,17,75,17z M22.8,59.1c-1.4-5.1-1-9.5,1.1-13.1c3.5-5.9,11.1-8.8,20.9-8.8c2,0,4.2,0.1,6.4,0.4c-1.9,4.8-3.5,10.1-4.6,15.9c-3,0-5.4,2.5-5.4,5.5c0,0.9,0.2,1.7,0.6,2.5c-4.5,3.8-8.4,7.7-11.6,11.7C26.5,68.5,24,63.7,22.8,59.1z M23.9,104c-2.1-3.6-2.5-8-1.1-13.1c1.2-4.5,3.8-9.4,7.4-14.2c3.2,4,7.1,8,11.6,11.7c-0.4,0.8-0.6,1.6-0.6,2.5c0,3,2.4,5.5,5.4,5.5c1.1,5.8,2.7,11.2,4.6,15.9C38.3,113.8,28.1,111.1,23.9,104z M75,133c-8.3,0-15.8-7.4-21-19.1c5.1-0.7,10.6-2.1,16.3-4c1,1.6,2.7,2.7,4.8,2.7c2,0,3.8-1.1,4.8-2.7c5.6,1.9,11.1,3.3,16.3,4C90.8,125.6,83.3,133,75,133z M126.1,104c-4.2,7.1-14.4,9.8-27.3,8.4c1.9-4.8,3.5-10.1,4.6-15.9c3-0.1,5.4-2.5,5.4-5.5c0-0.9-0.2-1.7-0.6-2.5c4.5-3.8,8.4-7.7,11.6-11.7c3.6,4.8,6.2,9.7,7.4,14.2C128.6,96,128.2,100.4,126.1,104z"/>
          <path d="M75,69.5c-3.1,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S78.1,69.5,75,69.5z M75,78.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S76.9,78.5,75,78.5z"/>
        </g>
      </svg>

      <!-- Wordmark -->
      <h1 class="wordmark">SilverTransfer</h1>
      <p class="tagline">Envoyez n'importe quoi. Sans limite.</p>

      <!-- ░░ SUCCESS ░░ -->
      <Transition name="fade">
        <div v-if="done" class="result-box">
          <div class="result-check"><i class="bi bi-check-lg"></i></div>
          <p class="result-meta">{{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ fmt(totalSize) }}</p>
          <div class="link-row">
            <span class="link-text">{{ link }}</span>
            <button class="link-copy" @click="copyLink">
              <i :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
              {{ copied ? 'Copié !' : 'Copier' }}
            </button>
          </div>
          <button class="reset-btn" @click="reset">
            <i class="bi bi-arrow-counterclockwise"></i> Nouveau transfert
          </button>
        </div>
      </Transition>

      <!-- ░░ DROP ZONE ░░ -->
      <Transition name="fade">
        <div v-if="!done" class="upload-wrap">
          <div class="drop-ring" :class="{ active: isDragging || files.length > 0 }" @click="openPicker">
            <input ref="fileInputRef" type="file" multiple style="display:none" @change="onInput" />

            <!-- Empty -->
            <div v-if="files.length === 0 && !isUploading" class="ring-empty">
              <i class="bi bi-cloud-upload-fill ring-icon"></i>
              <span class="ring-label">Glissez vos fichiers ici</span>
              <span class="ring-sub">ou cliquez pour parcourir</span>
            </div>

            <!-- Files -->
            <div v-else-if="!isUploading" class="ring-files" @click.stop>
              <div v-for="f in files" :key="f.id" class="frow">
                <div class="fthumb">
                  <img v-if="f.preview" :src="f.preview" :alt="f.name" />
                  <i v-else :class="'bi ' + fileIcon(f.type)"></i>
                </div>
                <span class="fname">{{ f.name }}</span>
                <span class="fsize">{{ fmt(f.size) }}</span>
                <button class="fdelete" @click.stop="removeFile(f.id)"><i class="bi bi-x"></i></button>
              </div>
              <button class="add-more" @click.stop="openPicker"><i class="bi bi-plus"></i> Ajouter</button>
            </div>

            <!-- Uploading -->
            <div v-if="isUploading" class="ring-uploading">
              <div class="arc-wrap">
                <svg viewBox="0 0 80 80" class="arc-svg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="5"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#vg)" stroke-width="5"
                    stroke-linecap="round"
                    :stroke-dasharray="213.6"
                    :stroke-dashoffset="213.6 * (1 - uploadPct / 100)"
                    transform="rotate(-90 40 40)"
                    style="transition: stroke-dashoffset 0.18s ease"
                  />
                  <defs>
                    <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#a78bfa"/>
                      <stop offset="100%" stop-color="#6356e5"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span class="arc-pct">{{ Math.round(uploadPct) }}%</span>
              </div>
              <span class="upload-lbl">Envoi en cours…</span>
            </div>
          </div>

          <!-- Below -->
          <div v-if="files.length > 0 && !isUploading" class="below-ring">
            <span class="size-hint">{{ files.length }} fichier{{ files.length > 1 ? 's' : '' }} · {{ fmt(totalSize) }}</span>
            <button class="send-btn" @click="transfer"><i class="bi bi-send-fill"></i> Envoyer</button>
          </div>
          <p v-else-if="!isUploading" class="drop-hint">Chiffré · Stocké en France · Lien valable 7 jours</p>
        </div>
      </Transition>
    </div>

    <!-- Page foot -->
    <div class="page-foot">
      <span>© 2025 Silvercore</span>
      <a href="#">Confidentialité</a>
      <a href="#">CGU</a>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.page {
  min-height: 100vh;
  background: #08070f;
  color: #e2e0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

/* ── Glows ──────────────────────────────────────── */
.glow {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(90px); animation: breathe 9s ease-in-out infinite;
}
.g1 {
  width: 700px; height: 500px; top: -15%; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(99,86,229,0.16) 0%, transparent 70%);
}
.g2 {
  width: 350px; height: 280px; bottom: -8%; left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%);
  animation-delay: -4.5s;
}
@keyframes breathe {
  0%,100% { opacity:.7; transform: translateX(-50%) scale(1); }
  50%      { opacity:1;  transform: translateX(-50%) scale(1.09); }
}

/* ── Menu btn ───────────────────────────────────── */
.menu-btn {
  position: fixed; top: 1.5rem; right: 1.75rem; z-index: 50;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; width: 42px; height: 42px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; cursor: pointer; padding: 0;
  transition: background 0.2s, border-color 0.2s;
}
.menu-btn:hover { background: rgba(99,86,229,0.1); border-color: rgba(99,86,229,0.35); }
.menu-btn span { display:block; width:18px; height:1.5px; background:#9490c8; border-radius:2px; }
.menu-btn span:nth-child(2) { width:12px; }

/* ── Overlay / Drawer ───────────────────────────── */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
  z-index: 200; display: flex; justify-content: flex-end;
}
.drawer {
  width: 285px; height: 100%; background: #0d0b19;
  border-left: 1px solid rgba(99,86,229,0.1);
  padding: 2rem 1.75rem;
  display: flex; flex-direction: column; gap: 1.75rem;
  box-shadow: -20px 0 60px rgba(0,0,0,0.6);
  position: relative;
}
.drawer-close {
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: none; border: none; color: #4a4468; font-size: 1rem;
  cursor: pointer; width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.drawer-close:hover { color: #e2e0f0; background: rgba(255,255,255,0.05); }

.drawer-brand { display: flex; align-items: center; gap: 0.7rem; }
.d-logo-svg { width: 34px; height: 34px; color: #6356e5; flex-shrink: 0; }
.d-name { font-size: 0.975rem; font-weight: 700; color: #e2e0f0; letter-spacing: -0.02em; line-height:1.2; }
.d-sub  { font-size: 0.7rem; color: #4a4468; font-weight: 400; }

.drawer-nav { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; }
.drawer-nav a {
  display: flex; align-items: center; gap: 0.65rem;
  text-decoration: none; color: #7a7499;
  font-size: 0.865rem; font-weight: 500;
  padding: 0.55rem 0.65rem; border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}
.drawer-nav a i { font-size: 0.78rem; color: #33304d; transition: color 0.15s; }
.drawer-nav a:hover { color: #e2e0f0; background: rgba(99,86,229,0.09); }
.drawer-nav a:hover i { color: #6356e5; }

.drawer-actions { display: flex; flex-direction: column; gap: 0.4rem; }
.d-ghost, .d-filled {
  display: block; text-align: center; text-decoration: none;
  font-size: 0.83rem; font-weight: 600; padding: 0.58rem; border-radius: 9px;
  transition: all 0.15s; font-family: 'Outfit', sans-serif;
}
.d-ghost { color: #7a7499; border: 1px solid rgba(255,255,255,0.07); }
.d-ghost:hover { color: #e2e0f0; border-color: rgba(255,255,255,0.15); }
.d-filled { background: #6356e5; color: white; box-shadow: 0 4px 16px rgba(99,86,229,0.28); }
.d-filled:hover { background: #7267f0; }

.drawer-badges { display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1.2rem; }
.drawer-badges span { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: #3d3a5a; }
.drawer-badges i { color: #6356e5; font-size: 0.65rem; }

.overlay-enter-active,.overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from,.overlay-leave-to { opacity: 0; }
.overlay-enter-active .drawer,.overlay-leave-active .drawer { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.overlay-enter-from .drawer,.overlay-leave-to .drawer { transform: translateX(100%); }

/* ── Center ─────────────────────────────────────── */
.center {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  z-index: 1; padding: 1rem; width: 100%;
  animation: rise 0.65s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes rise {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Hero logo ──────────────────────────────────── */
.hero-logo {
  width: clamp(70px, 13vw, 110px);
  height: clamp(70px, 13vw, 110px);
  color: #6356e5;
  filter: drop-shadow(0 0 32px rgba(99,86,229,0.5));
  animation: spin 50s linear infinite;
  margin-bottom: 0.25rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Wordmark ───────────────────────────────────── */
.wordmark {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2rem, 7vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #e2e0f0;
  line-height: 1;
  margin: 0;
}

/* ── Tagline ────────────────────────────────────── */
.tagline {
  font-size: clamp(0.78rem, 2vw, 0.88rem);
  color: #4a4468;
  font-weight: 400;
  margin-bottom: 1.25rem;
}

/* ── Upload wrap ────────────────────────────────── */
.upload-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.9rem; width: 100%; max-width: 430px;
}

/* ── Drop ring ──────────────────────────────────── */
.drop-ring {
  width: 100%; min-height: 165px;
  border: 1.5px dashed rgba(99,86,229,0.18);
  border-radius: 16px;
  background: rgba(99,86,229,0.025);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  overflow: hidden;
}
.drop-ring:hover, .drop-ring.active {
  border-color: rgba(99,86,229,0.5);
  background: rgba(99,86,229,0.055);
  box-shadow: 0 0 0 4px rgba(99,86,229,0.07);
}
.dragging .drop-ring {
  border-color: #6356e5 !important;
  box-shadow: 0 0 0 5px rgba(99,86,229,0.16) !important;
}

.ring-empty {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  padding: 2.25rem; text-align: center; pointer-events: none;
}
.ring-icon { font-size: 1.9rem; color: #6356e5; opacity: 0.8; margin-bottom: 0.3rem; }
.ring-label { font-size: 0.875rem; font-weight: 600; color: #bbb8d8; }
.ring-sub   { font-size: 0.75rem; color: #3d3a5a; }

.ring-files { width: 100%; padding: 0.6rem; display: flex; flex-direction: column; gap: 0.28rem; }
.frow {
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.38rem 0.45rem; border-radius: 7px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  transition: border-color 0.15s;
}
.frow:hover { border-color: rgba(99,86,229,0.18); }
.fthumb {
  width: 27px; height: 27px; border-radius: 6px;
  background: rgba(99,86,229,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: #7c6ff5; flex-shrink: 0; overflow: hidden;
}
.fthumb img { width:100%; height:100%; object-fit:cover; }
.fname { flex:1; min-width:0; font-size:0.77rem; font-weight:500; color:#bbb8d8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fsize { font-size:0.68rem; color:#3d3a5a; flex-shrink:0; }
.fdelete {
  width:19px; height:19px; border-radius:5px; border:none; background:none;
  color:#3d3a5a; cursor:pointer; display:flex; align-items:center; justify-content:center;
  font-size:0.88rem; transition:color 0.15s, background 0.15s; flex-shrink:0;
}
.fdelete:hover { color:#ef4444; background:rgba(239,68,68,0.08); }
.add-more {
  display:flex; align-items:center; justify-content:center; gap:0.3rem; padding:0.35rem;
  font-size:0.73rem; font-weight:500; color:#3d3a5a; background:none;
  border:1px dashed rgba(255,255,255,0.05); border-radius:7px; cursor:pointer;
  transition:color 0.15s, border-color 0.15s; font-family:'Outfit',sans-serif; margin-top:0.08rem;
}
.add-more:hover { color:#7c6ff5; border-color:rgba(99,86,229,0.3); }

.ring-uploading { display:flex; flex-direction:column; align-items:center; gap:0.8rem; padding:2rem; pointer-events:none; }
.arc-wrap { position:relative; width:72px; height:72px; }
.arc-svg  { width:72px; height:72px; }
.arc-pct  {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font-size:0.85rem; font-weight:700; color:#a78bfa; font-variant-numeric:tabular-nums;
}
.upload-lbl { font-size:0.76rem; color:#4a4468; }

.below-ring { display:flex; align-items:center; justify-content:space-between; width:100%; gap:1rem; }
.size-hint  { font-size:0.76rem; color:#3d3a5a; }
.send-btn {
  display:flex; align-items:center; gap:0.45rem; padding:0.58rem 1.35rem;
  background:#6356e5; color:white; border:none; border-radius:10px;
  font-size:0.83rem; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif;
  box-shadow:0 4px 18px rgba(99,86,229,0.32);
  transition:background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.send-btn:hover { background:#7267f0; transform:translateY(-1px); box-shadow:0 6px 24px rgba(99,86,229,0.42); }
.drop-hint { font-size:0.7rem; color:#2a2740; letter-spacing:0.02em; text-align:center; }

/* ── Result ─────────────────────────────────────── */
.result-box { display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%; max-width:430px; }
.result-check {
  width:50px; height:50px; border-radius:50%;
  background:rgba(99,86,229,0.1); border:1.5px solid rgba(99,86,229,0.28);
  display:flex; align-items:center; justify-content:center;
  font-size:1.35rem; color:#7c6ff5;
  animation:pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes pop { from{transform:scale(.4);opacity:0} to{transform:scale(1);opacity:1} }
.result-meta { font-size:0.76rem; color:#3d3a5a; }
.link-row {
  display:flex; align-items:center; width:100%;
  background:rgba(255,255,255,0.02); border:1px solid rgba(99,86,229,0.14);
  border-radius:10px; overflow:hidden;
}
.link-text { flex:1; padding:0.65rem 0.85rem; font-size:0.8rem; color:#7c6ff5; font-weight:600; word-break:break-all; }
.link-copy {
  padding:0.65rem 0.85rem; background:rgba(99,86,229,0.07);
  border:none; border-left:1px solid rgba(99,86,229,0.1);
  color:#7c6ff5; font-size:0.76rem; font-weight:600; cursor:pointer;
  display:flex; align-items:center; gap:0.3rem;
  font-family:'Outfit',sans-serif; white-space:nowrap; transition:background 0.15s;
}
.link-copy:hover { background:rgba(99,86,229,0.13); }
.reset-btn {
  display:flex; align-items:center; gap:0.38rem;
  background:none; border:1px solid rgba(255,255,255,0.05); border-radius:8px;
  color:#3d3a5a; font-size:0.76rem; font-weight:500; padding:0.42rem 0.85rem;
  cursor:pointer; font-family:'Outfit',sans-serif; transition:color 0.15s, border-color 0.15s;
}
.reset-btn:hover { color:#bbb8d8; border-color:rgba(255,255,255,0.13); }

.fade-enter-active,.fade-leave-active { transition:opacity 0.25s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }

/* ── Page foot ──────────────────────────────────── */
.page-foot {
  position:fixed; bottom:1.2rem; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; gap:1rem;
  font-size:0.68rem; color:#22203a; z-index:1; white-space:nowrap;
}
.page-foot a { text-decoration:none; color:#22203a; transition:color 0.15s; }
.page-foot a:hover { color:#4a4468; }

@media (max-width: 480px) {
  .below-ring { flex-direction:column; align-items:flex-start; }
  .send-btn { width:100%; justify-content:center; }
  .drawer { width:100%; }
}
</style>