<script setup lang="ts">
import Footer from './components/layouts/footer.vue';
import Navbar from './components/layouts/Navbar.vue';
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    
    <main class="app-main">
      <router-view />
    </main>
    
    <Footer />
    
    <!-- Fond de gradient contenu dans l'app -->
    <div class="app-background"></div>
  </div>
</template>

<style>
/* Reset CSS global pour éviter les débordements */
html, body {
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 100%;
  overflow-x: hidden;
  width: 100%;
}

.app-main {
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%;
  overflow-x: hidden;
}

.app-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg);
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 2rem 2rem;
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

@media (min-width: 640px) {
  .app-background {
    background-size: 3rem 3rem;
  }
}

@media (min-width: 768px) {
  .app-background {
    background-size: 4rem 4rem;
  }
}

@media (min-width: 1024px) {
  .app-background {
    background-size: 5rem 5rem;
  }
}
</style>