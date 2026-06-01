<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Transition name="overlay">
    <div v-if="isOpen" class="overlay" @click.self="emit('close')">
      <div class="drawer">
        <button class="drawer-close" @click="emit('close')" aria-label="Fermer">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Drawer brand -->
        <div class="drawer-brand">
          <svg class="d-logo-svg" viewBox="15 15 120 120" xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor">
              <path d="M83.7,71.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C83,70.9,83.3,71.1,83.7,71.1z"/>
              <path d="M92.4,66.1c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4l-1.7,1c-0.5,0.3-0.6,0.9-0.4,1.4C91.7,65.9,92,66.1,92.4,66.1z"/>
              <path d="M66.4,69l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C67,69.9,66.8,69.3,66.4,69z"/>
              <path d="M57.6,64.1l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C58.3,65,58.1,64.4,57.6,64.1z"/>
              <path d="M75,94c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,94.4,75.6,94,75,94z"/>
              <path d="M75,84c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C76,84.4,75.6,84,75,84z"/>
              <path d="M75,65.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,65.4,74.4,65.9,75,65.9z"/>
              <path d="M75,55.9c0.6,0,1-0.4,1-1v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2C74,55.4,74.4,55.9,75,55.9z"/>
              <path d="M94.7,84.9l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C95.3,85.8,95.2,85.2,94.7,84.9z"/>
              <path d="M86,80l-1.7-1c-0.5-0.3-1.1-0.1-1.4,0.4s-0.1,1.1,0.4,1.4l1.7,1c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5C86.6,80.9,86.4,80.3,86,80z"/>
              <path d="M56.7,84.2l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C57.8,84.1,57.1,83.9,56.7,84.2z"/>
              <path d="M65.4,79.3l-1.7,1c-0.5,0.3-0.7,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l1.7-1c0.5-0.3,0.7-0.9,0.4-1.4C66.5,79.2,65.9,79,65.4,79.3z"/>
              <path d="M75,69.5c-3.1,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S78.1,69.5,75,69.5z M75,78.5c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S76.9,78.5,75,78.5z"/>
            </g>
          </svg>
          <div>
            <p class="d-name">SilverTransfer</p>
            <p class="d-sub">by Silvercore</p>
          </div>
        </div>

        <nav class="drawer-nav">
          <a href="#" @click="emit('close')"><i class="bi bi-lightning-charge-fill"></i>Fonctionnalités</a>
          <a href="#" @click="emit('close')"><i class="bi bi-tag-fill"></i>Tarifs</a>
          <a href="#" @click="emit('close')"><i class="bi bi-code-slash"></i>API</a>
          <a href="#" @click="emit('close')"><i class="bi bi-shield-lock-fill"></i>Sécurité</a>
          <a href="#" @click="emit('close')"><i class="bi bi-people-fill"></i>À propos</a>
        </nav>

        <div class="drawer-actions">
          <a href="#" class="d-ghost">Connexion</a>
          <a href="#" class="d-filled">Créer un compte</a>
        </div>

        <div class="drawer-badges">
          <span><i class="bi bi-shield-lock-fill"></i>Chiffrement de bout en bout</span>
          <span><i class="bi bi-server"></i>Hébergé en France</span>
          <span><i class="bi bi-infinity"></i>Sans limite de taille</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 285px;
  height: 100%;
  background: #0d0b19;
  border-left: 1px solid rgba(99, 86, 229, 0.1);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
  position: relative;
}

.drawer-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: #4a4468;
  font-size: 1rem;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.drawer-close:hover {
  color: #e2e0f0;
  background: rgba(255, 255, 255, 0.05);
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.d-logo-svg {
  width: 34px;
  height: 34px;
  color: #6356e5;
  flex-shrink: 0;
}

.d-name {
  font-size: 0.975rem;
  font-weight: 700;
  color: #e2e0f0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.d-sub {
  font-size: 0.7rem;
  color: #4a4468;
  font-weight: 400;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.drawer-nav a {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: #7a7499;
  font-size: 0.865rem;
  font-weight: 500;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}

.drawer-nav a i {
  font-size: 0.78rem;
  color: #33304d;
  transition: color 0.15s;
}

.drawer-nav a:hover {
  color: #e2e0f0;
  background: rgba(99, 86, 229, 0.09);
}

.drawer-nav a:hover i {
  color: #6356e5;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.d-ghost,
.d-filled {
  display: block;
  text-align: center;
  text-decoration: none;
  font-size: 0.83rem;
  font-weight: 600;
  padding: 0.58rem;
  border-radius: 9px;
  transition: all 0.15s;
  font-family: 'Outfit', sans-serif;
}

.d-ghost {
  color: #7a7499;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.d-ghost:hover {
  color: #e2e0f0;
  border-color: rgba(255, 255, 255, 0.15);
}

.d-filled {
  background: #6356e5;
  color: white;
  box-shadow: 0 4px 16px rgba(99, 86, 229, 0.28);
}

.d-filled:hover {
  background: #7267f0;
}

.drawer-badges {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 1.2rem;
}

.drawer-badges span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  color: #3d3a5a;
}

.drawer-badges i {
  color: #6356e5;
  font-size: 0.65rem;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .drawer,
.overlay-leave-active .drawer {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-enter-from .drawer,
.overlay-leave-to .drawer {
  transform: translateX(100%);
}
</style>
