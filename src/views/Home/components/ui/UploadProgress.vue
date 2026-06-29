<script setup lang="ts">
import { computed } from 'vue';

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
    return `${gigabytesPerSecond.toFixed(1)} GB/s`;
  } else if (megabytesPerSecond >= 1) {
    return `${megabytesPerSecond.toFixed(1)} MB/s`;
  } else {
    const kilobytesPerSecond = bytesPerSecond / 1024;
    return `${kilobytesPerSecond.toFixed(1)} KB/s`;
  }
});
</script>

<template>
  <div class="ring-uploading">
    <div class="arc-wrap" :class="{ 'finalizing': isFinalizing }">
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
      <span class="arc-pct">
        <template v-if="!isFinalizing">
          {{ Math.round(uploadPct) }}%
        </template>
        <template v-else>
          <i class="bi bi-check-lg final-icon"></i>
        </template>
      </span>
    </div>
    <span class="upload-lbl">
      <template v-if="!isFinalizing">
        Envoi en cours<span v-if="uploadPct >= 100">.</span><span v-else>…</span>
      </template>
      <template v-else>
        Finalisation
      </template>
    </span>
    <span v-if="estimatedTime && !isFinalizing" class="time-remaining">{{ estimatedTime }} restants</span>
    <span v-if="formattedSpeed && !isFinalizing" class="upload-speed">{{ formattedSpeed }}</span>
    <span v-else-if="isFinalizing" class="finalizing-lbl">Préparation du lien…</span>
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
  font-size: 0.85rem;
  font-weight: 700;
  color: #a78bfa;
  font-variant-numeric: tabular-nums;
}

.final-icon {
  font-size: 1.2rem;
  color: #22c55e;
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
  font-size: 0.76rem;
  color: #635c87;
  transition: all 0.3s;
}

.finalizing-lbl {
  font-size: 0.7rem;
  color: #22c55e;
  font-style: italic;
  animation: pulse 1s ease-in-out infinite;
}

.time-remaining {
  font-size: 0.7rem;
  color: #a09cb4;
  font-style: italic;
  transition: all 0.3s;
}

.upload-speed {
  font-size: 0.7rem;
  color: #a09cb4;
  font-style: italic;
  transition: all 0.3s;
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
</style>
