<script setup lang="ts">
</script>

<template>
  <div class="legal-container">
    <div class="site-container">
      

      <section class="legal-section">
        <div class="center">
          
          <div class="legal-content">
            <div class="last-updated">
              <i aria-hidden="true" class="bi bi-calendar-check"></i>
              Dernière mise à jour : Octobre 2026
            </div>
            
            <h1>Politique de confidentialité</h1>
            <p class="intro">
              Chez <strong>Silvertransfert</strong>, nous prenons votre vie privée au sérieux. 
              Cette politique de confidentialité explique comment nous traitons vos données. 
              <strong>Nous ne pouvons pas accéder à vos fichiers, et nous n’en sommes pas responsables.</strong>
            </p>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-person-check"></i> 1. Identité du Responsable de Traitement</h2>
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
              <h2><i aria-hidden="true" class="bi bi-shield-check"></i> 2. Déresponsabilisation Totale sur le Contenu</h2>
              <div class="warning-box">
                <i aria-hidden="true" class="bi bi-exclamation-triangle-fill"></i>
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
                  <li>De la sécurité et de la conservation du lien de téléchargement.</li>
                  <li>Du mot de passe optionnel associé au transfert.</li>
                  <li>Des personnes avec lesquelles il partage ce lien.</li>
                </ul>
                <p>
                  Vous reconnaissez et acceptez que Silvercore ne puisse être tenu pour responsable de toute utilisation abusive, illégale ou préjudiciable du service, y compris mais sans s'y limiter, la violation de droits d'auteur, la diffusion de contenus illicites ou toute autre activité interdite par la loi.
                </p>
              </div>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-file-earmark-lock"></i> 3. Données Personnelles Collectées</h2>
              <p>
                Nous collectons <strong>uniquement les données strictement nécessaires</strong> au fonctionnement, à la sécurité et à la stabilité du service. 
                Aucune donnée n'est utilisée à des fins commerciales, analytiques ou publicitaires.
              </p>
              
              <h3>a) Données fournies par l'utilisateur</h3>
              <ul class="info-list">
                <li><strong>Fichiers transférés</strong> : Les fichiers que vous téléversez via notre service. <strong>Ces fichiers sont entièrement chiffrés de bout en bout (E2EE)</strong> dans votre navigateur avant leur envoi et sont strictement inaccessibles en clair par nos équipes.</li>
              </ul>
              
              <h3>b) Données techniques collectées automatiquement</h3>
              <ul class="info-list">
                <li><strong>Adresses IP</strong> : Pour assurer la sécurité, prévenir les abus et garantir la stabilité du service.</li>
                <li><strong>Logs d'accès</strong> : Horodatage et journaux techniques des connexions et transferts, uniquement pour la maintenance technique et la détection d'incidents.</li>
              </ul>
              
              <p class="highlight">
                <i aria-hidden="true" class="bi bi-cookie"></i>
                <strong>Nous n'utilisons aucun cookie, aucun tracker, aucun User-Agent, ni aucune technologie de profiling.</strong>
              </p>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-key-fill"></i> 4. Chiffrement de Bout en Bout (E2EE) & Perte de Clé</h2>
              
              <h3>Comment cela fonctionne ?</h3>
              <ol class="process-list">
                <li><strong>Chiffrement local dans votre navigateur</strong> : Avant le moindre envoi vers nos serveurs, votre navigateur génère une clé de chiffrement unique et chiffre l'intégralité de vos fichiers. Rien ne transite en clair.</li>
                <li><strong>Stockage exclusif de données chiffrées</strong> : Nos serveurs reçoivent et conservent uniquement un bloc de données chiffré et illisible. Aucune personne, y compris l'équipe de Silvercore, ne dispose de la clé permettant de le déchiffrer.</li>
                <li><strong>La clé réside exclusivement dans l'URL</strong> : La clé de déchiffrement est intégrée dans le fragment (l'ancre <code>#</code>) de l'URL générée (ex : <code>https://www.silvertransfert.fr/t/id#key</code>). Le standard des navigateurs web garantit que la partie située après le <code>#</code> n'est <strong>jamais transmise à nos serveurs</strong>. Nous ne recevons pas la clé, ne la stockons pas et ne pouvons jamais la récupérer.</li>
                <li><strong>Option de renforcement par mot de passe</strong> : Vous pouvez ajouter un mot de passe optionnel lors de la création d'un transfert. Ce mot de passe dérive et consolide directement la clé de chiffrement côté client dans votre navigateur. Il n'est jamais transmis à nos serveurs.</li>
                <li><strong>Déchiffrement chez le destinataire</strong> : Le destinataire ouvre le lien complet contenant l'ancre <code>#</code> (et saisit le mot de passe s'il a été configuré). Le déchiffrement s'effectue entièrement en local dans son navigateur.</li>
              </ol>

              <div class="warning-box">
                <p>
                  <strong>⚠️ Avertissement en cas de perte de clé ou de mot de passe :</strong><br>
                  Puisque nous n'avons aucun moyen d'accéder à la clé située dans le fragment de l'URL ou au mot de passe, <strong>en cas de perte du lien complet ou du mot de passe, les fichiers sont définitivement et irréversiblement perdus</strong>. Silvercore est dans l'impossibilité technique absolue de les déchiffrer ou de vous les restituer.
                </p>
              </div>

              <p>
                <strong>Algorithmes :</strong> AES-256-GCM (chiffrement authentifié), PBKDF2-SHA256 / HKDF via l'API WebCrypto native des navigateurs.
              </p>
              <p>
                <strong>Ce que nos serveurs voient :</strong> La taille des données chiffrées, la date du transfert et l'adresse IP (conservées selon la durée de rétention définie ci-dessous).
              </p>
              <p>
                <strong>Transferts créés avant la mise en place de ce chiffrement :</strong> ils restent téléchargeables jusqu'à leur expiration avec l'ancien procédé, dans lequel le fichier était chiffré par nos serveurs à sa réception.
              </p>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-globe"></i> 5. Stockage et Localisation des Données</h2>
              <p>
                ✅ <strong>100% hébergé en France</strong>
              </p>
              <ul class="info-list">
                <li>Vos fichiers chiffrés sont stockés <strong>uniquement sur nos serveurs situés en France</strong>.</li>
                <li><strong>Triple réplication</strong> : Chaque fichier chiffré est dupliqué sur <strong>3 supports physiques distincts</strong> pour garantir la disponibilité.</li>
                <li><strong>Aucun transfert hors de l'Union Européenne</strong> : Vos données ne quittent jamais le territoire français.</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-clock"></i> 6. Durée de Conservation</h2>
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
                      <td><strong>Données de connexion (IP)</strong></td>
                      <td>30 jours</td>
                      <td>Suppression automatique</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="note">
                <i aria-hidden="true" class="bi bi-info-circle"></i>
                Pourquoi 30 jours ? C'est un compromis optimal entre praticité (laisser le temps aux destinataires de télécharger) et sécurité (limiter la fenêtre d'exposition).
              </p>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-check2-square"></i> 7. Finalités du Traitement</h2>
              <p>
                Vos données sont <strong>uniquement traitées</strong> pour :
              </p>
              <ul class="check-list">
                <li><i aria-hidden="true" class="bi bi-check-circle-fill"></i> <strong>Fournir le service de transfert de fichiers</strong> (stockage et mise à disposition des données chiffrées)</li>
                <li><i aria-hidden="true" class="bi bi-check-circle-fill"></i> <strong>Assurer la sécurité et la stabilité du service</strong> (détection d'abus, maintenance)</li>
                <li><i aria-hidden="true" class="bi bi-check-circle-fill"></i> <strong>Respecter nos obligations légales</strong> (si requête judiciaire valide)</li>
              </ul>
              <p>
                ❌ <strong>Nous ne faisons PAS :</strong>
              </p>
              <ul class="cross-list">
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Collecte de User-Agent ou profiling utilisateur</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Analyse ou inspection du contenu des fichiers</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Partage avec des tiers (sauf obligation légale)</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Utilisation à des fins marketing ou publicitaires</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-people"></i> 8. Partage des Données</h2>
              <p>
                <strong>Vos données restent exclusives à Silvercore.</strong>
              </p>
              <ul class="info-list">
                <li><strong>Aucun tiers</strong> n'a accès à vos fichiers ou métadonnées.</li>
                <li><strong>Pas de sous-traitance</strong> pour le stockage ou le chiffrement.</li>
                <li><strong>Exception unique</strong> : En cas de <strong>réquisition judiciaire</strong> (mandat valide), nous pourrions être contraints de communiquer des logs techniques (adresses IP), mais <strong>jamais les fichiers en clair</strong>, car nous n'avons aucun moyen d'en posséder les clés de déchiffrement.</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-shield-lock"></i> 9. Sécurité des Données</h2>
              <p>
                Nous mettons en œuvre <strong>toutes les mesures techniques et organisationnelles</strong> pour protéger vos données :
              </p>
              <ul class="info-list">
                <li><strong>Chiffrement E2EE strict</strong> : Vos fichiers sont indéchiffrables sans l'URL complète et le mot de passe optionnel.</li>
                <li><strong>Hébergement en France</strong> : Soumis au droit français et à la réglementation RGPD.</li>
                <li><strong>Accès restreint</strong> : Seuls les membres autorisés de Silvercore peuvent accéder aux infrastructures d'hébergement (et <strong>jamais au contenu en clair</strong>).</li>
                <li><strong>Suppression irréversible</strong> : Les fichiers chiffrés sont <strong>détruits définitivement</strong> après 30 jours (pas de corbeille, pas de restauration possible).</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-person-check"></i> 10. Vos Droits (RGPD)</h2>
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
                      <td>Savoir quelles données (logs IP) nous détenons sur vous</td>
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
                <i aria-hidden="true" class="bi bi-calendar"></i>
                <strong>Délai de réponse :</strong> Nous nous engageons à répondre à toute demande <strong>sous 1 mois</strong> (conformément aux exigences du RGPD).
              </p>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-cookie"></i> 11. Cookies et Technologies de Suivi</h2>
              <p class="highlight">
                <i aria-hidden="true" class="bi bi-ban"></i>
                <strong>Nous n'utilisons AUCUN cookie, AUCUN tracker, AUCUNE technologie de suivi.</strong>
              </p>
              <ul class="cross-list">
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Pas de cookies analytiques (Google Analytics, Matomo, etc.)</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Pas de cookies publicitaires</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Pas de suivi de l'User-Agent</li>
                <li><i aria-hidden="true" class="bi bi-x-circle-fill"></i> Pas de balises tierces (Facebook Pixel, etc.)</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-file-earmark-check"></i> 12. Acceptation de la Politique de Confidentialité</h2>
              <p>
                En utilisant <strong>Silvertransfert</strong>, vous <strong>acceptez automatiquement</strong> cette politique de confidentialité. 
                <strong>Aucune création de compte n'est requise</strong> : l'acceptation est implicite dès l'utilisation du service.
              </p>
              <p>
                En utilisant ce service, vous <strong>reconnaissez avoir lu, compris et accepté</strong> cette politique dans son intégralité, y compris la section 2 concernant notre déresponsabilisation totale sur le contenu des fichiers transférés et l'impossibilité de récupérer des données en cas de perte de clé.
              </p>
            </section>

            <section class="legal-section-item">
              <h2><i aria-hidden="true" class="bi bi-envelope"></i> 13. Contact et Réclamations</h2>
              <p>
                Pour toute question concernant cette politique ou vos données personnelles :
              </p>
              <ul class="info-list">
                <li><i aria-hidden="true" class="bi bi-geo-alt"></i> <strong>Organisation :</strong> Silvercore, Lyon, France</li>
                <li><i aria-hidden="true" class="bi bi-envelope"></i> <strong>Email :</strong> <a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></li>
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
              <h2><i aria-hidden="true" class="bi bi-calendar"></i> 14. Mises à Jour</h2>
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
  background: var(--color-bg);
  color: var(--color-text-soft);
}

