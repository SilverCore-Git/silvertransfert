<script setup lang="ts">
import { formatSize, getFileIcon } from '../../../../utils/file';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

defineProps<{
  files: FileItem[];
}>();

const emit = defineEmits(['remove', 'add']);
</script>

<template>
  <div class="ring-files" @click.stop>
    <TransitionGroup name="list">
      <div v-for="f in files" :key="f.id" class="frow">
        <div class="fthumb">
          <img v-if="f.preview" :src="f.preview" :alt="f.name" />
          <i v-else :class="'bi ' + getFileIcon(f.type)"></i>
        </div>
        <span class="fname">{{ f.name }}</span>
        <span class="fsize">{{ formatSize(f.size) }}</span>
        <button class="fdelete" @click.stop="emit('remove', f.id)" aria-label="Supprimer">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </TransitionGroup>
    
    <button class="add-more" @click.stop="emit('add')">
      <i class="bi bi-plus"></i> Ajouter
    </button>
  </div>
</template>

<style scoped>
.ring-files {
  width: 100%;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.frow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.38rem 0.45rem;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: border-color 0.15s, transform 0.2s;
}

.frow:hover {
  border-color: rgba(99, 86, 229, 0.18);
}

.fthumb {
  width: 27px;
  height: 27px;
  border-radius: 6px;
  background: rgba(99, 86, 229, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: #7c6ff5;
  flex-shrink: 0;
  overflow: hidden;
}

.fthumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fname {
  flex: 1;
  min-width: 0;
  font-size: 0.77rem;
  font-weight: 500;
  color: #bbb8d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fsize {
  font-size: 0.68rem;
  color: #615c85;
  flex-shrink: 0;
}

.fdelete {
  width: 19px;
  height: 19px;
  border-radius: 5px;
  border: none;
  background: none;
  color: #615c85;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.fdelete:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.add-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.35rem;
  font-size: 0.73rem;
  font-weight: 500;
  color: #615c85;
  background: none;
  border: 1px dashed rgba(255, 255, 255, 0.05);
  border-radius: 7px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  font-family: 'Outfit', sans-serif;
  margin-top: 0.08rem;
}

.add-more:hover {
  color: #7c6ff5;
  border-color: rgba(99, 86, 229, 0.3);
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
