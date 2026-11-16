# Idées pour une future refonte du design

Notes issues de la review avec **taste-skill 2.5.1** (novembre 2026, branche
`design/taste-review`). Le premier jet ne corrigeait que les défauts et ajoutait
deux touches (entrée du haut de page, schéma du chiffrement) ; tout ce qui suit
demande une vraie décision de design et attend la refonte.

À garder pendant la refonte : l'accent violet de la marque (#7F6CFF), le thème
sombre, l'outil d'envoi comme sujet du premier écran.

## Visuels

- **Carte « Souveraineté »** : la grande carte de la section Garanties est
  surtout vide (icône en haut, texte en bas). Lui donner un vrai visuel : la
  France mise en avant, « Hébergé en France » en grand, ou une photo des
  serveurs / de l'hébergement si on en a.
- **« Comment ça marche »** : montrer le vrai produit plutôt que des icônes.
  Par exemple un extrait réel de l'interface à chaque étape (la zone de dépôt,
  le lien généré avec sa clé après le `#`, l'écran de téléchargement).
- **Sections sans visuel** : le contrôleur signale que l'accueil, « Comment ça
  marche », « Garanties » et la FAQ sont du texte seul. La refonte peut donner à
  chaque section un élément visuel tiré du produit (interface, schéma), jamais
  de photo d'illustration générique.
- **Schéma du chiffrement** (carte Sécurité, ajouté dans le premier jet) : le
  réutiliser ou l'agrandir, il porte le message principal du produit (le
  serveur stocke sans pouvoir lire).

## Mise en page

- **Vide du haut de page** sur grand écran : environ 40 % de la section
  d'accueil est vide. Le premier jet plafonne la hauteur à 760 px ; pour aller
  plus loin, accepter que la section suivante dépasse en bas du premier écran,
  ou agrandir l'outil et le titre.
- **Largeur du contenu** : 1 136 px de contenu (marges de 152 px à 1440 px).
  Le skill recommande des marges de 64 à 120 px, donc un contenu plus large
  (vers 1 200 à 1 312 px). Changer `--container-page` dans `src/style.css`
  (en-tête, contenu et pied de page suivent).
- **Rythme des sections** : le skill vise une section par écran (1 ou 2 écrans
  de haut à 1440 × 900, sans le titre de la suivante qui dépasse). À arbitrer :
  pour un outil, garder un enchaînement plus compact peut rester préférable.
- **Pied de page** : environ un quart de la page sur téléphone. Le resserrer
  (colonnes regroupées, liens sur deux colonnes).

## Animations

- **Un « moment » par page** : le skill propose une animation marquante dans une
  section (pas seulement l'entrée du haut de page), par exemple le trajet du
  fichier chiffré qui se déroule quand on arrive sur « Comment ça marche ».
  Toujours désactivée si l'utilisateur réduit les animations.
- **Micro-interactions au survol** : cartes qui se soulèvent de 2 px, boutons
  qui s'enfoncent au clic, soulignés qui se dessinent.

## Détails relevés, non bloquants

- **Bouton « Télécharger »** (page de téléchargement) : le libellé est décalé de
  26 px par rapport au centre (icône + texte).
- **Bouton du menu mobile** : un fond (#18181f) qu'aucun autre bouton n'utilise.
  Aligner sur le style des autres boutons.
- **Fonds** : le premier jet n'en garde qu'un pour les sections ; la carte
  principale teintée de violet reste la seule exception, à confirmer.
- **Pages légales** : quelques éléments décalés de 12 px par rapport à la marge
  (titres, listes de définitions).
- **Iframe de statut** (pied de page) : ne respecte pas « réduire les
  animations ». Elle vient de `status.silvertransfert.fr` : à régler côté service
  de statut, ou ne l'afficher qu'au survol.

## Règles du skill à ne pas suivre ici

- Interdiction du violet : c'est la marque.
- Photos partout, un bouton d'action dans chaque section : pensés pour des sites
  vitrines, ça affaiblirait l'outil.

## Refaire le contrôle

Avec le front (`bun run dev`) et l'API qui tournent en local :

```bash
node <skill>/scripts/consistency.mjs http://localhost:5173/ --widths 1440,1024,820,768,390 \
  --profile .taste-skill/chrome-check --page software \
  --category "transfert de fichiers chiffré" --primary "Envoyer des fichiers"
```

`<skill>` : `~/.claude/plugins/cache/taste-skill/taste-skill/<version>/skills/taste-skill`.
Les fausses alertes connues : « hero-enter » (le contrôleur ne reconnaît que son
marqueur `data-enter`), la numérotation des pages légales prise pour un tic
d'écriture, le focus des liens e-mail des pages légales (mesuré pendant le
défilement doux).
