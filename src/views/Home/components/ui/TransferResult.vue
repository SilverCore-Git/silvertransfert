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
        <i aria-hidden="true" :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
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
/* Fills the tool panel (no own max-width), so it stays centred whatever the panel width */
.result-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 1.5rem 0.25rem 0.5rem;
  animation: result-in 0.35s cubic-bezier(0.32, 0.72, 0, 1) 0.1s both;
}

@keyframes result-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

.result-check {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-primary-strong) 16%, var(--color-surface-2));
  color: var(--color-primary);
  font-size: var(--text-xl);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

@keyframes pop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.result-meta {
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

.link-row {
  display: flex;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  overflow: hidden;
}

.link-text {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  word-break: break-all;
  user-select: all;
}

.link-copy {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  padding: 0 1.1rem;
  border: none;
  background: var(--color-primary-strong);
  color: #fff;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

@media (hover: hover) {
  .link-copy:hover {
    background: var(--color-primary-strong-hover);
  }
}

.copy-failed {
  font-size: var(--text-sm);
  color: var(--color-danger-soft);
  text-align: center;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0 1rem;
  border: none;
  border-radius: var(--radius-button);
  background: none;
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

@media (hover: hover) {
  .reset-btn:hover {
    color: var(--color-text);
    background: var(--color-surface);
  }
}
</style>
