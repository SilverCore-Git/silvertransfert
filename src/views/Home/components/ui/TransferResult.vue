<script setup lang="ts">
import { formatSize } from '../../../../utils/file';
import { getConfigValue } from '../../../../utils/config';
import home_json from '../../../../config/home.json';

defineProps<{
  filesCount: number;
  totalSize: number;
  link: string;
  copied: boolean;
  copyFailed?: boolean;
}>();

const emit = defineEmits(['copy', 'reset']);
</script>

<template>
  <div class="result-box">
    <div class="result-check">
      <i aria-hidden="true" class="bi bi-check-lg"></i>
    </div>
    <p class="result-meta">
      {{ getConfigValue('home.transferResult.fileCount', {
        count: filesCount,
        plural: filesCount > 1 ? 's' : ''
      }) }} · {{ formatSize(totalSize) }}
    </p>
    
    <div class="link-row">
      <span class="link-text">{{ link }}</span>
      <button class="link-copy" aria-live="polite" @click="emit('copy')">
        <i :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
        {{ copied ? home_json.transferResult?.copyButton?.copied || 'Lien copié' : home_json.transferResult?.copyButton?.default || 'Copier' }}
      </button>
    </div>
    <p v-if="copyFailed" role="alert" class="copy-failed">Copie impossible : sélectionnez le lien ci-dessus et copiez-le manuellement.</p>
    
    <button class="reset-btn" @click="emit('reset')">
      <i aria-hidden="true" class="bi bi-arrow-counterclockwise"></i> {{ home_json.transferResult?.newTransfer || 'Nouveau transfert' }}
    </button>
  </div>
</template>

<style scoped>
.copy-failed {
  font-size: var(--text-xs);
  color: var(--color-danger-soft);
  text-align: center;
  margin: 0.5rem 0 0;
}

.link-text {
  user-select: all;
}

.result-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  max-width: var(--container-card);
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-check {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--color-primary-strong) 28%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  color: var(--color-primary);
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
  position: relative;
  overflow: hidden;
}

.result-check::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1.5px solid color-mix(in srgb, var(--color-primary-strong) 40%, transparent);
  animation: pulse-ring 2s infinite;
}

@keyframes pop {
  from {
  transform: scale(0.4);
  opacity: 0;
  }
  to {
  transform: scale(1);
  opacity: 1;
  }
}

@keyframes pulse-ring {
  0%, 100% {
  opacity: 0;
  transform: scale(1);
  }
  50% {
  opacity: 1;
  transform: scale(1.2);
  }
}

@keyframes scaleIn {
  from {
  opacity: 0;
  transform: scale(0.9);
  }
  to {
  opacity: 1;
  transform: scale(1);
  }
}

.result-meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.link-row {
  display: flex;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid color-mix(in srgb, var(--color-primary-strong) 14%, transparent);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.link-text {
  flex: 1;
  padding: 0.65rem 0.85rem;
  font-size: var(--text-xs);
  color: var(--color-primary);
  font-weight: 600;
  word-break: break-all;
}

.link-copy {
  padding: 0.65rem 0.85rem;
  background: color-mix(in srgb, var(--color-primary-strong) 7%, transparent);
  border: none;
  border-left: 1px solid color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
  transition: background 0.15s;
}

@media (hover: hover) {
  .link-copy:hover {
    background: color-mix(in srgb, var(--color-primary-strong) 13%, transparent);
  }
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 0.42rem 0.85rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s, border-color 0.15s;
}

@media (hover: hover) {
  .reset-btn:hover {
    color: var(--color-text);
    border-color: rgba(255, 255, 255, 0.13);
  }
}
</style>
