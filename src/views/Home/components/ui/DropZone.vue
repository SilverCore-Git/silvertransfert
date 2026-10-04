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
    class="drop-ring  backdrop-blur-md" 
    :class="{ active: isDragging || files.length > 0 }" 
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
.ring-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.ring-sub {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.drop-ring {
  width: 100%;
  min-height: 165px;
  border: 1.5px dashed color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-primary-strong) 2.5%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.3s;
  overflow: hidden;
  animation: fadeInScale 0.6s ease-out;
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

.drop-ring.active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary-strong) 7%, transparent);
}
@media (hover: hover) {
  .drop-ring:hover {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 20%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary-strong) 7%, transparent);
  }
}

.ring-icon {
  font-size: var(--text-2xl);
  color: var(--color-primary);
  opacity: 0.8;
  margin-bottom: 0.3rem;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.drop-ring.active .ring-icon {
  opacity: 1;
  transform: scale(1.1);
}
@media (hover: hover) {
  .drop-ring:hover .ring-icon {
    opacity: 1;
    transform: scale(1.1);
  }
}

.ring-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 2.25rem;
  text-align: center;
  pointer-events: none;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.drop-ring.active .ring-empty {
  transform: translateY(-5px);
}
@media (hover: hover) {
  .drop-ring:hover .ring-empty {
    transform: translateY(-5px);
  }
}
</style>
