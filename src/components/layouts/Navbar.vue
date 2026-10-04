<script setup lang="ts">
import { ref, nextTick } from 'vue';
import navigation_json from '../../config/navigation.json';

const isMenuOpen = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const closeRef = ref<HTMLButtonElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);

function toggleMenu() {
  if (isMenuOpen.value) return closeMenu();
  isMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
  nextTick(() => closeRef.value?.focus());
}

function closeMenu() {
  if (!isMenuOpen.value) return;
  isMenuOpen.value = false;
  document.body.style.overflow = '';
  triggerRef.value?.focus();
}

// Keep Tab / Shift+Tab cycling inside the open drawer
function trapFocus(e: KeyboardEvent) {
  const items = drawerRef.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
  if (!items?.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
</script>

<template>
  <nav class="top-nav-wrapper">
    <!-- Desktop Navigation Menu -->
    <div class="top-nav-desktop">
      <router-link v-for="item in navigation_json.menuItems || []" :key="item.path" :to="item.path" class="nav-btn">{{ item.label }}</router-link>
    </div>

    <!-- Mobile Hamburguer Trigger -->
    <button 
      ref="triggerRef"
      class="mobile-menu-trigger" 
      @click="toggleMenu" 
      :aria-expanded="isMenuOpen" 
      aria-controls="mobile-nav"
      :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
    >
      <i aria-hidden="true" class="bi" :class="isMenuOpen ? 'bi-x' : 'bi-list'"></i>
    </button>

    <!-- Mobile Navigation Drawer Overlay -->
    <Transition name="slide-fade">
      <div v-if="isMenuOpen" class="mobile-nav-overlay" @click.self="closeMenu" @keydown.esc="closeMenu" @keydown.tab="trapFocus">
        <div id="mobile-nav" ref="drawerRef" class="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu de navigation">
          <button ref="closeRef" class="drawer-close-btn" @click="closeMenu" aria-label="Fermer le menu">
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </button>
          
          <div class="drawer-brand">
            <span class="brand-text" v-html="navigation_json.mobileMenu?.brand || 'Silver<span>Transfert</span>'"></span>
          </div>

          <div class="mobile-menu-links">
            <router-link v-for="item in navigation_json.menuItems || []" :key="item.path" :to="item.path" class="mobile-nav-btn" @click="closeMenu">
              <i aria-hidden="true" class="bi" :class="item.icon"></i> {{ item.label }}
            </router-link>
          </div>

          <div class="drawer-footer">
            <p>&copy; Silvercore</p>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.top-nav-wrapper {
  position: absolute;
  top: clamp(0.75rem, 2vh, 1.5rem);
  right: clamp(0.5rem, 2vw, 2rem);
  z-index: 10000;
  font-family: 'Outfit', sans-serif;
}

.top-nav-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn {
  background: rgba(10, 8, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.55rem 1.35rem;
  border-radius: 9999px;
  text-decoration: none;
  font-size: var(--text-xs);
  font-weight: 500;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
  color: var(--color-text);
}

@media (hover: hover) {
  .nav-btn:hover {
    background: var(--hover-background);
    border-color: var(--hover-border);
    transform: translateY(-1px);
  }
}

.mobile-menu-trigger {
  display: none;
  background: rgba(10, 8, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-text-muted);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
  backdrop-filter: blur(10px);
}

@media (hover: hover) {
  .mobile-menu-trigger:hover {
    background: color-mix(in srgb, var(--color-primary-strong) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-primary-strong) 40%, transparent);
    color: var(--color-text);
  }
}

.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 5, 10, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.mobile-nav-drawer {
  width: min(290px, 90vw);
  height: 100dvh;
  background: var(--color-surface);
  border-left: 1px solid color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  padding: clamp(1.5rem, 5vh, 3rem) clamp(1rem, 5vw, 2rem);
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);
  position: relative;
}

.drawer-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  cursor: pointer;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

@media (hover: hover) {
  .drawer-close-btn:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.05);
  }
}

.drawer-brand {
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
}

.brand-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.brand-text span {
  background: linear-gradient(135deg, var(--color-primary-strong) 0%, var(--color-primary-soft) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.mobile-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: var(--text-base);
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-btn i {
  font-size: var(--text-lg);
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

@media (hover: hover) {
  .mobile-nav-btn:hover {
    color: var(--color-text);
    background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-primary-strong) 30%, transparent);
  }
}

@media (hover: hover) {
  .mobile-nav-btn:hover i {
    transform: scale(1.1);
  }
}

.drawer-footer {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.5rem;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-active .mobile-nav-drawer, .slide-fade-leave-active .mobile-nav-drawer {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .mobile-nav-drawer, .slide-fade-leave-to .mobile-nav-drawer {
  transform: translateX(100%);
}

@media (max-width: 1023px) {
  .top-nav-desktop {
    display: none;
  }

  .mobile-menu-trigger {
    display: flex;
  }

  .top-nav-wrapper {
    top: clamp(0.75rem, 2vh, 1.5rem);
    right: clamp(0.5rem, 2vw, 2rem);
  }
}

@media (max-width: 900px) and (min-width: 769px) {
  .top-nav-desktop {
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.45rem 1rem;
    font-size: var(--text-xs);
  }
}

@media (max-width: 360px) {
  .top-nav-wrapper {
    top: 0.75rem;
    right: 0.75rem;
  }

  .mobile-menu-trigger {
    width: 40px;
    height: 40px;
    font-size: var(--text-lg);
  }
}

@media (max-width: 320px) {
  .mobile-nav-drawer {
    width: 100vw;
    padding: 1rem;
  }

  .drawer-brand {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .brand-text {
    font-size: var(--text-lg);
  }
}

@media (min-width: 1536px) {
  .top-nav-desktop {
    gap: 1rem;
  }

  .nav-btn {
    padding: 0.65rem 1.5rem;
    font-size: var(--text-sm);
  }
}

.drawer-close-btn {
  width: 44px;
  height: 44px;
}

.nav-btn {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>
