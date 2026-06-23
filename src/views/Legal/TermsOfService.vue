<script setup lang="ts">
</script>

<template>
  <div class="legal-container">
    <div class="site-container">
      <div class="bg-grid" aria-hidden="true"></div>
      
      <nav class="top-nav">
        <a href="#" class="nav-btn">Accueil</a>
        <a href="#presentation" class="nav-btn">Présentation</a>
        <a href="#faq" class="nav-btn">FAQ</a>
      </nav>

      <section class="legal-section">
        <div class="center">
          <h1 class="wordmark">Silver<span>Transfer</span></h1>
          <p class="tagline">Conditions Générales d'Utilisation</p>
          
          <div class="legal-content">
            <h2>Conditions Générales d'Utilisation</h2>
            <p>Ce document définit les conditions dans lesquelles vous pouvez utiliser nos services.</p>
            
            <h3>Article 1 - Définitions</h3>
            <p>Les termes utilisés dans les présentes conditions générales d'utilisation sont définis comme suit...</p>
            
            <h3>Article 2 - Acceptation des conditions</h3>
            <p>L'utilisation de ce service implique l'acceptation pleine et entière des présentes conditions...</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.site-container {
  background: #06050a;
  color: #e2e0f0;
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  position: relative;
}

.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.top-nav {
  position: fixed; top: 1.5rem; right: 2rem; z-index: 9999;
  display: flex !important; align-items: center; gap: 0.75rem;
  opacity: 1 !important; visibility: visible !important;
  pointer-events: auto !important;
}
.nav-btn {
  background: rgba(10, 8, 20, 0.4); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a09cb4; padding: 0.55rem 1.35rem; border-radius: 100px; text-decoration: none;
  font-size: 0.8rem; font-weight: 500; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
  opacity: 1 !important; visibility: visible !important;
  pointer-events: auto !important;
  backdrop-filter: blur(10px);
}
.nav-btn:hover { 
  background: rgba(99, 86, 229, 0.12); border-color: rgba(99, 86, 229, 0.4);
  color: #fff; transform: translateY(-1px);
}

.legal-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 6rem 2rem 4rem;
}

.center {
  display: flex; flex-direction: column; align-items: center;
  z-index: 1; width: 100%;
  max-width: 800px;
}

.wordmark {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  color: #fff;
  line-height: 0.9;
  margin: 0 0 1rem;
}
.wordmark span {
  background: linear-gradient(135deg, #6356e5 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  color: #fff;
  font-weight: 400;
  margin-bottom: 3rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.legal-content {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem;
  backdrop-filter: blur(20px);
}

.legal-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

.legal-content h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #a78bfa;
  margin: 2rem 0 1rem;
}

.legal-content p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #bbb8d8;
  margin-bottom: 1rem;
}
</style>
