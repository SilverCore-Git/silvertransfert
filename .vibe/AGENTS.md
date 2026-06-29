# Silvertransfert - Instructions pour les Agents Mistral

> **Fichier Principal** : Ce fichier est le point d'entrée pour toutes les futures sessions.
> **Version** : 1.0
> **Dernière mise à jour** : 2026-06-29

---

## Sommaire

Bienvenue dans le projet **Silvertransfert** ! Ce dossier `.vibe/` contient toutes les informations nécessaires pour travailler efficacement sur ce projet.

### Fichiers Disponibles

```
.vibe/
├── AGENTS.md              # ✅ Ce fichier - Point d'entrée
├── SESSION_CONTEXT.md     # Contexte technique et règles de base
├── LONG_TERM_MEMORY.md    # Mémoire collective du projet
├── CODING_STANDARDS.md    # Normes de codage détaillées
├── SECURITY_GUIDELINES.md # Directives de sécurité
├── WORKFLOW.md            # Processus de travail
└── GIT_RULES.md           # Règles Git spécifiques
```

---

## Instructions de Base

### 1. À chaque nouvelle session

**Obligatoire** : Lire **SESSION_CONTEXT.md** en premier.

Ce fichier contient :
- La mise en situation du projet
- Les technologies utilisées (Vue 3, TypeScript, Tailwind CSS, Vite)
- L'architecture du projet
- Les règles de base à respecter
- Les checklists avant de commencer et avant de finir

### 2. Pendant le travail

- **Respecter CODING_STANDARDS.md** pour tout le code produit
- **Appliquer SECURITY_GUIDELINES.md** pour toutes les questions de sécurité
- **Suivre WORKFLOW.md** pour le processus de développement
- **Appliquer GIT_RULES.md** pour la gestion des commits

### 3. À la fin de chaque session

**Obligatoire** : Mettre à jour **LONG_TERM_MEMORY.md**

Ajoutez une nouvelle section avec :
- La date
- L'objectif de la session
- Les tâches réalisées
- Les fichiers modifiés/créés
- Les problèmes rencontrés et solutions
- Les décisions techniques
- Le hash du commit (si applicable)

---

## Ordre de Lecture Recommandé

### Pour une nouvelle session

1. **AGENTS.md** (vous êtes ici) → Comprendre la structure
2. **SESSION_CONTEXT.md** → Connaître le projet et les règles
3. **LONG_TERM_MEMORY.md** → Voir l'historique des sessions précédentes
4. **CODING_STANDARDS.md** → Normes de codage
5. **SECURITY_GUIDELINES.md** → Sécurité

### Pour une tâche spécifique

1. **WORKFLOW.md** → Processus de travail
2. **CODING_STANDARDS.md** → Comment coder
3. **GIT_RULES.md** → Comment gérer Git
4. **SECURITY_GUIDELINES.md** → Comment sécuriser

---

## Règles Absolues (À Retenir)

### 1. Technologie
- **Framework** : Vue 3 (Composition API avec `<script setup>`)
- **Langage** : TypeScript (typage strict, PAS de `any`)
- **CSS** : Tailwind CSS v4 (privilégier les classes utilitaires)
- **Build** : Vite 7+

### 2. Sécurité
- **NE JAMAIS** utiliser `v-html`
- **NE JAMAIS** faire confiance aux inputs utilisateur (toujours valider)
- **NE JAMAIS** commiter de données sensibles (tokens, mots de passe)
- **TOUJOURS** échapper les outputs

### 3. Git
- **FAIRE** des commits locaux après chaque sous-tâche
- **NE JAMAIS** pusher (`git push` est interdit)
- **TOUJOURS** utiliser des messages de commit clairs

### 4. Qualité
- **TOUJOURS** bien typer le code (TypeScript)
- **TOUJOURS** suivre les conventions de nommage
- **TOUJOURS** documenter les décisions techniques
- **TOUJOURS** tester le code (manuellement au minimum)

---

## Checklist Rapide avant de Commencer

