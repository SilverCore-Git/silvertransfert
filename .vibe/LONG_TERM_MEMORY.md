# Silvertransfert - Mémoire Long Terme

> **Ce fichier est mis à jour par chaque session Mistral**
> Ajoutez vos contributions à la fin de ce fichier sous une nouvelle section datée.

---

## Historique des Sessions

### 2026-06-29 - Initialisation de la documentation Mistral

**Objectif** : Créer le dossier `.vibe/` avec toute la documentation nécessaire pour les futures sessions.

**Tâches réalisées** :
- Création du dossier `.vibe/` à la racine du projet
- Création de 8 fichiers de documentation complets :
  - `AGENTS.md` - Point d'entrée pour les agents
  - `SESSION_CONTEXT.md` - Contexte technique et règles de base
  - `LONG_TERM_MEMORY.md` - Mémoire collective (ce fichier)
  - `CODING_STANDARDS.md` - Normes de codage TypeScript/Vue/Tailwind
  - `SECURITY_GUIDELINES.md` - Directives de sécurité
  - `WORKFLOW.md` - Processus de travail
  - `GIT_RULES.md` - Règles Git spécifiques
  - `README.md` - Résumé du dossier .vibe

**Fichiers créés** :
- `.vibe/AGENTS.md`
- `.vibe/SESSION_CONTEXT.md`
- `.vibe/LONG_TERM_MEMORY.md`
- `.vibe/CODING_STANDARDS.md`
- `.vibe/SECURITY_GUIDELINES.md`
- `.vibe/WORKFLOW.md`
- `.vibe/GIT_RULES.md`
- `.vibe/README.md`

**Problèmes rencontrés** : Aucun

**Décisions techniques** :
- Structure modulaire avec des fichiers spécialisés par thème
- Documentation complète couvrant tous les aspects (tech, sécurité, workflow)
- Utilisation de templates pour faciliter la contribution future

**Tests** : Non applicable (documentation)

**Notes pour les futures sessions** :
- Lire AGENTS.md en premier pour comprendre la structure
- Toujours mettre à jour ce fichier (LONG_TERM_MEMORY.md) après chaque session
- Respecter les normes définies dans CODING_STANDARDS.md

**Commits** :
- `50fa9a0` - docs: ajouter dossier .vibe avec documentation pour les sessions Mistral
- `f9e2fbe` - docs: ajouter README.md pour le dossier .vibe

---

### 2026-06-29 - Correction UI Home.vue

**Objectif** : Modifier l'interface de la page d'accueil selon les spécifications demandées.

**Tâches réalisées** :
- Le sélecteur de complexité du chiffrement est maintenant affiché uniquement lorsque des fichiers sont téléversés mais pas encore en envoie (`files.length > 0 && !isUploading`)
- Le bouton "Envoyer" et les stats (nombre de fichiers + taille) sont maintenant placés en colonne (en dessous) au lieu d'être côte à côte

**Fichiers modifiés** :
- `src/views/Home/Home.vue` - Modification du template et des styles CSS

**Modifications techniques** :
- Ajout de `v-if="files.length > 0 && !isUploading"` autour du conteneur du sélecteur de complexité (lignes 249-288)
- Modification du style `.below-ring` pour utiliser `flex-direction: column` et centrer les éléments
- Suppression de la règle redondante dans le media query mobile

**Problèmes rencontrés** :
- Conflit potentiel avec le style responsive existant, résolu en modifiant le style par défaut

**Décisions techniques** :
- Garder le media query pour `.send-btn` sur mobile (`width:100%; justify-content:center;`)
- Utiliser un seul conteneur `.below-ring` avec un style flexible plutôt que de créer une nouvelle classe

**Tests** : À vérifier manuellement

**Commits** :
- `4e8b071` - feat: afficher selecteur complexité uniquement avec fichiers et bouton envoyer en dessous

---

### Template pour nouvelle session

```markdown

### [DATE] - [Titre de la session]

**Objectif** : [Description de l'objectif principal]

**Tâches réalisées** :
- [ ] Tâche 1 avec détails
- [ ] Tâche 2 avec détails

**Fichiers modifiés** :
- `path/to/file1.vue` - [Description des changements]
- `path/to/file2.ts` - [Description des changements]

**Fichiers créés** :
- `path/to/newFile.vue` - [Description]

**Problèmes rencontrés** :
- Problème 1 et solution apportée
- Problème 2 et solution apportée

**Décisions techniques** :
- Décision 1 : [Pourquoi ce choix ?]
- Décision 2 : [Pourquoi ce choix ?]

**Tests** :
- Tests passés : [Liste]
- Tests à ajouter : [Liste]

**Notes pour les futures sessions** :
- [Notes importantes à retenir]

**Commit** : [Hash du commit si applicable]
```

---

## Index par fonctionnalité

### Upload de fichiers

### Téléchargement

### UI/UX

### Sécurité

### Performance

### Infrastructure

---

## Prochaines améliorations identifiées

- [ ] Amélioration 1
- [ ] Amélioration 2

---

## Décisions architecturales majeures

### 1. [Sujet]
**Décision** : [Description]
**Raison** : [Justification]
**Date** : [Date]
**Session** : [Lien vers la section]

---

## Patterns et bonnes pratiques validés

### Patterns Vue 3

### Patterns TypeScript

### Patterns Sécurité

---

## Problèmes récurrents et solutions

---

## Metriques et statistiques

---

**Note** : Ce fichier est une mémoire collective. Chaque session doit le mettre à jour pour assurer la continuité du projet.
