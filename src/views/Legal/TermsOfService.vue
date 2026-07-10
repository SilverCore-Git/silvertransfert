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
          <p class="tagline">Conditions Générales d'Utilisation</p>
          
          <div class="legal-content">
            <div class="last-updated">
              <i class="bi bi-calendar-check"></i>
              Dernière mise à jour : Juin 2026
            </div>
            
            <h2>Conditions Générales d'Utilisation</h2>
            <p class="intro">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") constituent le contrat légal entre 
              <strong>Silvercore</strong>, éditeur du service <strong>Silvertransfert</strong>, et 
              <strong>l'Utilisateur</strong> (ci-après "vous" ou "votre"). En utilisant le service, vous acceptez 
              pleinement et sans réserve les présentes CGU ainsi que notre 
              <router-link to="/politique-de-confidentialite" class="link">Politique de Confidentialité</router-link>.
            </p>

            <section class="legal-section-item">
              <h3><i class="bi bi-file-earmark-text"></i> Préambule</h3>
              <p>
                Silvertransfert est un service de transfert de fichiers sécurisé, conçu pour offrir une alternative 
                française et respectueuse de la vie privée aux solutions existantes. Grâce à notre architecture de 
                <strong>chiffrement de bout en bout (E2EE)</strong>, nous garantissons que vos fichiers restent 
                <strong>confidentiels et inaccessibles</strong> à quiconque, y compris nos propres équipes.
              </p>
              <p>
                Les présentes CGU ont pour objet de définir les règles d'utilisation du service et de rappeler 
                <strong>la responsabilité exclusive de l'Utilisateur</strong> concernant le contenu des fichiers transférés.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-dictionary"></i> Définitions</h3>
              <p>
                Dans les présentes CGU, les termes suivants auront la signification indiquée ci-dessous :
              </p>
              
              <dl class="definitions-list">
                <div class="definition-item">
                  <dt><span class="def-term">Silvercore</span></dt>
                  <dd>Organisation basée à Lyon, France, éditrice du service Silvertransfert.</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Service</span></dt>
                  <dd>Le service de transfert de fichiers accessible via le site <a href="https://silvertransfert.fr" class="link">silvertransfert.fr</a> et ses sous-domaines, permettant aux Utilisateurs de téléverser, stocker temporairement et partager des fichiers de manière sécurisée grâce à un chiffrement de bout en bout (E2EE).</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Utilisateur</span></dt>
                  <dd>Toute personne physique ou morale accédant au Service, qu'elle soit simple visiteur, ou effectuant un transfert de fichiers.</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Fichiers</span></dt>
                  <dd>Tout contenu numérique téléversé par l'Utilisateur via le Service, sans restriction de type (documents, images, vidéos, archives, etc.).</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Lien de Téléchargement</span></dt>
                  <dd>URL unique générée par le Service, permettant d'accéder à un transfert de fichiers. Ce lien intègre un identifiant de transfert et un mot de passe de déchiffrement.</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Mot de Passe</span></dt>
                  <dd>Clé de déchiffrement unique, intégrée au Lien de Téléchargement sous forme de fragment d'URL (après le symbole #), permettant de déchiffrer et télécharger les Fichiers. Ce mot de passe <strong>n'est pas stocké</strong> par Silvercore et ne peut pas être récupéré.</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Transfert</span></dt>
                  <dd>Opération consistant à téléverser un ou plusieurs Fichiers via le Service, générant un Lien de Téléchargement unique.</dd>
                </div>
                
                <div class="definition-item">
                  <dt><span class="def-term">Chiffrement E2EE (End-to-End Encryption)</span></dt>
                  <dd>Méthode de chiffrement où les Fichiers sont chiffrés avant stockage et ne peuvent être déchiffrés que par les détenteurs du Mot de Passe. Silvercore <strong>n'a pas accès</strong> aux clés de déchiffrement.</dd>
                </div>
              </dl>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-info-circle"></i> 1. Objet du Service</h3>
              <p>
                Le Service permet aux Utilisateurs de :
              </p>
              <ul class="check-list">
                <li><i class="bi bi-check-circle-fill"></i> <strong>Transférer des fichiers</strong> de manière sécurisée grâce au chiffrement E2EE (AES-256-CBC).</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Stocker temporairement</strong> ces fichiers sur nos serveurs situés en France.</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Partager un Lien de Téléchargement</strong> avec les destinataires de leur choix.</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Bénéficier d'une conservation</strong> des Fichiers pendant <strong>30 jours</strong> à compter de leur téléversement.</li>
              </ul>
              
              <p>
                <strong>Caractéristiques du Service :</strong>
              </p>
              <ul class="info-list">
                <li><strong>Gratuité</strong> : Le Service est actuellement gratuit. Silvercore se réserve le droit d'introduire des offres payantes ("Premium") à l'avenir, sans préavis.</li>
                <li><strong>Limite de taille</strong> : <strong>10 Go par Transfert</strong>.</li>
                <li><strong>Hébergement</strong> : 100% en France, sur nos propres infrastructures.</li>
                <li><strong>Sécurité</strong> : Chiffrement E2EE, triple réplication des Fichiers.</li>
                <li><strong>Publicité</strong> : Le Service peut afficher des publicités lors du téléversement et du téléchargement des Fichiers.</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-box-arrow-in-right"></i> 2. Accès au Service</h3>
              <p>
                L'accès au Service est <strong>ouvert à toute personne</strong>, sans restriction géographique, sous réserve :
              </p>
              <ul class="info-list">
                <li>D'une connexion internet ;</li>
                <li>D'un navigateur web compatible ;</li>
                <li><strong>De l'acceptation des présentes CGU</strong> ;</li>
                <li><strong>De l'acceptation de notre Politique de Confidentialité</strong>.</li>
              </ul>
              
              <p>
                <strong>Aucune création de compte n'est requise.</strong> L'utilisation du Service est possible de manière anonyme. 
                L'acceptation des CGU et de la Politique de Confidentialité est <strong>implicite</strong> lors de l'utilisation du Service 
                et <strong>renouvelée à chaque Transfert</strong>.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-person-check"></i> 3. Obligations de l'Utilisateur</h3>
              <p>
                L'Utilisateur s'engage à :
              </p>
              <ul class="check-list">
                <li><i class="bi bi-check-circle-fill"></i> <strong>Respecter les lois et règlements en vigueur</strong>, notamment le droit français et européen.</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Utiliser le Service conformément à son objet</strong> tel que défini à l'Article 1.</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Protéger son Lien de Téléchargement et son Mot de Passe</strong>, qui sont sa seule responsabilité.</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Ne pas transférer de Contenu Interdit</strong> (voir Article 4).</li>
                <li><i class="bi bi-check-circle-fill"></i> <strong>Respecter les limites techniques</strong> du Service (voir Article 4.2).</li>
              </ul>
              
              <div class="warning-box">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <p>
                  <strong>L'Utilisateur est le SEUL responsable du contenu des Fichiers qu'il transfère via le Service.</strong>
                </p>
                <p>
                  Silvercore <strong>ne contrôle pas</strong>, <strong>ne vérifie pas</strong> et <strong>ne peut pas accéder</strong> 
                  au contenu des Fichiers en raison du chiffrement E2EE. Par conséquent, 
                  <strong>Silvercore ne peut en aucun cas être tenu responsable</strong> du contenu des Fichiers transférés, 
                  de leur légalité, ou de leur utilisation par les destinataires.
                </p>
                <p>
                  <strong>L'Utilisateur garantit</strong> qu'il dispose de tous les droits nécessaires pour transférer les Fichiers 
                  et que leur contenu ne viole aucun droit de tiers.
                </p>
              </div>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-slash-circle"></i> 4. Interdictions</h3>
              
              <h4>4.1 Contenu Interdit</h4>
              <p>
                Il est strictement interdit de transférer via le Service tout Fichier contenant :
              </p>
              <ul class="cross-list">
                <li><i class="bi bi-x-circle-fill"></i> Du contenu <strong>illégal</strong> selon les lois françaises et européennes (drogues, armes, contenu pédopornographique, etc.) ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Du contenu <strong>viant les droits d'auteur</strong> ou la propriété intellectuelle ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Du contenu <strong>haineux, discriminatoire, raciste ou xénophobe</strong> ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Du contenu <strong>violent, choquant ou pornographique</strong> non autorisé ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Des <strong>malwares, virus, cheats, logiciels malveillants</strong> ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Des <strong>données personnelles de tiers</strong> sans leur consentement exprès ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Tout autre contenu <strong>illicite ou contraire à l'ordre public</strong>.</li>
              </ul>
              
              <h4>4.2 Comportements Interdits</h4>
              <p>
                Il est strictement interdit :
              </p>
              <ul class="cross-list">
                <li><i class="bi bi-x-circle-fill"></i> D'effectuer des <strong>attaques par déni de service (DDoS)</strong> ou toute autre action visant à perturber le Service ;</li>
                <li><i class="bi bi-x-circle-fill"></i> De <strong>dépasser 100 Transfers par jour</strong> depuis une même adresse IP ;</li>
                <li><i class="bi bi-x-circle-fill"></i> D'utiliser des <strong>méthodes automatisées</strong> (bots, scripts, scraping) sans autorisation écrite de Silvercore ;</li>
                <li><i class="bi bi-x-circle-fill"></i> De <strong>tenter d'accéder</strong> à des zones restreintes du Service ou à des Transfers ne vous appartenant pas ;</li>
                <li><i class="bi bi-x-circle-fill"></i> De <strong>contourner les mesures de sécurité</strong> du Service ;</li>
                <li><i class="bi bi-x-circle-fill"></i> De <strong>utiliser le Service à des fins frauduleuses</strong> (phishing, arnaque, etc.) ;</li>
                <li><i class="bi bi-x-circle-fill"></i> De <strong>falsifier des informations</strong> de quelque manière que ce soit.</li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-shield-exclamation"></i> 5. Responsabilité</h3>
              
              <h4>5.1 Responsabilité de l'Utilisateur</h4>
              <p>
                <strong>L'Utilisateur est seul et entièrement responsable</strong> :
              </p>
              <ul class="warning-list">
                <li>Du <strong>contenu des Fichiers</strong> qu'il transfère via le Service ;</li>
                <li>De la <strong>légalité des Fichiers</strong> transférés ;</li>
                <li>De la <strong>sécurité du Lien de Téléchargement et du Mot de Passe</strong> ;</li>
                <li>De l'<strong>utilisation du Service</strong> par lui-même ou par les destinataires du Lien de Téléchargement ;</li>
                <li>De tout <strong>préjudice</strong> causé à lui-même ou à des tiers du fait de l'utilisation du Service.</li>
              </ul>
              
              <p>
                L'Utilisateur <strong>indemnise</strong> Silvercore de toute réclamation, dommage, perte ou frais 
                (y compris honoraires d'avocat) résultant de la violation des présentes CGU ou de l'utilisation du Service 
                par l'Utilisateur ou par des tiers ayant accès à ses Lien de Téléchargement.
              </p>
              
              <h4>5.2 Déresponsabilisation de Silvercore</h4>
              <div class="warning-box">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <p>
                  <strong>Silvercore décline toute responsabilité concernant :</strong>
                </p>
                <ul class="warning-list">
                  <li>Le <strong>contenu des Fichiers</strong> transférés par les Utilisateurs ;</li>
                  <li>L'<strong>utilisation illégale ou malveillante</strong> du Service par les Utilisateurs ;</li>
                  <li>Les <strong>dommages indirects</strong> (perte de données, perte de profits, interruption d'activité, etc.) ;</li>
                  <li>Les <strong>fichiers supprimés</strong> après expiration du délai de 30 jours ;</li>
                  <li>Les <strong>erreurs de transmission</strong> ou de stockage des Fichiers ;</li>
                  <li>Toute <strong>utilisation non conforme</strong> aux présentes CGU.</li>
                </ul>
                <p>
                  En raison du <strong>chiffrement E2EE</strong>, Silvercore <strong>ne peut pas connaître</strong> 
                  le contenu des Fichiers transférés. Par conséquent, <strong>Silvercore ne peut être tenu pour responsable</strong> 
                  de leur nature, légalité ou conformité aux lois en vigueur.
                </p>
                <p>
                  <strong>L'Utilisateur reconnaît et accepte expressément</strong> que Silvercore ne peut en aucun cas 
                  être tenu responsable des fichiers illégaux ou malveillants transférés via le Service.
                </p>
              </div>
              
              <h4>5.3 Limitation de Responsabilité</h4>
              <p>
                Dans la mesure maximale permise par la loi applicable, <strong>la responsabilité totale et cumulative de Silvercore</strong> 
                pour toute réclamation liée à l'utilisation du Service <strong>ne dépassera pas le montant payé par l'Utilisateur</strong> 
                pour le Service au cours des douze (12) derniers mois. Pour les Utilisateurs du Service gratuit, 
                <strong>la responsabilité de Silvercore est limitée à 1 (un) euro (€1)</strong>.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-c-brown"></i> 6. Propriété Intellectuelle</h3>
              <p>
                Tous les éléments du Service, y compris mais sans s'y limiter :
              </p>
              <ul class="info-list">
                <li>Les marques <strong>Silvertransfert</strong> et <strong>Silvercore</strong> ;</li>
                <li>Les noms de domaine associés ;</li>
                <li>Le code source, les designs, les interfaces ;</li>
                <li>Les textes, graphismes, logos, icônes ;</li>
                <li>La structure et l'organisation du Service ;</li>
              </ul>
              <p>
                sont la <strong>propriété exclusive de Silvercore</strong> ou de ses ayants droit et sont protégés par les lois françaises 
                et internationales sur la propriété intellectuelle.
              </p>
              <p>
                <strong>Les Fichiers transférés par l'Utilisateur restent sa propriété exclusive.</strong> 
                Silvercore n'acquiert aucun droit de propriété intellectuelle sur les Fichiers de l'Utilisateur.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-pencil-square"></i> 7. Modification des CGU</h3>
              <p>
                Silvercore se réserve le droit de <strong>modifier les présentes CGU à tout moment</strong>, notamment pour :
              </p>
              <ul class="info-list">
                <li>S'adapter aux évolutions légales ou réglementaires ;</li>
                <li>Ajouter de nouvelles fonctionnalités au Service ;</li>
                <li>Améliorer la sécurité ou les performances du Service ;</li>
                <li>Corriger des erreurs ou des imprécisions ;</li>
                <li>Introduire des offres payantes (Premium).</li>
              </ul>
              <p>
                Les modifications entreront en vigueur <strong>immédiatement après leur publication sur le site</strong>. 
                <strong>À chaque Transfert</strong>, l'Utilisateur déclare avoir pris connaissance de la version en vigueur des CGU.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-calendar-range"></i> 8. Durée et Résiliation</h3>
              
              <h4>8.1 Durée</h4>
              <p>
                Le Service est disponible <strong>sans limite de durée</strong>. Les Fichiers transférés sont conservés 
                <strong>pendant 30 jours</strong> à compter de leur téléversement, puis supprimés de manière <strong>irréversible</strong>.
              </p>
              
              <h4>8.2 Suppression Anticipée</h4>
              <p>
                <strong>Les Fichiers ne peuvent pas être supprimés manuellement avant les 30 jours</strong> via le Service. 
                Cependant, l'Utilisateur peut <strong>demander la suppression anticipée</strong> d'un Transfert en contactant Silvercore 
                à l'adresse <a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a>.
              </p>
              <p>
                Silvercore s'engage à traiter toute demande de suppression <strong>dans les meilleurs délais</strong>.
              </p>
              
              <h4>8.3 Résiliation pour Violation des CGU</h4>
              <p>
                Silvercore se réserve le droit de <strong>supprimer immédiatement et sans préavis</strong> tout Transfert 
                ou d'<strong>interdire l'accès au Service</strong> à tout Utilisateur en cas de :
              </p>
              <ul class="cross-list">
                <li><i class="bi bi-x-circle-fill"></i> Violation des présentes CGU ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Transfert de Contenu Interdit ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Comportement frauduleux ou malveillant ;</li>
                <li><i class="bi bi-x-circle-fill"></i> Activité suspecte ou abusives.</li>
              </ul>
              <p>
                <strong>Aucun remboursement</strong> ne sera effectué en cas de résiliation pour violation des CGU.
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-envelope-exclamation"></i> 9. Contact et Support</h3>
              <p>
                Pour toute question concernant les présentes CGU ou le Service :
              </p>
              <ul class="info-list">
                <li><i class="bi bi-envelope"></i> <strong>Email :</strong> <a href="mailto:contact@silvercore.fr" class="link">contact@silvercore.fr</a></li>
                <li><i class="bi bi-discord"></i> <strong>Support Discord :</strong> <a href="https://taap.it/silvercore.discord" target="_blank" rel="noopener noreferrer" class="link">taap.it/silvercore.discord</a></li>
              </ul>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-gavel"></i> 10. Loi Applicable et Juridiction Compétente</h3>
              <p>
                Les présentes CGU sont régies par le <strong>droit français</strong>.
              </p>
              <p>
                Tout litige relatif à l'interprétation ou à l'exécution des présentes CGU sera soumis à la 
                <strong>compétence exclusive des tribunaux de Lyon</strong>, nonobstant pluralité de défendeurs ou appel en garantie.
              </p>
              <p>
                <strong>La langue française est la seule version faisant foi.</strong>
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-file-earmark-check"></i> 11. Acceptation des CGU</h3>
              <p>
                <strong>L'utilisation du Service implique l'acceptation pleine, entière et sans réserve des présentes CGU.</strong>
              </p>
              <p>
                <strong>À chaque Transfert</strong>, l'Utilisateur déclare avoir pris connaissance et accepté 
                la version en vigueur des présentes CGU ainsi que de la 
                <router-link to="/politique-de-confidentialite" class="link">Politique de Confidentialité</router-link>.
              </p>
              <p>
                <strong>Si vous n'acceptez pas les présentes CGU, vous devez cesser immédiatement toute utilisation du Service.</strong>
              </p>
            </section>

            <section class="legal-section-item">
              <h3><i class="bi bi-calendar"></i> 12. Divers</h3>
              <p>
                Si une disposition des présentes CGU était jugée nulle ou non applicable par une autorité compétente, 
                les autres dispositions resteront en vigueur.
              </p>
              <p>
                Le fait que Silvercore ne fasse pas valoir un droit résultant des présentes CGU ne constitue pas 
                une renonciation à ce droit.
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
 color: var(--color-text);
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
 color: var(--color-text);
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
 color: var(--color-text);
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
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e0f0;
  margin: 1.5rem 0 0.75rem;
}

.legal-section-item p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
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

/* Definition List */
.definitions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}
.definition-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.definition-item dt {
  font-weight: 600;
}
.def-term {
  background: rgba(99, 86, 229, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  color: #a78bfa;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
}
.definition-item dd {
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-left: 0;
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
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.cross-list i {
  color: #ef4444;
  margin-top: 0.1rem;
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

/* Links */
.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.link:hover {
  color: #a78bfa;
  text-decoration: underline;
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

@media (max-width: var(--breakpoint-md)) {
  .legal-content {
    padding: 2rem 1.5rem;
  }
  
  .definitions-list {
    gap: 0.75rem;
  }
  
  .warning-list {
    padding-left: 1rem;
  }
  .warning-list li:before {
    left: -1rem;
  }
}
</style>
