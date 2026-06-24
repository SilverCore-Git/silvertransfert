<script setup lang="ts">
</script>

<template>
  <div class="legal-container">
    <div class="site-container">
      <div class="bg-grid" aria-hidden="true"></div>
      
      <nav class="top-nav">
        <a href="/#accueil" class="nav-btn">Accueil</a>
        <a href="/#presentation" class="nav-btn">Présentation</a>
        <a href="/#faq" class="nav-btn">FAQ</a>
      </nav>

      <section class="legal-section">
        <div class="center">
          <h1 class="wordmark">Silver<span>Transfer</span></h1>
          <p class="tagline">Politique de Confidentialité</p>
          
          <div class="legal-content">
            <div class="last-updated">
              <i class="bi bi-calendar-check"></i>
              Dernière mise à jour : Juin 2026
            </div>
            
            <h2>Politique de Confidentialité</h2>
            <p class="intro">
              Chez <strong>Silvertransfert</strong>, nous prenons votre vie privée au sérieux. 
              Cette politique de confidentialité explique comment nous traitons vos données. 
              <strong>Nous ne pouvons pas accéder à vos fichiers, et nous n’en sommes pas responsables.</strong>
            </p>

            <section class="legal-section-item">
              <h3><i class="bi bi-person-check"></i> 1. Identité du Responsable de Traitement</h3>
              <p>
                Le service <strong>Silvertransfert</strong> est édité par :
              </p>
              <ul class="info-list">
                <li><strong>Organisation :</strong> Silvercore</li>
                <li><strong>Localisation :</strong> Lyon, France</li>
                <li><strong>Responsable de la publication :</strong> Félix Cornudet</li>
                <li><strong>Contact :</strong> <a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-shield-check"></i> 2. Déresponsabilisation Totale sur le Contenu</h3>
              <div class="warning-box">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <p>
                  <strong>Silvercore et Silvertransfert ne peuvent en AUCUN CAS être tenus responsables du contenu des fichiers transférés via notre service.</strong>
                </p>
                <p>
                  En raison de notre architecture de <strong>chiffrement de bout en bout (E2EE)</strong> :
                </p>
                <ul class="warning-list">
                  <li>Nous <strong>ne pouvons pas voir</strong> le contenu des fichiers.</li>
                  <li>Nous <strong>ne pouvons pas analyser</strong> les fichiers.</li>
                  <li>Nous <strong>ne pouvons pas vérifier</strong> la légalité du contenu.</li>
                  <li>Nous <strong>ne stockons pas</strong> les clés de déchiffrement.</li>
                </ul>
                <p>
                  <strong>L'utilisateur est le SEUL responsable :</strong>
                </p>
                <ul class="warning-list">
                  <li>Du contenu qu'il transfère.</li>
                  <li>De la sécurité du lien de téléchargement.</li>
                  <li>Du mot de passe intégré dans l'URL.</li>
                  <li>Des personnes avec lesquelles il partage ce lien.</li>
                </ul>
                <p>
                  Vous reconnaissez et acceptez que Silvercore ne puisse être tenu pour responsable de toute utilisation abusive, illégale ou préjudiciable du service, y compris mais sans s'y limiter, la violation de droits d'auteur, la diffusion de contenus illicites ou toute autre activité interdite par la loi.
                </p>
              </div>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-file-earmark-lock"></i> 3. Données Personnelles Collectées</h3>
              <p>
                Nous collectons <strong>uniquement les données strictement nécessaires</strong> au fonctionnement du service. 
                Aucune donnée n'est utilisée à des fins commerciales, analytiques ou publicitaires.
              </p>
              
              <h4>a) Données fournies par l'utilisateur</h4>
              <ul class="info-list">
                <li><strong>Fichiers transférés</strong> : Les fichiers que vous téléversez via notre service. <strong>Ces fichiers sont chiffrés de bout en bout (E2EE)</strong> et ne sont jamais accessibles en clair par nos équipes ou quiconque ne possède pas le mot de passe de déchiffrement.</li>
              </ul>
              
              <h4>b) Données techniques collectées automatiquement</h4>
              <ul class="info-list">
                <li><strong>Adresses IP</strong> : Pour assurer la sécurité et la stabilité du service.</li>
                <li><strong>Informations du navigateur</strong> (user-agent, type de navigateur) : Pour optimiser la compatibilité du service.</li>
                <li><strong>Logs d'accès</strong> : Date et heure des connexions, uniquement pour le bon fonctionnement technique.</li>
              </ul>
              
              <p class="highlight">
                <i class="bi bi-cookie"></i>
                <strong>Nous n'utilisons aucun cookie, aucun tracker, aucune technologie de profiling.</strong>
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-key-fill"></i> 4. Chiffrement de Bout en Bout (E2EE)</h3>
              
              <h4>Comment cela fonctionne ?</h4>
              <ol class="process-list">
                <li><strong>Vous téléversez un fichier</strong> : Il arrive non chiffré sur nos serveurs.</li>
                <li><strong>Chiffrement immédiat</strong> : Notre serveur génère une clé de chiffrement unique dérivée du mot de passe que vous recevez dans l'URL de téléchargement.</li>
                <li><strong>Le fichier en clair est supprimé</strong> : Une fois chiffré, le fichier original est irréversiblement supprimé de nos serveurs.</li>
                <li><strong>Seul le fichier chiffré reste stocké</strong> : <strong>Aucune personne</strong>, y compris nos équipes, ne peut accéder à son contenu sans le mot de passe.</li>
                <li><strong>Le mot de passe</strong> : Il est intégré à l'URL de téléchargement (ex: <code>https://silvertransfert.fr/t/abc123#motdepasse</code>). <strong>Nous ne le stockons pas</strong> et ne pouvons pas le récupérer.</li>
              </ol>
              
              <p>
                <strong>Algorithme de chiffrement :</strong> AES-256-CBC – Standard industriel de chiffrement symétrique, considéré comme inviolable avec les ressources actuelles.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-globe"></i> 5. Stockage et Localisation des Données</h3>
              <p>
                ✅ <strong>100% hébergé en France</strong>
              </p>
              <ul class="info-list">
                <li>Vos fichiers chiffrés sont stockés <strong>uniquement sur nos serveurs situés en France</strong>.</li>
                <li><strong>Triple réplication</strong> : Chaque fichier est dupliqué sur <strong>3 supports physiques distincts</strong> pour garantir la disponibilité.</li>
                <li><strong>Aucun transfert hors de l'Union Européenne</strong> : Vos données ne quittent jamais le territoire français.</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-clock"></i> 6. Durée de Conservation</h3>
              <div class="table-container">
                <table class="conservation-table">
                  <thead>
                    <tr>
                      <th>Type de données</th>
                      <th>Durée</th>
                      <th>Suppression</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Fichiers chiffrés</strong></td>
                      <td>30 jours</td>
                      <td><strong>Irréversible</strong> après expiration</td>
                    </tr>
                    <tr>
                      <td><strong>Logs techniques</strong></td>
                      <td>30 jours</td>
                      <td>Suppression automatique</td>
                    </tr>
                    <tr>
                      <td><strong>Données de connexion</strong></td>
                      <td>30 jours</td>
                      <td>Suppression automatique</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="note">
                <i class="bi bi-info-circle"></i>
                Pourquoi 30 jours ? C'est un compromis entre praticité (laisser le temps aux destinataires de télécharger) et sécurité (limiter la fenêtre d'exposition).
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-check2-square"></i> 7. Finalités du Traitement</h3>
              <p>
                Vos données sont <strong>uniquement traitées</strong> pour :
              </p>
              <ul class="check-list">
                <li><i class="bi bi-check-circle-fill"></i> <strong>Fournir le service de transfert de fichiers</strong> (chiffrement, stockage, mise à disposition)</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Assurer la sécurité et la stabilité du service</strong> (détection d'abus, maintenance)</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Respecter nos obligations légales</strong> (si requête judiciaire valide)</li>
              </ul>
              <p>
                ❌ <strong>Nous ne faisons PAS :</strong>
              </p>
              <ul class="cross-list">
                <li><i class="bi bi-x-circle-fill"></i> Analyse du contenu des fichiers</li>
                <li><i class="bi bi-x-circle-fill"></i> Profilage utilisateur</li>
                <li><i class="bi bi-x-circle-fill"></i> Partage avec des tiers (sauf obligation légale)</li>
                <li><i class="bi bi-x-circle-fill"></i> Utilisation à des fins marketing</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-people"></i> 8. Partage des Données</h3>
              <p>
                <strong>Vos données restent exclusives à Silvercore.</strong>
              </p>
              <ul class="info-list">
                <li><strong>Aucun tiers</strong> n'a accès à vos fichiers ou métadonnées.</li>
                <li><strong>Pas de sous-traitance</strong> pour le stockage ou le chiffrement.</li>
                <li><strong>Exception unique</strong> : En cas de <strong>réquisition judiciaire</strong> (mandat valide), nous pourrions être contraints de communiquer des logs techniques (mais <strong>jamais les fichiers chiffrés</strong>, car nous n'avons pas les clés de déchiffrement).</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-shield-lock"></i> 9. Sécurité des Données</h3>
              <p>
                Nous mettons en œuvre <strong>toutes les mesures techniques et organisationnelles</strong> pour protéger vos données :
              </p>
              <ul class="info-list">
                <li><strong>Chiffrement E2EE</strong> : Vos fichiers sont indéchiffrables sans le mot de passe.</li>
                <li><strong>Hébergement en France</strong> : Soumis au droit français et à la RGPD.</li>
                <li><strong>Accès restreint</strong> : Seuls les membres autorisés de Silvercore peuvent accéder aux infrastructures (et <strong>pas aux fichiers chiffrés</strong>).</li>
                <li><strong>Suppression irréversible</strong> : Les fichiers sont <strong>détruits définitivement</strong> après 30 jours (pas de corbeille, pas de récupération possible).</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-person-check"></i> 10. Vos Droits (RGPD)</h3>
              <p>
                Conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong>, vous disposez des droits suivants :
              </p>
              <div class="table-container">
                <table class="rights-table">
                  <thead>
                    <tr>
                      <th>Droit</th>
                      <th>Description</th>
                      <th>Comment l'exercer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Droit d'accès</strong></td>
                      <td>Savoir quelles données nous détenons sur vous</td>
                      <td><a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></td>
                    </tr>
                    <tr>
                      <td><strong>Droit de rectification</strong></td>
                      <td>Corriger des données inexactes</td>
                      <td><a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></td>
                    </tr>
                    <tr>
                      <td><strong>Droit à l'effacement</strong></td>
                      <td>Supprimer vos données</td>
                      <td>Les fichiers sont déjà supprimés automatiquement après 30 jours. Pour une suppression anticipée, contactez-nous.</td>
                    </tr>
                    <tr>
                      <td><strong>Droit à la portabilité</strong></td>
                      <td>Récupérer vos données dans un format structuré</td>
                      <td><a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></td>
                    </tr>
                    <tr>
                      <td><strong>Droit d'opposition</strong></td>
                      <td>Vous opposer au traitement de vos données</td>
                      <td><a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="note">
                <i class="bi bi-calendar"></i>
                <strong>Délai de réponse :</strong> Nous nous engageons à répondre à toute demande <strong>sous 1 mois</strong> (comme exigé par le RGPD).
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-cookie"></i> 11. Cookies et Technologies de Suivi</h3>
              <p class="highlight">
                <i class="bi bi-ban"></i>
                <strong>Nous n'utilisons AUCUN cookie, AUCUN tracker, AUCUNE technologie de suivi.</strong>
              </p>
              <ul class="cross-list">
                <li><i class="bi bi-x-circle-fill"></i> Pas de cookies analytiques (Google Analytics, etc.)</li>
                <li><i class="bi bi-x-circle-fill"></i> Pas de cookies publicitaires</li>
                <li><i class="bi bi-x-circle-fill"></i> Pas de localStorage ou sessionStorage à des fins de tracking</li>
                <li><i class="bi bi-x-circle-fill"></i> Pas de balises tierces (Facebook Pixel, etc.)</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-file-earmark-check"></i> 12. Acceptation de la Politique de Confidentialité</h3>
              <p>
                En utilisant <strong>Silvertransfert</strong>, vous <strong>acceptez automatiquement</strong> cette politique de confidentialité. 
                <strong>Aucune création de compte n'est requise</strong> : l'acceptation est implicite lors de l'utilisation du service.
              </p>
              <p>
                En utilisant ce service, vous <strong>reconnaissez avoir lu, compris et accepté</strong> cette politique dans son intégralité, y compris la section 2 concernant notre déresponsabilisation totale sur le contenu des fichiers transférés.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-envelope"></i> 13. Contact et Réclamations</h3>
              <p>
                Pour toute question concernant cette politique ou vos données personnelles :
              </p>
              <ul class="info-list">
                <li><i class="bi bi-geo-alt"></i> <strong>Organisation :</strong> Silvercore, Lyon, France</li>
                <li><i class="bi bi-envelope"></i> <strong>Email :</strong> <a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></li>
              </ul>
              <p>
                <strong>Droit de déposer une réclamation auprès de la CNIL :</strong><br>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la 
                <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> :
              </p>
              <p>
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="link">www.cnil.fr</a>
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-calendar"></i> 14. Mises à Jour</h3>
              <p>
                Cette politique peut être mise à jour pour refléter des changements dans nos pratiques ou des évolutions légales. 
                <strong>La date de la dernière mise à jour sera toujours indiquée en haut de cette page.</strong>
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>
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
  max-width: 900px;
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

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #a09cb4;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.legal-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.legal-section-item {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
}

/* Staggered animations for sections */
.legal-section-item:nth-child(1) { animation: fadeInUp 0.6s ease-out 0.2s both; }
.legal-section-item:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.3s both; }
.legal-section-item:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.4s both; }
.legal-section-item:nth-child(4) { animation: fadeInUp 0.6s ease-out 0.5s both; }
.legal-section-item:nth-child(5) { animation: fadeInUp 0.6s ease-out 0.6s both; }
.legal-section-item:nth-child(6) { animation: fadeInUp 0.6s ease-out 0.7s both; }
.legal-section-item:nth-child(7) { animation: fadeInUp 0.6s ease-out 0.8s both; }
.legal-section-item:nth-child(8) { animation: fadeInUp 0.6s ease-out 0.9s both; }
.legal-section-item:nth-child(9) { animation: fadeInUp 0.6s ease-out 1s both; }
.legal-section-item:nth-child(10) { animation: fadeInUp 0.6s ease-out 1.1s both; }
.legal-section-item:nth-child(11) { animation: fadeInUp 0.6s ease-out 1.2s both; }
.legal-section-item:nth-child(12) { animation: fadeInUp 0.6s ease-out 1.3s both; }

