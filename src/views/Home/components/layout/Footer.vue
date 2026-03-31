<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- Top row -->
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <a href="/" class="logo">
            <div class="logo-icon">
              <i class="bi bi-send-fill"></i>
            </div>
            <span class="logo-text">swift<strong>drop</strong></span>
          </a>
          <p class="footer-tagline">
            Transférez vos fichiers en toute simplicité,<br>sans limite de taille.
          </p>
          <div class="footer-badges">
            <span class="badge"><i class="bi bi-shield-lock-fill"></i> Chiffrement E2E</span>
            <span class="badge"><i class="bi bi-lightning-fill"></i> Ultra rapide</span>
          </div>
        </div>

        <!-- Links -->
        <div class="footer-links-grid">
          <div class="footer-col">
            <h4>Produit</h4>
            <a href="#">Fonctionnalités</a>
            <a href="#">Tarifs</a>
            <a href="#">API & SDK</a>
            <a href="#">Plugin Outlook</a>
          </div>
          <div class="footer-col">
            <h4>Ressources</h4>
            <a href="#">Documentation</a>
            <a href="#">Centre d'aide</a>
            <a href="#">Guides</a>
            <a href="#">Status</a>
          </div>
          <div class="footer-col">
            <h4>Société</h4>
            <a href="#">Notre histoire</a>
            <a href="#">Blog</a>
            <a href="#">Carrières</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>

      <!-- Bottom row -->
      <div class="footer-bottom">
        <p class="copyright">© 2025 SwiftDrop · Fait avec <i class="bi bi-heart-fill" style="color: #f43f5e; font-size: 0.75rem;"></i> en France</p>
        <div class="legal-links">
          <a href="#">Confidentialité</a>
          <a href="#">CGU</a>
          <a href="#">Cookies</a>
          <a href="#">Mentions légales</a>
        </div>
        <div class="social-links">
          <a href="#" class="social-btn" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
          <a href="#" class="social-btn" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
          <a href="#" class="social-btn" aria-label="GitHub"><i class="bi bi-github"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f0f11;
  color: #a1a1aa;
  margin-top: 5rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 1.5rem;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: 3rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

/* Brand */
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  margin-bottom: 1rem;
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
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.logo-text {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  color: white;
  letter-spacing: -0.02em;
}

.logo-text strong {
  color: var(--primary);
}

.footer-tagline {
  font-size: 0.875rem;
  line-height: 1.65;
  color: #71717a;
  margin-bottom: 1.25rem;
}

.footer-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  color: #a1a1aa;
  border: 1px solid rgba(255,255,255,0.08);
}

/* Links grid */
.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-col h4 {
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #e4e4e7;
  margin-bottom: 0.25rem;
}

.footer-col a {
  text-decoration: none;
  font-size: 0.875rem;
  color: #71717a;
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: #e4e4e7;
}

/* Bottom */
.footer-bottom {
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.copyright {
  font-size: 0.8rem;
  color: #52525b;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.legal-links {
  display: flex;
  gap: 1.25rem;
}

.legal-links a {
  text-decoration: none;
  font-size: 0.8rem;
  color: #52525b;
  transition: color 0.15s ease;
}

.legal-links a:hover {
  color: #a1a1aa;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.social-btn:hover {
  color: white;
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>