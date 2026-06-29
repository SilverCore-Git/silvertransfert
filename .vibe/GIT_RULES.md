# Silvertransfert - Règles Git

> **Règle Absolue** : NE JAMAIS PUSHER - Les commits restent locaux.
> **Version** : 1.0
> **Dernière mise à jour** : 2026-06-29

## Table des matières
1. [Philosophie](#philosophie)
2. [Workflow Git](#workflow-git)
3. [Nommage des branches](#nommage-des-branches)
4. [Messages de commit](#messages-de-commit)
5. [Structure des commits](#structure-des-commits)
6. [Gestion des conflits](#gestion-des-conflits)
7. [Revue de code locale](#revue-de-code-locale)
8. [Checklist avant commit](#checklist-avant-commit)
9. [Commandes Git utiles](#commandes-git-utiles)

---

## Philosophie

### Pourquoi ces règles ?

1. **Pas de push** : Éviter toute modification accidentelle du dépôt distant
2. **Commits locaux** : Permettre l'historique et la traçabilité du travail
3. **Branches claires** : Faciliter la compréhension du travail en cours
4. **Messages descriptifs** : Documenter l'historique du projet

### Workflow global

```
┌─────────────────────────────────────────────────────┐
│                 DÉPÔT LOCAL                             │
│                                                         │
│  main (production)                                      │
│      │                                                 │
│      ▼                                                 │
│  develop (intégration)                                 │
│      │                                                 │
│      ├── feat/nouvelle-feature                         │
│      │     ├── commit 1: "feat: créer la structure"    │
│      │     ├── commit 2: "feat: implémenter X"        │
│      │     └── commit 3: "feat: ajouter les tests"    │
│      │                                                 │
│      ├── fix/bug-critique                               │
│      │     └── commit 1: "fix: corriger le bug Y"      │
│      │                                                 │
│      └── refactor/optimisation                         │
│            └── commit 1: "refactor: simplifier Z"      │
│                                                         │
└─────────────────────────────────────────────────────┘
                     NE JAMAIS PUSH
```

---

## Workflow Git

### Initialisation du travail

```bash
# 1. Se placer dans le répertoire du projet
cd /home/moi/Documents/GitHub/silvertransfert

# 2. Vérifier l'état actuel
git status

# 3. Créer une nouvelle branche à partir de main ou develop
git checkout main
git pull origin main  # Si accès distant (mais pas de push)
git checkout -b feat/ma-nouvelle-fonctionnalite
```

### Pendant le développement

```bash
# 1. Après chaque sous-tâche complète :
# Vérifier les changements
git status

git add .  # ou git add fichier1 fichier2

# 2. Commiter avec un message clair
git commit -m "feat: ajouter le composant DropZone"

# 3. Continuer le développement...
# ... (autres modifications)

git add .
git commit -m "feat: implémenter la validation des fichiers"

# 4. Vérifier l'historique
git log --oneline -10
```

### Si changement de branche

```bash
# 1. Commiter ou stash les changements actuels
git stash  # Si changements non commités

# 2. Changer de branche
git checkout autre-branche

# 3. Revenir à la branche originale
git checkout ma-branche
git stash pop  # Récupérer les changements
```

### Mise à jour de la branche parente

```bash
# 1. Stocker les changements actuels
git stash

# 2. Aller sur la branche parente (main ou develop)
git checkout develop

# 3. Mettre à jour (si accès distant)
git pull origin develop

# 4. Revenir sur sa branche
git checkout ma-branche

# 5. Rebaser les commits locaux sur develop
git rebase develop

# 6. Résoudre les conflits si nécessaire
# (voir section "Gestion des conflits")

# 7. Récupérer les changements stashés
git stash pop
```

---

## Nommage des branches

### Format

```
<préfixe>/<description-en-kebab-case>
```

### Préfixes

| Type | Préfixe | Description | Exemple |
|------|---------|-------------|---------|
| Feature | `feat/` | Nouvelle fonctionnalité | `feat/drag-drop-upload` |
| Bugfix | `fix/` | Correction de bug | `fix/file-validation-error` |
| Refactor | `refactor/` | Refactorisation | `refactor/upload-logic` |
| Documentation | `docs/` | Documentation | `docs/update-readme` |
| Performance | `perf/` | Optimisation performance | `perf/optimize-rendering` |
| Security | `security/` | Correction de vulnérabilité | `security/xss-protection` |
| Chore | `chore/` | Tâches diverses | `chore/update-deps` |
| Test | `test/` | Ajout de tests | `test/upload-component` |
| Hotfix | `hotfix/` | Correction urgente | `hotfix/critical-bug` |

### Règles de nommage

1. **Court mais descriptif** : Assez long pour comprendre, assez court pour être pratique
2. **En anglais** : Préférer l'anglais pour la cohérence
3. **En minuscules** : Toujours en minuscules
4. **Séparateurs** : Utiliser `-` (kebab-case)
5. **Éviter** : Les numéros de ticket, les noms de développeurs

### Exemples

```
✅ BON
feat/add-file-drag-and-drop
fix/validation-regex-bug
refactor/home-component-structure
docs/add-contribution-guide

❌ MAUVAIS
feature123  # Trop vague
fix_bug  # mauvais séparateur
MyNewFeature  # mauvais format
feat/addDragAndDrop  # camelCase au lieu de kebab-case
```

---

## Messages de commit

### Format

```
<type>(<scope>): <sujet>

<corps>

<pied>
```

### Types de commit

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat: ajouter upload multiple` |
| `fix` | Correction de bug | `fix: corriger validation email` |
| `refactor` | Refactorisation | `refactor: extraire logique upload` |
| `docs` | Documentation | `docs: mettre à jour README` |
| `style` | Changements de style | `style: corriger margin button` |
| `perf` | Optimisation performance | `perf: réduire taille bundle` |
| `test` | Ajout/modification de tests | `test: ajouter tests DropZone` |
| `chore` | Maintenance | `chore: mettre à jour dépendances` |
| `revert` | Annulation de commit | `revert: annuler feat/upload` |

### Règles

1. **Sujet en minuscules** : Pas de majuscule au début
2. **Pas de point final** : Ne pas terminer par un point
3. **50 caractères max** : pour le sujet (ligne 1)
4. **72 caractères max** : par ligne pour le corps
5. **Imperatif** : "ajouter" au lieu de "ajouté" ou "ajoute"
6. **Clair et précis** : Décrire CE QUI A ÉTÉ FAIT, pas ce qui sera fait

### Exemples

```
✅ BON
feat: ajouter le composant DropZone

- Créer DropZone.vue avec gestion drag & drop
- Ajouter validation des fichiers
- Intégrer avec Home.vue

fix: corriger le bug de validation des fichiers

Le regex de validation n'acceptait pas les fichiers avec points
dans le nom (ex: "mon.fichier.pdf")

refactor: simplifier la logique d'upload

- Extraire la validation dans une fonction séparée
- Utiliser des types plus précis pour les erreurs

❌ MAUVAIS
Ajouté le composant DropZone  # Majuscule + "é"
feat: add DropZone component  # Anglais mélangé avec français
fix bug  # Trop vague
corrige validation  # Pas de type, pas clair
```

### Corps du commit

- **Expliquer le POURQUOI** : Pas le QUOI (le code montre le quoi)
- **Donner le contexte** : Lien avec la tâche, le bug, la feature
- **Mentionner les changements** : Si plusieurs choses sont faites
- **Lister les fichiers modifiés** : Si pertinent

### Pied du commit

- **Référencer les issues** : Si système de ticketing utilisé
- **Mentionner les collaborateurs** : Si travail d'équipe
- **Notes supplémentaires** : Limites, TODO, etc.

---

## Structure des commits

### Commits atomiques

**Un commit = Une idée/logique unique**

```bash
# ✅ BON - Commits atomiques
# Commit 1 : Ajouter la structure du composant
git commit -m "feat: créer la structure de DropZone.vue"

# Commit 2 : Implémenter la logique
git commit -m "feat: implémenter drag & drop dans DropZone"

# Commit 3 : Ajouter les styles
git commit -m "feat: styliser DropZone avec Tailwind"

# ❌ MAUVAIS - Commit trop large
git commit -m "feat: ajouter DropZone avec tout"
```

### Squash des commits

Si vous avez fait beaucoup de petits commits pendant le développement :

```bash
# Rebase interactif pour squash
# Garder les 5 derniers commits
GIT_SEQUENCE_EDITOR="nano" git rebase -i HEAD~5

# Dans l'éditeur, remplacer "pick" par "squash" ou "s" pour les commits à fusionner
# Exemple :
# pick abc1234 feat: créer structure
# squash def5678 feat: ajouter validation
# squash ghi9012 feat: ajouter styles
# pick jkl3456 fix: corriger bug

# Sauvegarder et quitter
# Git va fusionner les commits
```

---

## Gestion des conflits

### Quand les conflits surviennent ?

- Lors d'un `git pull` avec des changements locaux non commités
- Lors d'un `git merge` ou `git rebase`
- Lors de l'application de patches

### Résolution d'un conflit

```bash
# 1. Git vous informera qu'il y a des conflits
#    Exemple : "CONFLICT (content): Merge conflict in src/Home.vue"

# 2. Vérifier les fichiers en conflit
git status  # Montre "Unmerged paths"

# 3. Ouvrir les fichiers en conflit dans votre éditeur
#    Ils contiendront des marqueurs comme :
#    <<<<<<< HEAD
#    Votre changement
#    =======
#    Le changement distant
#    >>>>>>> commit-hash

# 4. Résoudre manuellement en gardant le bon code
#    Supprimer les marqueurs <<<<<<<, =======, >>>>>>>

# 5. Marquer le fichier comme résolu
git add src/Home.vue

# 6. Continuer le merge/rebase
git rebase --continue  # ou git merge --continue

# 7. Si vous voulez annuler
git rebase --abort  # ou git merge --abort
```

### Outils pour résoudre les conflits

- **VSCode** : Intégration Git avec visualisation des conflits
- **git mergetool** : Outil en ligne de commande
- **meld** : Outil graphique
- **kdiff3** : Outil graphique

---

## Revue de code locale

### Processus

1. **Faire un commit** avec vos changements
2. **Vérifier les changements** avant de considérer comme terminé
3. **Relire le code** avec un esprit critique
4. **Vérifier les tests** passent
5. **Vérifier le build** fonctionne

### Commandes utiles

```bash
# Voir les changements du dernier commit
git show HEAD

# Voir les changements non commités
git diff

# Voir l'historique complet d'un fichier
git log -p src/views/Home/Home.vue

# Voir qui a modifié quoi dans un fichier
git blame src/views/Home/Home.vue
```

---

## Checklist avant commit

### Code
- [ ] Le code compile sans erreur TypeScript
- [ ] Tous les tests passent
- [ ] Pas de `any` dans le typage
- [ ] Pas de `v-html` ou code dangereux
- [ ] Les inputs sont validés
- [ ] Les erreurs sont gérées

### Sécurité
- [ ] Voir `SECURITY_GUIDELINES.md`
- [ ] Pas de données sensibles commitées
- [ ] Pas de tokens, mots de passe, clés API dans le code

### Git
- [ ] Les changements sont bien ceux que je veux commiter (`git diff --cached`)
- [ ] Le message de commit est clair et descriptif
- [ ] Le commit est atomique (une seule logique)
- [ ] Les fichiers non pertinents ne sont pas inclus

### Documentation
- [ ] Les décisions techniques sont documentées dans `LONG_TERM_MEMORY.md`
- [ ] Le code est commenté là où c'est nécessaire

### Vérifications finales
- [ ] `npm run build` fonctionne
- [ ] `npm run test` passe (si tests existants)
- [ ] Le code fonctionne en local

---

## Commandes Git utiles

### Commandes de base

```bash
# Voir l'état
 git status

# Voir les changements
git diff
git diff --cached  # changements staged

# Ajouter des fichiers
git add .
git add fichier1 fichier2
git add -A  # tout ajouter

# Commiter
git commit -m "message"
git commit -a -m "message"  # stage + commit

# Voir l'historique
git log
git log --oneline  # version compacte
git log --graph --oneline --decorate  # avec graphe

# Voir les branches
git branch
git branch -a  # toutes les branches (locales + distantes)
```

### Commandes avancées

```bash
# Stash (sauvegarder temporairement les changements)
git stash
git stash list
git stash pop  # récupérer et supprimer
git stash apply  # récupérer sans supprimer

# Rebase
git rebase develop  # rebase sur develop
git rebase -i HEAD~5  # rebase interactif

# Reset (attention !)
git reset --soft HEAD~1  # annuler commit, garder changements
git reset --hard HEAD~1  # annuler commit et changements

# Cherry-pick (appliquer un commit spécifique)
git cherry-pick abc1234

# Voir les différences entre branches
git diff main...develop

# Voir qui a modifié une ligne spécifique
git blame src/views/Home/Home.vue
```

### Alias utiles

Ajoutez ces alias à votre `~/.bashrc` ou `~/.zshrc` :

```bash
# Alias Git
alias gs="git status"
alias ga="git add"
alias gaa="git add -A"
alias gc="git commit -m"
alias gco="git checkout"
alias gb="git branch"
alias gl="git log --oneline --graph --decorate"
alias gd="git diff"
alias gdc="git diff --cached"
alias gst="git stash"
alias gsp="git stash pop"

# Après modification
source ~/.bashrc  # ou source ~/.zshrc
```

---

## Configuration Git locale

### Configuration recommandée

```bash
# Configurer votre nom et email (même si pas de push)
git config --local user.name "Votre Nom"
git config --local user.email "votre@email.com"

# Configurer l'éditeur par défaut
git config --local core.editor "code --wait"  # VSCode

# Configurer les fins de ligne (LF pour Linux/Mac, CRLF pour Windows)
git config --local core.autocrlf input  # Linux/Mac
git config --local core.autocrlf true   # Windows

# Activer le coloration
git config --local color.ui true

# Voir la configuration
git config --list --local
```

### Fichier .gitconfig local

Créez un fichier `.git/config` dans votre projet :

```ini
[core]
    editor = code --wait
    autocrlf = input
[user]
    name = Votre Nom
    email = votre@email.com
[color]
    ui = true
[alias]
    gs = status
    ga = add
    gc = commit -m
    gco = checkout
    gb = branch
    gl = log --oneline --graph --decorate
```

---

## Erreurs courantes et solutions

### Problème : "Please commit your changes or stash them before you switch branches"

**Solution** :
```bash
# Option 1 : Commiter les changements
git add .
git commit -m "wip: travail en cours"

# Option 2 : Stash les changements
git stash
git checkout autre-branche
git stash pop  # plus tard

# Option 3 : Annuler les changements (ATTENTION)
git reset --hard  # Perd tous les changements non commités
```

### Problème : Conflits de merge

**Solution** : Voir section "Gestion des conflits"

### Problème : Commit faites sur la mauvaise branche

**Solution** :
```bash
# 1. Stash les changements non commités (si applicable)
git stash

# 2. Aller sur la bonne branche
git checkout bonne-branche

# 3. Créer une nouvelle branche à partir de la mauvaise
git branch nouvelle-branche

# 4. Revenir sur la mauvaise branche
git checkout mauvaise-branche

# 5. Reset à l'état avant les commits
git reset --hard HEAD~N  # N = nombre de commits à annuler

# 6. Aller sur la bonne branche
git checkout bonne-branche

# 7. Appliquer les commits (cherry-pick)
git cherry-pick <hash1> <hash2> ...

# 8. Supprimer la mauvaise branche
git branch -D mauvaise-branche
```

### Problème : Fichier suivi par Git mais qui ne devrait pas l'être

**Solution** :
```bash
# Retirer le fichier de Git (mais le garder dans le système de fichiers)
git rm --cached fichier-a-ignorer

# Ajouter au .gitignore
 echo "fichier-a-ignorer" >> .gitignore

# Commiter
git add .gitignore
git commit -m "chore: ajouter fichier à .gitignore"
```

---

## Bonnes pratiques supplémentaires

1. **Commiter souvent** : Après chaque sous-tâche complète
2. **Écrire de bons messages** : Pour comprendre l'historique
3. **Faire des commits atomiques** : Un commit = une idée
4. **Vérifier avant de commiter** : `git diff --cached`
5. **Ne pas commiter** :
   - Du code qui ne compile pas
   - Des tests qui échouent
   - Des données sensibles
   - Des fichiers générés (node_modules, dist, etc.)
   - Des IDE configs (/.idea, .vscode)

---

## Résumé

| Action | Commande | Fréquence |
|--------|----------|-----------|
| Voir l'état | `git status` | Très souvent |
| Ajouter des fichiers | `git add .` | Après modifications |
| Commiter | `git commit -m "message"` | Après chaque sous-tâche |
| Voir l'historique | `git log --oneline` | Régulièrement |
| Changer de branche | `git checkout branche` | Quand nécessaire |
| Créer une branche | `git checkout -b feat/nom` | Pour chaque feature |
| Mettre à jour | `git pull origin main` | Avant de commencer |
| **PUSHER** | **❌ INTERDIT** | **JAMAIS** |

---

**Rappel le plus important** : **NE JAMAIS PUSHER** - Tous les commits doivent rester locaux.