.legal-section-item h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: #a78bfa;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legal-section-item h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e0f0;
  margin: 1.5rem 0 0.75rem;
}

.legal-section-item p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #bbb8d8;
  margin-bottom: 1rem;
}

.intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #e2e0f0;
  margin-bottom: 2.5rem;
}

.highlight {
  background: rgba(99, 86, 229, 0.1);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #6356e5;
  margin: 1rem 0;
}

.highlight i {
  color: #a78bfa;
}

/* Lists */
.info-list {
  list-style: none;
  padding-left: 0;
  margin: 0.75rem 0;
}
.info-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #bbb8d8;
  line-height: 1.6;
}
.info-list li:before {
  content: "•";
  color: #6356e5;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.check-list {
  list-style: none;
  padding-left: 0;
  margin: 0.75rem 0 1.5rem;
}
.check-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #bbb8d8;
  line-height: 1.6;
}
.check-list i {
  color: #22c55e;
  margin-top: 0.1rem;
}

.cross-list {
  list-style: none;
  padding-left: 0;
  margin: 0.75rem 0 1.5rem;
}
.cross-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #bbb8d8;
  line-height: 1.6;
}
.cross-list i {
  color: #ef4444;
  margin-top: 0.1rem;
}

.process-list {
  list-style: decimal;
  padding-left: 2rem;
  margin: 1rem 0 1.5rem;
}
.process-list li {
  padding: 0.5rem 0;
  color: #bbb8d8;
  line-height: 1.6;
}

