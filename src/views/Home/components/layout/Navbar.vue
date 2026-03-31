<script setup lang="ts">
import { ref } from 'vue';

const mobileMenuOpen = ref(false);
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <a href="/" class="logo">
        <div class="logo-icon">
          <i class="bi bi-send-fill"></i>
        </div>
        <span class="logo-text">swift<strong>drop</strong></span>
      </a>

      <!-- Desktop nav -->
      <ul class="nav-links">
        <li><a href="#" class="nav-link">Fonctionnalités</a></li>
        <li><a href="#" class="nav-link">Tarifs</a></li>
        <li><a href="#" class="nav-link">API</a></li>
        <li><a href="#" class="nav-link">À propos</a></li>
      </ul>

      <!-- CTA -->
      <div class="nav-actions">
        <a href="#" class="btn-ghost">Connexion</a>
        <a href="#" class="btn-primary">Créer un compte</a>
      </div>

      <!-- Burger -->
      <button class="burger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
        <i :class="mobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <a href="#" class="mobile-link">Fonctionnalités</a>
      <a href="#" class="mobile-link">Tarifs</a>
      <a href="#" class="mobile-link">API</a>
      <a href="#" class="mobile-link">À propos</a>
      <div class="mobile-actions">
        <a href="#" class="btn-ghost">Connexion</a>
        <a href="#" class="btn-primary">Créer un compte</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 250, 252, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.08);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: var(--primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.logo-text {
  font-family: 'Sora', sans-serif;
  font-size: 1.15rem;
  color: var(--text);
  letter-spacing: -0.02em;
}

.logo-text strong {
  color: var(--primary);
  font-weight: 700;
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.nav-link {
  text-decoration: none;
  color: #52525b;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: var(--primary);
  background: rgba(99, 102, 241, 0.07);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-ghost {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #52525b;
  padding: 0.45rem 1rem;
  border-radius: 9px;
  border: 1.5px solid transparent;
  transition: all 0.15s ease;
}

.btn-ghost:hover {
  color: var(--primary);
  border-color: rgba(99, 102, 241, 0.3);
}

.btn-primary {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--primary);
  padding: 0.45rem 1.1rem;
  border-radius: 9px;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  background: #4f46e5;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}

/* Burger */
.burger {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text);
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
}

/* Mobile menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem 1rem;
  background: var(--bg);
  border-top: 1px solid rgba(0,0,0,0.06);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-menu.open {
  display: flex;
  max-height: 400px;
}

.mobile-link {
  text-decoration: none;
  color: #52525b;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.mobile-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .nav-links, .nav-actions {
    display: none;
  }

  .burger {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>