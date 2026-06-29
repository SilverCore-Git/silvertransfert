<script setup lang="ts">
import Navbar from '../../components/layouts/Navbar.vue';
</script>

<template>
  <div class="legal-container">
    <div class="site-container">
      <div class="bg-grid" aria-hidden="true"></div>
      
      <Navbar />

      <section class="legal-section">
        <div class="center">
          <h1 class="wordmark">Silver<span>Transfert</span></h1>
          <p class="tagline">Mentions Légales</p>
          
          <div class="legal-content">
            <h2>Mentions Légales</h2>
            <p>Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004, dites « Loi pour la confiance dans l'économie numérique », il est porté à la connaissance des utilisateurs les présentes mentions légales.</p>
            
            <h3>1. Éditeur du site</h3>
            <p>Le présent site est édité par...</p>
            
            <h3>2. Hébergement</h3>
            <p>Le site est hébergé par...</p>
            
            <h3>3. Directeur de la publication</h3>
            <p>Le directeur de la publication est...</p>
            
            <h3>4. Contact</h3>
            <p>Pour toute question concernant ce service, vous pouvez nous contacter à...</p>
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

/* Section animations */
.legal-section-item {
  opacity: 0;
  transform: translateY(20px);
}

.legal-section-item:nth-child(1) { animation: fadeInUp 0.6s ease-out 0.2s both; }
.legal-section-item:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.3s both; }
.legal-section-item:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.4s both; }
.legal-section-item:nth-child(4) { animation: fadeInUp 0.6s ease-out 0.5s both; }
.legal-section-item:nth-child(5) { animation: fadeInUp 0.6s ease-out 0.6s both; }

.legal-content p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #bbb8d8;
  margin-bottom: 1rem;
}
</style>
