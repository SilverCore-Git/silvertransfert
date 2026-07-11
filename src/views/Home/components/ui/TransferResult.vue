<script setup lang="ts">
import { formatSize } from '../../../../utils/file';
import { config, getConfigValue } from '../../../../utils/config';

defineProps<{
  filesCount: number;
  totalSize: number;
  link: string;
  copied: boolean;
}>();

const emit = defineEmits(['copy', 'reset']);
</script>

<template>
  <div class="result-box">
    <div class="result-check">
      <i class="bi bi-check-lg"></i>
    </div>
    <p class="result-meta">
      {{ getConfigValue('home.transferResult.fileCount', {
        count: filesCount,
        plural: filesCount > 1 ? 's' : ''
      }) }} · {{ formatSize(totalSize) }}
    </p>
    
    <div class="link-row">
      <span class="link-text">{{ link }}</span>
      <button class="link-copy" @click="emit('copy')">
        <i :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
        {{ copied ? config.home?.transferResult?.copyButton?.copied || 'Copié !' : config.home?.transferResult?.copyButton?.default || 'Copier' }}
      </button>
    </div>
    
    <button class="reset-btn" @click="emit('reset')">
      <i class="bi bi-arrow-counterclockwise"></i> {{ config.home?.transferResult?.newTransfer || 'Nouveau transfert' }}
    </button>
  </div>
</template>

<style scoped>
.result-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  max-width: 430px;
}

.result-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  max-width: 430px;
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-check {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(99, 86, 229, 0.1);
  border: 1.5px solid rgba(99, 86, 229, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: #7c6ff5;
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
  position: relative;
  overflow: hidden;
}

.result-check::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1.5px solid rgba(99, 86, 229, 0.4);
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
  font-size: 0.76rem;
  color: #615c85;
}

.link-row {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 86, 229, 0.14);
  border-radius: 10px;
  overflow: hidden;
}

.link-text {
  flex: 1;
  padding: 0.65rem 0.85rem;
  font-size: 0.8rem;
  color: #7c6ff5;
  font-weight: 600;
  word-break: break-all;
}

.link-copy {
  padding: 0.65rem 0.85rem;
  background: rgba(99, 86, 229, 0.07);
  border: none;
  border-left: 1px solid rgba(99, 86, 229, 0.1);
  color: #7c6ff5;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
  transition: background 0.15s;
}

.link-copy:hover {
  background: rgba(99, 86, 229, 0.13);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #615c85;
  font-size: 0.76rem;
  font-weight: 500;
  padding: 0.42rem 0.85rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s, border-color 0.15s;
}

.reset-btn:hover {
  color: var(--color-text-secondary);
  border-color: rgba(255, 255, 255, 0.13);
}
</style>
