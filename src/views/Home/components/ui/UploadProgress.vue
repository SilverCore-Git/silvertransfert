<script setup lang="ts">
defineProps<{
  uploadPct: number;
  estimatedTime?: string | null;
}>();
</script>

<template>
  <div class="ring-uploading">
    <div class="arc-wrap">
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
      <span class="arc-pct">{{ Math.round(uploadPct) }}%</span>
    </div>
    <span class="upload-lbl">Envoi en cours…</span>
    <span v-if="estimatedTime" class="time-remaining">{{ estimatedTime }} restants</span>
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

.upload-lbl {
  font-size: 0.76rem;
  color: #635c87;
}
.time-remaining {
  font-size: 0.7rem;
  color: #a09cb4;
  font-style: italic;
}
</style>
