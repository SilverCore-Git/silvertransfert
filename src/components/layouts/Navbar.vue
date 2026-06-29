<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeMenu() {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
}
</script>

<template>
  <nav class="top-nav-wrapper">
    <!-- Desktop Navigation Menu -->
    <div class="top-nav-desktop">
      <a href="/#accueil" class="nav-btn">Accueil</a>
      <a href="/#presentation" class="nav-btn">Présentation</a>
      <a href="/#faq" class="nav-btn">FAQ</a>
    </div>

    <!-- Mobile Hamburguer Trigger -->
    <button 
      class="mobile-menu-trigger" 
      @click="toggleMenu" 
      :aria-expanded="isMenuOpen" 
      aria-label="Menu de navigation"
    >
      <i class="bi" :class="isMenuOpen ? 'bi-x' : 'bi-list'"></i>
    </button>

    <!-- Mobile Navigation Drawer Overlay -->
    <Transition name="slide-fade">
      <div v-if="isMenuOpen" class="mobile-nav-overlay" @click.self="closeMenu">
        <div class="mobile-nav-drawer">
          <button class="drawer-close-btn" @click="closeMenu" aria-label="Fermer">
            <i class="bi bi-x-lg"></i>
          </button>
          
          <div class="drawer-brand">
            <span class="brand-text">Silver<span>Transfert</span></span>
          </div>

          <div class="mobile-menu-links">
            <a href="/#accueil" class="mobile-nav-btn" @click="closeMenu">
              <i class="bi bi-house-door"></i> Accueil
            </a>
            <a href="/#presentation" class="mobile-nav-btn" @click="closeMenu">
              <i class="bi bi-lightning-charge"></i> Présentation
            </a>
            <a href="/#faq" class="mobile-nav-btn" @click="closeMenu">
              <i class="bi bi-question-circle"></i> FAQ
            </a>
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.top-nav-wrapper {
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  z-index: 9999;
  font-family: 'Outfit', sans-serif;
}

/* Desktop Styles */
.top-nav-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn {
  background: rgba(10, 8, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a09cb4;
  padding: 0.55rem 1.35rem;
  border-radius: 100px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(99, 86, 229, 0.12);
  border-color: rgba(99, 86, 229, 0.4);
  color: #fff;
  transform: translateY(-1px);
}

/* Mobile Trigger Button */
.mobile-menu-trigger {
  display: none;
  background: rgba(10, 8, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a09cb4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  outline: none;
}

.mobile-menu-trigger:hover {
  background: rgba(99, 86, 229, 0.12);
  border-color: rgba(99, 86, 229, 0.4);
  color: #fff;
}

/* Drawer overlay */
.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 5, 10, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9998;
  display: flex;
  justify-content: flex-end;
}

/* Drawer panel */
.mobile-nav-drawer {
  width: 290px;
  height: 100vh;
  background: #0d0b19;
  border-left: 1px solid rgba(99, 86, 229, 0.1);
  padding: 3rem 2rem;
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
  color: #635c87;
  font-size: 1.25rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.drawer-close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.drawer-brand {
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
}

.brand-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.brand-text span {
  background: linear-gradient(135deg, #6356e5 0%, #a78bfa 100%);
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
  color: #a09cb4;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-btn i {
  font-size: 1.1rem;
  color: #6356e5;
  transition: transform 0.3s ease;
}

.mobile-nav-btn:hover {
  color: #fff;
  background: rgba(99, 86, 229, 0.1);
  border-color: rgba(99, 86, 229, 0.3);
  transform: translateX(4px);
}

.mobile-nav-btn:hover i {
  transform: scale(1.1);
}

.drawer-footer {
  font-size: 0.75rem;
  color: #635c87;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.5rem;
}

/* Animations using Transition tags */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-active .mobile-nav-drawer,
.slide-fade-leave-active .mobile-nav-drawer {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .mobile-nav-drawer,
.slide-fade-leave-to .mobile-nav-drawer {
  transform: translateX(100%);
}

/* Media Query breakpoints */
@media (max-width: 768px) {
  .top-nav-desktop {
    display: none;
  }
  
  .mobile-menu-trigger {
    display: flex;
  }
  
  .top-nav-wrapper {
    top: 1rem;
    right: 1.25rem;
  }
}
</style>
