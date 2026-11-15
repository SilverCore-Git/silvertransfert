<script setup lang="ts">
import Footer from './components/layouts/footer.vue';
import Navbar from './components/layouts/Navbar.vue';
</script>

<template>
  <div class="app-wrapper">
    <!-- Premier arrêt de Tab : passer directement au contenu -->
    <a href="#contenu" class="skip-link">Aller au contenu</a>
    <Navbar />
    
    <main id="contenu" class="app-main" tabindex="-1">
      <router-view />
    </main>
    
    <Footer />
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
  min-height: 100dvh;
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

</style>