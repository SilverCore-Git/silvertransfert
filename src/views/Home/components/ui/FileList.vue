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
          <i v-else aria-hidden="true" :class="'bi ' + getFileIcon(f.type)"></i>
        </div>
        <span class="fname">{{ f.name }}</span>
        <span class="fsize">{{ formatSize(f.size) }}</span>
        <button class="fdelete" @click.stop="emit('remove', f.id)" aria-label="Supprimer">
          <i aria-hidden="true" class="bi bi-x"></i>
        </button>
      </div>
    </TransitionGroup>
    
    <button class="add-more" @click.stop="emit('add')">
      <i aria-hidden="true" class="bi bi-plus"></i> Ajouter
    </button>
  </div>
</template>

<style scoped>
.ring-files {
  position: relative;
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
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (hover: hover) {
  .frow:hover {
    border: 1px dashed var(--color-primary);
  }
}

.fthumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fname {
  flex: 1;
  min-width: 0;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fsize {
  font-size: var(--text-xs);
  color: var(--color-text);
  flex-shrink: 0;
}

.add-more {
  border: 1px dashed rgba(255, 255, 255, 0.05);
}

@media (hover: hover) {
  .add-more:hover {
    border-color: color-mix(in srgb, var(--color-primary-strong) 30%, transparent);
  }
}

.list-enter-active {
  transition: opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1), transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
  width: calc(100% - 1.2rem);
}

/* remaining rows glide into place instead of jumping */
.list-move {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.fthumb {
  width: 27px;
  height: 27px;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  color: var(--color-primary);
  flex-shrink: 0;
  overflow: hidden;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.fdelete {
  width: 19px;
  height: 19px;
  border-radius: var(--radius-lg);
  border: none;
  background: none;
  color: var(--color-danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  transform: scale(1.2);
}

@media (hover: hover) {
  .fdelete:hover {
    color: var(--color-text);
    background: rgba(255, 0, 0, 0.5);
  }
}

.add-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Outfit', sans-serif;
  margin-top: 0.08rem;
}

@media (hover: hover) {
  .add-more:hover {
    color: var(--color-text);
    border: 1px dashed var(--color-primary);
    background: color-mix(in srgb, var(--color-primary-strong) 5%, transparent);
  }
}

.fdelete {
  position: relative;
}

.fdelete::after {
  content: '';
  position: absolute;
  inset: -13px;
}

.fsize {
  font-variant-numeric: tabular-nums;
}
</style>