- [ ] J'ai lu **SESSION_CONTEXT.md**
- [ ] J'ai lu **LONG_TERM_MEMORY.md** pour voir l'historique
- [ ] J'ai compris l'objectif de ma tâche
- [ ] J'ai identifié les fichiers concernés
- [ ] J'ai vérifié qu'il n'y a pas de solution existante
- [ ] J'ai une idée claire de la solution

---

## Checklist Rapide avant de Finir

- [ ] Mon code est bien typé (pas de `any`)
- [ ] J'ai suivi **CODING_STANDARDS.md**
- [ ] J'ai respecté **SECURITY_GUIDELINES.md**
- [ ] J'ai testé manuellement
- [ ] J'ai commité mes changements (sans push)
- [ ] J'ai mis à jour **LONG_TERM_MEMORY.md**

---

## Structure des Fichiers du Projet

```
silvertransfert/
├── .vibe/                    # ✅ Documentation pour les agents
│   ├── AGENTS.md            # Point d'entrée
│   ├── SESSION_CONTEXT.md   # Contexte technique
│   ├── LONG_TERM_MEMORY.md  # Mémoire long terme
│   ├── CODING_STANDARDS.md  # Normes de codage
│   ├── SECURITY_GUIDELINES.md # Sécurité
│   ├── WORKFLOW.md          # Processus
│   └── GIT_RULES.md          # Règles Git
│
├── src/
│   ├── main.ts              # Point d'entrée
│   ├── App.vue              # Composant racine
│   ├── router.ts            # Configuration router
│   ├── style.css            # Styles globaux
│   ├── env.d.ts             # Déclarations TypeScript
│   │
│   ├── components/
│   │   └── layouts/
│   │       └── footer.vue
│   │
│   ├── utils/
│   │   └── file.ts
│   │
│   └── views/
│       ├── Home/
│       │   ├── Home.vue
│       │   └── components/
│       │       └── ui/
│       │           ├── DropZone.vue
│       │           ├── FileList.vue
│       │           ├── UploadProgress.vue
│       │           ├── TransferResult.vue
│       │           └── FaqSection.vue
│       ├── Download/
│       │   └── Download.vue
│       └── Legal/
│           ├── TermsOfService.vue
│           ├── PrivacyPolicy.vue
│           └── LegalNotices.vue
│
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Fonctionnalités Principales

| Fonctionnalité | Description | Fichiers Clés |
|---------------|-------------|--------------|
| Upload de fichiers | Drag & drop ou sélection manuelle | `Home.vue`, `DropZone.vue` |
| Chiffrement | AES-256-CBC (côté backend) | API backend |
| Génération de lien | Création de liens de téléchargement | `Home.vue` |
| Progression upload | Affichage avec vitesse réseau | `UploadProgress.vue` |
| Téléchargement | Récupération des fichiers | `Download.vue` |
| Pages légales | CGU, Politique de confidentialité | `Legal/*` |

---

## Commandes Utiles

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Linter le code
npm run lint

# Vérifier le typage TypeScript
npx tsc --noEmit
```

### Git

```bash
# Voir l'état
git status

# Commiter
git add .
git commit -m "feat: description claire"

# Voir l'historique
git log --oneline -10

# Créer une branche
git checkout -b feat/ma-fonctionnalite
```

---

## Exemples de Tâches et Décomposition

### Exemple 1 : Ajouter une nouvelle page

```
Tâche : "Créer une page de contact"
├── Analyser les besoins
├── Créer le composant Contact.vue
│   ├── Définir les props
│   ├── Créer le template
│   ├── Ajouter la logique
│   └── Styliser avec Tailwind
├── Configurer la route dans router.ts
├── Ajouter un lien dans le menu
├── Tester la page
└── Mettre à jour la documentation
```

### Exemple 2 : Corriger un bug

```
Tâche : "Corriger le bug d'affichage de la progression"
├── Reproduire le bug
├── Identifier la cause
├── Corriger le code
├── Tester la correction
└── Mettre à jour LONG_TERM_MEMORY.md
```

### Exemple 3 : Refactoriser du code

```
Tâche : "Extraire la logique d'upload dans un composable"
├── Analyser le code existant
├── Créer le composable useUpload.ts
├── Migrer la logique
├── Tester le refactoring
└── Mettre à jour la documentation
```

---

## Utilisation des Sous-Agents

### Quand utiliser un sous-agent ?

- La tâche est **complexe** et peut être divisée
- Plusieurs **compétences** sont nécessaires (UI + API)
- Vous voulez **paralléliser** le travail
- La tâche nécessite de **l'exploration** approfondie

### Comment utiliser un sous-agent ?

```typescript
// Exemple : Créer une nouvelle feature complète
task({
  task: "Créer le composant ShareModal pour le partage de fichiers",
  agent: "explore",
  context: {
    requirements: "Le composant doit permettre de partager un fichier par email",
    constraints: "Respecter les normes de codage et de sécurité",
    files: ["src/views/Home/Home.vue", "src/views/Home/components/ui/DropZone.vue"],
    design: "Utiliser Tailwind CSS, style cohérent avec l'app"
  }
});
```

### Bonnes pratiques

1. **Donner des tâches atomiques** (une responsabilité)
2. **Fournir tout le contexte nécessaire**
3. **Définir des interfaces claires**
4. **Vérifier les livrables** avant intégration
5. **Documenter les dépendances** entre tâches

---

## Résolution des Problèmes Courants

### Problème : Je ne comprends pas la demande

**Solution** :
1. Relire **SESSION_CONTEXT.md**
2. Relire **LONG_TERM_MEMORY.md** pour le contexte historique
3. Analyser les fichiers mentionnés dans la demande
4. Demander des clarifications si nécessaire

### Problème : Je trouve du code qui ne respecte pas les normes

**Solution** :
1. Consulter **CODING_STANDARDS.md**
2. Si c'est du code existant, le corriger dans le cadre de la tâche
3. Si c'est urgent, créer une tâche de refactoring
4. Documenter dans **LONG_TERM_MEMORY.md**

### Problème : Je vois une vulnérabilité de sécurité

**Solution** :
1. **ARRÊTER** immédiatement le développement
2. Consulter **SECURITY_GUIDELINES.md**
3. Corriger la vulnérabilité **AVANT** de continuer
4. Documenter la correction dans **LONG_TERM_MEMORY.md**
5. Si critique, alerter immédiatement

### Problème : Je ne sais pas comment structurer mon code

**Solution** :
1. Consulter **CODING_STANDARDS.md** pour la structure des composants
2. Regarder les fichiers existants comme exemples
3. Suivre le template fourni dans **SESSION_CONTEXT.md**

---

## Ressources Externes

### Documentation Technique

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)

### Sécurité

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Vue Security Guide](https://vuejs.org/guide/best-practices/security.html)

### Outils

- [VSCode](https://code.visualstudio.com/) (recommandé)
- [Git Documentation](https://git-scm.com/doc)
- [npm](https://www.npmjs.com/)

---

## Contacts et Support

Pour toute question technique sur le projet :
- Consulter d'abord **SESSION_CONTEXT.md**
- Regarder dans **LONG_TERM_MEMORY.md**
- Analyser le code existant

---

## Résumé des Points Clés

| Aspect | Règle |
|--------|-------|
| **Framework** | Vue 3 + Composition API |
| **Langage** | TypeScript (strict, pas de `any`) |
| **CSS** | Tailwind CSS v4 (privilégier) |
| **Sécurité** | Toujours valider, jamais faire confiance |
| **Git** | Commits locaux, JAMAIS pusher |
| **Quality** | Code propre, typé, testé, documenté |
| **Process** | Suivre WORKFLOW.md |

---

## Prochaines Étapes

1. **Lire SESSION_CONTEXT.md** → Comprendre le projet
2. **Lire LONG_TERM_MEMORY.md** → Voir l'historique
3. **Analyser la tâche** → Décomposer en sous-tâches
4. **Coder** → En suivant les normes
5. **Tester** → Vérifier que tout fonctionne
6. **Commiter** → Sauvegarder localement
7. **Documenter** → Mettre à jour LONG_TERM_MEMORY.md

---

**Bon courage pour vos futures sessions sur Silvertransfert !** 🚀

*"Un code propre est un code maintenable. Un code maintenable est un code qui dure."*
