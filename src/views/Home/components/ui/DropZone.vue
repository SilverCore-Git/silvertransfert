<script setup lang="ts">
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
    @click="emit('open-picker')"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- Empty State -->
    <div v-if="files.length === 0 && !isUploading" class="ring-empty">
      <i class="bi bi-cloud-upload-fill ring-icon"></i>
      <span class="ring-label">Glissez vos fichiers ici</span>
      <span class="ring-sub">ou cliquez pour parcourir</span>
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
  min-height: 165px;
  border: 1.5px dashed rgba(99, 86, 229, 0.18);
  border-radius: 16px;
  background: rgba(99, 86, 229, 0.025);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  overflow: hidden;
}

.drop-ring:hover,
.drop-ring.active {
  border-color: rgba(99, 86, 229, 0.5);
  background: rgba(99, 86, 229, 0.055);
  box-shadow: 0 0 0 4px rgba(99, 86, 229, 0.07);
}

.ring-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.ring-sub {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* DropZone Animations */
.drop-ring {
  width: 100%;
  min-height: 165px;
  border: 1.5px dashed rgba(127, 108, 255, 0.3);
  border-radius: 16px;
  background: rgba(99, 86, 229, 0.025);
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

.drop-ring:hover,
.drop-ring.active {
  /* border-color: rgba(99, 86, 229, 0.5); */
  border-color: var(--color-primary);
  background: rgba(127, 108, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(99, 86, 229, 0.07);
  transform: scale(1.02);
}

.ring-icon {
  font-size: 1.9rem;
  color: var(--color-primary);
  opacity: 0.8;
  margin-bottom: 0.3rem;
  transition: all 0.3s;
}

.drop-ring:hover .ring-icon,
.drop-ring.active .ring-icon {
  opacity: 1;
  transform: scale(1.1);
}

.ring-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 2.25rem;
  text-align: center;
  pointer-events: none;
  transition: all 0.3s;
}

.drop-ring:hover .ring-empty,
.drop-ring.active .ring-empty {
  transform: translateY(-5px);
}
</style>
