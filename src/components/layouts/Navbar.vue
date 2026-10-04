<script setup lang="ts">
import { ref, nextTick } from 'vue';
import navigation_json from '../../config/navigation.json';
import { scrollToCurrentHash } from '../../router';

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
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="SilverTransfert, accueil">
        <img src="/logo_silvertransfert/logo_dark.svg" width="32" height="32" alt="" class="brand-mark" />
        <span class="brand-text" v-html="navigation_json.mobileMenu?.brand || 'Silver<span>Transfert</span>'"></span>
      </router-link>

      <nav class="top-nav-desktop" aria-label="Navigation principale">
        <router-link v-for="item in navigation_json.menuItems || []" :key="item.path" :to="item.path" class="nav-link" @click="scrollToCurrentHash(item.path)">{{ item.label }}</router-link>
      </nav>

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
    </div>

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
            <router-link v-for="item in navigation_json.menuItems || []" :key="item.path" :to="item.path" class="mobile-nav-btn" @click="closeMenu(); scrollToCurrentHash(item.path)">
              <i aria-hidden="true" class="bi" :class="item.icon"></i> {{ item.label }}
            </router-link>
          </div>

          <div class="drawer-footer">
            <p>&copy; Silvercore</p>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-deep);
}

.header-inner {
  max-width: var(--container-page);
  height: 64px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  border-radius: var(--radius-button);
}

.brand-mark {
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--color-border);
}

.brand-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.brand-text :deep(span) {
  color: var(--color-primary);
}

.top-nav-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.75rem 0;
  border-radius: 4px;
  transition: color 0.2s ease;
}

@media (hover: hover) {
  .nav-link:hover {
    color: var(--color-text);
  }
}

.mobile-menu-trigger {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-xl);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

@media (hover: hover) {
  .mobile-menu-trigger:hover {
    background: var(--color-surface-2);
  }
}

.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-bg) 70%, transparent);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.mobile-nav-drawer {
  width: min(300px, 90vw);
  height: 100dvh;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overscroll-behavior: contain;
}

.drawer-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-button);
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  cursor: pointer;
}

@media (hover: hover) {
  .drawer-close-btn:hover {
    color: var(--color-text);
    background: var(--color-surface-2);
  }
}

.drawer-brand {
  margin: 0.5rem 0 2.5rem;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.mobile-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 48px;
  padding: 0 1rem;
  border-radius: var(--radius-button);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-nav-btn i {
  font-size: var(--text-lg);
  color: var(--color-primary);
}

@media (hover: hover) {
  .mobile-nav-btn:hover {
    color: var(--color-text);
    background: var(--color-surface-2);
  }
}

.drawer-footer {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  padding-top: 1.25rem;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.25s ease;
}

.slide-fade-enter-active .mobile-nav-drawer, .slide-fade-leave-active .mobile-nav-drawer {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .mobile-nav-drawer, .slide-fade-leave-to .mobile-nav-drawer {
  transform: translateX(100%);
}

@media (min-width: 768px) {
  .header-inner {
    padding: 0 2rem;
  }
}

@media (max-width: 1023px) {
  .top-nav-desktop {
    display: none;
  }

  .mobile-menu-trigger {
    display: flex;
  }
}
</style>