/* Warning Box */
.warning-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
}
.warning-box > i {
  color: #ef4444;
  font-size: 1.5rem;
  display: block;
  margin-bottom: 1rem;
}
.warning-box p {
  color: #fca5a5;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1rem;
}
.warning-list {
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}
.warning-list li {
  padding: 0.35rem 0;
  position: relative;
  color: #fca5a5;
  line-height: 1.6;
}
.warning-list li:before {
  content: "•";
  color: #ef4444;
  font-weight: bold;
  position: absolute;
  left: -1.5rem;
}

/* Tables */
.table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}
.conservation-table,
.rights-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
}
.conservation-table th,
.conservation-table td,
.rights-table th,
.rights-table td {
  padding: 0.85rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.conservation-table th,
.rights-table th {
  background: rgba(255, 255, 255, 0.03);
  color: #a09cb4;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.conservation-table td,
.rights-table td {
  color: #bbb8d8;
  font-size: 0.9rem;
}
.conservation-table tr:last-child td,
.rights-table tr:last-child td {
  border-bottom: none;
}
.conservation-table strong,
.rights-table strong {
  color: #e2e0f0;
}

/* Links */
.link {
  color: #6356e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.link:hover {
  color: #a78bfa;
  text-decoration: underline;
}

/* Code */
code {
  background: rgba(99, 86, 229, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #a78bfa;
}

/* Note */
.note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #635c87;
  margin-top: 1rem;
  font-style: italic;
}
.note i {
  color: #a09cb4;
}

@media (max-width: 768px) {
  .legal-content {
    padding: 2rem 1.5rem;
  }
  
  .process-list {
    padding-left: 1.25rem;
  }
  
  .warning-list {
    padding-left: 1rem;
  }
  .warning-list li:before {
    left: -1rem;
  }
}
</style>
