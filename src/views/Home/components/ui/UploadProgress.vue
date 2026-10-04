<script setup lang="ts">
import { computed } from 'vue';
import { getConfigValue } from '../../../../utils/config';
import home_json from '../../../../config/home.json';

const props = defineProps<{
  uploadPct: number;
  estimatedTime?: string | null;
  uploadSpeed?: number | null;
}>();

const isFinalizing = computed(() => props.uploadPct >= 100);

const formattedSpeed = computed(() => {
  if (!props.uploadSpeed || props.uploadSpeed <= 0) return null;
  
  const bytesPerSecond = props.uploadSpeed;
  const megabytesPerSecond = bytesPerSecond / (1024 * 1024);
  const gigabytesPerSecond = megabytesPerSecond / 1024;
  
  if (gigabytesPerSecond >= 1) {
    return `${gigabytesPerSecond.toFixed(1)} Go/s`;
  } else if (megabytesPerSecond >= 1) {
    return `${megabytesPerSecond.toFixed(1)} Mo/s`;
  } else {
    const kilobytesPerSecond = bytesPerSecond / 1024;
    return `${kilobytesPerSecond.toFixed(1)} Ko/s`;
  }
});
</script>

<template>
  <div class="ring-uploading">
    <div class="arc-wrap" :class="{ 'finalizing': isFinalizing }" role="progressbar" aria-label="Progression de l'envoi" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(uploadPct)">
      <svg viewBox="0 0 80 80" class="arc-svg" aria-hidden="true">
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
            <stop offset="0%" style="stop-color: var(--color-primary-soft)"/>
            <stop offset="100%" style="stop-color: var(--color-primary-strong)"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="arc-pct">
        <template v-if="!isFinalizing">
          {{ Math.round(uploadPct) }}%
        </template>
        <template v-else>
          <i aria-hidden="true" class="bi bi-check-lg final-icon"></i>
        </template>
      </span>
    </div>
    <span class="upload-lbl" aria-live="polite">
      <template v-if="!isFinalizing">
        {{ home_json.uploadProgress?.uploading || 'Envoi en cours' }}<span v-if="uploadPct >= 100">.</span><span v-else>…</span>
      </template>
      <template v-else>
        {{ home_json.uploadProgress?.finalizing || 'Finalisation' }}
      </template>
    </span>
    <span v-if="estimatedTime && !isFinalizing" class="time-remaining">{{ getConfigValue('home.uploadProgress.timeRemaining', { time: estimatedTime }) }}</span>
    <span v-if="formattedSpeed && !isFinalizing" class="upload-speed">{{ formattedSpeed }}</span>
    <span v-else-if="isFinalizing" class="finalizing-lbl">{{ home_json.uploadProgress?.preparingLink || 'Préparation du lien…' }}</span>
  </div>
</template>

<style scoped>
.ring-uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 2rem;
  pointer-events: none;
  animation: fadeIn 0.4s ease-out;
}

.arc-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  animation: scaleIn 0.5s ease-out;
}

.arc-wrap.finalizing {
  animation: pulse 1s ease-in-out infinite;
}

.arc-svg {
  width: 72px;
  height: 72px;
}

.arc-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-primary-soft);
  font-variant-numeric: tabular-nums;
}

.final-icon {
  font-size: var(--text-lg);
  color: var(--color-success);
  animation: checkmark-pop 0.5s ease-out;
}

@keyframes checkmark-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.upload-lbl {
  font-size: var(--text-xs);
  color: var(--color-text);
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.finalizing-lbl {
  font-size: var(--text-xs);
  color: var(--color-success);
  font-style: italic;
  animation: pulse 1s ease-in-out infinite;
}

.time-remaining {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-style: italic;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

.upload-speed {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-style: italic;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
}

/* Finalization Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.time-remaining, .upload-speed { font-variant-numeric: tabular-nums; }
</style>