.legal-section {
  padding: 3.5rem 1.25rem 6rem;
}

.center {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.legal-content {
  width: 100%;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.legal-content h1 {
  font-family: var(--font-sans);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.legal-section-item {
  margin-bottom: 3rem;
  scroll-margin-top: 1.5rem;
}

.legal-section-item h2 {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legal-section-item h2 i {
  color: var(--color-primary);
}

.legal-section-item h3 {
  font-family: 'Outfit', sans-serif;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-soft);
  margin: 1.5rem 0 0.75rem;
}

.legal-section-item p {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.intro {
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--color-text-soft);
  margin-bottom: 2.5rem;
}

.highlight {
  background: color-mix(in srgb, var(--color-primary-strong) 10%, transparent);
  padding: 1rem;
  border-radius: var(--radius-xl);
  border-left: 4px solid var(--color-primary-strong);
  margin: 1rem 0;
}

.highlight i {
  color: var(--color-primary-soft);
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
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.info-list li:before {
  content: "•";
  color: var(--color-primary);
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
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.check-list i {
  color: var(--color-success);
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
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.cross-list i {
  color: var(--color-danger);
  margin-top: 0.1rem;
}

.process-list {
  list-style: decimal;
  padding-left: 2rem;
  margin: 1rem 0 1.5rem;
}
.process-list li {
  padding: 0.5rem 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Warning Box */
.warning-box {
  background: color-mix(in srgb, var(--color-danger) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  margin: 1rem 0;
}
.warning-box > i {
  color: var(--color-danger);
  font-size: var(--text-xl);
  display: block;
  margin-bottom: 1rem;
}
.warning-box p {
  color: var(--color-danger-light);
  font-size: var(--text-base);
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
  color: var(--color-danger-light);
  line-height: 1.6;
}
.warning-list li:before {
  content: "•";
  color: var(--color-danger);
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
  border-radius: var(--radius-xl);
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
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.conservation-table td,
.rights-table td {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}
.conservation-table tr:last-child td,
.rights-table tr:last-child td {
  border-bottom: none;
}
.conservation-table strong,
.rights-table strong {
  color: var(--color-text-soft);
}

/* Links */
.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
@media (hover: hover) {
  .link:hover {
    color: var(--color-primary-soft);
    text-decoration: underline;
  }
}

/* Code */
code {
  background: color-mix(in srgb, var(--color-primary-strong) 15%, transparent);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-lg);
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  word-break: break-all;
  color: var(--color-primary-soft);
}

/* Note */
.note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: 1rem;
  font-style: italic;
}
.note i {
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
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