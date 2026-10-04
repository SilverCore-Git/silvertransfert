<script setup lang="ts">
import home_json from '../../../../config/home.json';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

defineProps<{
  isDragging: boolean;
  files: FileItem[];
  isUploading: boolean;
}>();

const emit = defineEmits(['drop', 'dragover', 'dragleave', 'open-picker']);

function onDrop(e: DragEvent) {
  emit('drop', e);
}

function onDragOver(e: DragEvent) {
  emit('dragover', e);
}

function onDragLeave() {
  emit('dragleave');
}
</script>

<template>
  <div 
    class="drop-ring" 
    :class="{ active: files.length > 0, dragging: isDragging }" 
    :role="files.length === 0 && !isUploading ? 'button' : undefined"
    :tabindex="files.length === 0 && !isUploading ? 0 : undefined"
    :aria-label="files.length === 0 && !isUploading ? 'Ajouter des fichiers à envoyer' : undefined"
    @click="emit('open-picker')"
    @keydown.enter.self.prevent="emit('open-picker')"
    @keydown.space.self.prevent="emit('open-picker')"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- Empty State -->
    <div v-if="files.length === 0 && !isUploading" class="ring-empty">
      <i class="bi bi-cloud-upload-fill ring-icon" aria-hidden="true"></i>
      <span class="ring-label">{{ home_json.dropZone?.emptyLabel || 'Glissez vos fichiers ici' }}</span>
      <span class="ring-sub">{{ home_json.dropZone?.emptySub || 'ou cliquez pour parcourir' }}</span>
    </div>

    <!-- Files Slot (will be used by FileList) -->
    <slot v-else-if="!isUploading"></slot>

    <!-- Uploading Slot (will be used by UploadProgress) -->
    <slot name="uploading" v-if="isUploading"></slot>
  </div>
</template>

<style scoped>
.drop-ring {
  width: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed color-mix(in srgb, var(--color-text-muted) 45%, transparent);
  border-radius: 12px;
  background: var(--color-surface);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.drop-ring.active {
  min-height: 0;
  border-style: solid;
  border-color: var(--color-border);
  cursor: default;
}

.drop-ring.dragging {
  border-style: dashed;
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
}

@media (hover: hover) {
  .drop-ring:not(.active):hover {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
  }
}

.ring-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  pointer-events: none;
}

.ring-icon {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.ring-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.ring-sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
</style>
