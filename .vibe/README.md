# Dossier `.vibe/` - Documentation Mistral

> **Point d'entrée** : [AGENTS.md](./AGENTS.md) ✅

Ce dossier contient toute la documentation nécessaire pour les futures sessions Mistral travaillant sur le projet **Silvertransfert**.

## 📚 Fichiers disponibles

| Fichier | Description | À lire |
|--------|-------------|--------|
| [AGENTS.md](./AGENTS.md) | **Point d'entrée** - Instructions générales pour les agents | ✅ Toujours |
| [SESSION_CONTEXT.md](./SESSION_CONTEXT.md) | Contexte technique, technologies, règles de base | ✅ À chaque session |
| [LONG_TERM_MEMORY.md](./LONG_TERM_MEMORY.md) | Mémoire collective du projet (à mettre à jour) | ✅ Avant/après chaque session |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Normes de codage TypeScript/Vue/Tailwind | ✅ Pendant le codage |
| [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) | Directives de sécurité complètes | ✅ Avant chaque commit |
| [WORKFLOW.md](./WORKFLOW.md) | Processus de travail et décomposition des tâches | ✅ Pour organiser le travail |
| [GIT_RULES.md](./GIT_RULES.md) | Règles Git spécifiques (pas de push) | ✅ Pour la gestion des commits |

---

## 🚀 Pour commencer

1. **Lire [AGENTS.md](./AGENTS.md)** → Comprendre la structure
2. **Lire [SESSION_CONTEXT.md](./SESSION_CONTEXT.md)** → Connaître le projet
3. **Lire [LONG_TERM_MEMORY.md](./LONG_TERM_MEMORY.md)** → Voir l'historique

---

## 📋 Règles principales à retenir

### Technologie
- Vue 3 + Composition API (`<script setup>`)
- TypeScript (typage strict, **PAS de `any`**)
- Tailwind CSS v4 (privilégier les classes utilitaires)
- Vite 7+

### Sécurité
- **NE JAMAIS** utiliser `v-html`
- **TOUJOURS** valider les inputs utilisateur
- **NE JAMAIS** commiter de données sensibles

### Git
- **FAIRE** des commits locaux après chaque sous-tâche
- **NE JAMAIS** pusher (`git push` est **INTERDIT**)
- Messages de commit clairs et atomiques

---

## 🔄 Mise à jour

À la fin de chaque session, **mettre à jour [LONG_TERM_MEMORY.md](./LONG_TERM_MEMORY.md)** avec :
- Date et objectif de la session
- Tâches réalisées
- Fichiers modifiés/créés
- Problèmes rencontrés et solutions
- Décisions techniques
- Hash du commit

---

## 📊 Statistiques

- **7 fichiers** de documentation
- **~90 000 mots** de contenu
- **Couverture complète** : Tech, Sécurité, Workflow, Git

---

## 🎯 Objectif

Assurer que chaque session Mistral travaillant sur Silvertransfert :
- ✅ Comprenne rapidement le projet
- ✅ Suive les bonnes pratiques
- ✅ Produise du code sécurisé et maintenable
- ✅ Documente son travail
- ✅ Collabore efficacement avec les autres sessions

---

**Bon travail !** 🚀
