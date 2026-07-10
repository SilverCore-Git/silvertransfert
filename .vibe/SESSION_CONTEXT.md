# Silvertransfert - Contexte de Session

## Mise en situation pour chaque nouvelle session Mistral

**Projet** : Silvertransfert - Service de transfert de fichiers sécurisé

**Technologies** :

- Framework : Vue 3 (Composition API avec `<script setup>`)
- Langage : TypeScript (typage strict obligatoire)
- CSS : Tailwind CSS v4 (privilégier les classes utilitaires Tailwind)
- Build : Vite 7+
- Router : Vue Router 4
- HTTP : Axios
- Icons : Bootstrap Icons

**Architecture** :

```
src/
├── main.ts          # Point d'entrée
├── App.vue          # Composant racine
├── router.ts        # Configuration du router
├── style.css        # Styles globaux + animations
├── env.d.ts         # Déclarations TypeScript
├── utils/
│   └── file.ts      # Utilitaires (formatSize, etc.)
├── components/
│   └── layouts/
│       └── footer.vue
└── views/
    ├── Home/
    │   ├── Home.vue
    │   └── components/
    │       └── ui/    # Composants UI (DropZone, FileList, etc.)
    ├── Download/
    │   └── Download.vue
    └── Legal/
        ├── TermsOfService.vue
        ├── PrivacyPolicy.vue
        └── LegalNotices.vue
```

**Fonctionnalités principales** :

- Upload de fichiers avec chiffrement AES-256-CBC
- Génération de liens de téléchargement sécurisés
- Interface drag & drop
- Affichage de la progression d'upload avec vitesse réseau
- Paramétrage de la complexité du chiffrement (10-32 caractères)
- Acceptation des CGU obligatoire avant envoi
- Conservation des fichiers : 30 jours
- Taille max : 10Go
- Hébergement : France (souveraineté des données)

**API Backend** :

- URL : `VITE_API_URL` (défaut : `http://localhost:8080`)
- Endpoints :
  - `GET /passwd/{length}` - Génère un mot de passe sécurisé
  - `POST /upload/file` - Upload des fichiers (avec params `id` et `passwd`)

**Règles de base à respecter** :

### 1. Code TypeScript

- **Typage strict obligatoire** : TOUT doit être typé (pas de `any`)
- Utiliser les interfaces pour les objets complexes
- Préférer les types littéraux (`'loading' | 'success' | 'error'`) aux strings libres
- Utiliser `ref<T>()` et `computed<T>()` avec types explicites

### 2. Vue 3

- **Composition API uniquement** : Toujours utiliser `<script setup lang="ts">`
- Noms des composants : PascalCase (`MyComponent.vue`)
- Props : Toujours typées avec `defineProps<Type>()`
- Emits : Toujours typées avec `defineEmits<Type>()`
- Pas de `v-html` (risque XSS)
- Éviter les `ref` inutiles, préférer `computed` quand possible

### 3. Tailwind CSS

- **Privilégier Tailwind** pour le style (pas de CSS custom sauf nécessité)
- Classes utilitaires dans le template
- Pour les animations complexes, utiliser le fichier `style.css` global
- Respecter la charte couleur existante :
  - `--color-bg: #06050a` (fond sombre)
  - `--color-primary: #7F6CFF` (violet clair)
  - `--secondary: #F4F4F5` (gris clair)
  - `--accent: #10B981` (vert)

### 4. Sécurité

- **NE JAMAIS** faire confiance aux inputs utilisateur
- Sanitizer TOUT ce qui vient de l'utilisateur
- Pas de `innerHTML` ou `v-html`
- Vérifier les types des données API
- Utiliser `https://` pour toutes les URLs externes
- Ne pas stocker de données sensibles dans le localStorage

### 5. Structure des composants

```vue
<script setup lang="ts">
// 1. Imports (groupés : Vue, puis locaux, puis externes)
import { ref, computed } from "vue";
import MyComponent from "./MyComponent.vue";
import axios from "axios";

// 2. Interfaces/Types
interface MyType {
  id: string;
  name: string;
}

// 3. Constants (UPPER_CASE)
const API_URL = import.meta.env.VITE_API_URL;

// 4. Props (si composant enfant)
const props = defineProps<{
  value: MyType;
}>();

// 5. Emits (si composant enfant)
const emit = defineEmits<{
  (e: "update", value: MyType): void;
}>();

// 6. State (ref)
const count = ref<number>(0);

// 7. Computed
const doubleCount = computed(() => count.value * 2);

// 8. Methods
function increment(): void {
  count.value++;
}

// 9. Lifecycle hooks (si nécessaire)
// onMounted, onUnmounted, etc.

// 10. Watch (si nécessaire)
// watch, watchEffect
</script>

<template>
  <!-- Contenu -->
</template>

<style scoped>
/* Styles spécifiques au composant (si Tailwind ne suffit pas) */
</style>
```

### 6. Git

- **Faire des commits locaux** : Oui, toujours committer son travail
- **Ne JAMAIS pusher** : Les commits restent en local, pas de `git push`
- Messages de commit : Clairs et descriptifs
  - Format : `feat: ajouter fonctionnalité X` ou `fix: corriger bug Y`
  - En français ou anglais, mais cohérent

### 7. Sous-agents

- **Utiliser des sous-agents** quand la tâche est complexe
- Décomposer les tâches en sous-tâches logiques
- Chaque sous-agent travaille indépendamment
- Recomposer les résultats à la fin

### 8. Tests

- Créer des tests pour toute nouvelle fonctionnalité
- Vérifier que les tests existants passent
- Priorité : tests unitaires > tests d'intégration > tests E2E

---

## Checklist avant de commencer

- [ ] J'ai lu et compris ce contexte
- [ ] J'ai analysé les fichiers existants concernés par ma tâche
- [ ] Je sais quels fichiers je vais modifier/créer
- [ ] J'ai vérifié qu'il n'y a pas de code similaire existant
- [ ] Je connais les dépendances nécessaires

## Checklist avant de finir

- [ ] Mon code est bien typé (pas de `any`)
- [ ] J'ai suivi les conventions de nommage
- [ ] J'ai utilisé Tailwind CSS quand c'était possible
- [ ] Mon code est sécurisé (pas de XSS, inputs sanitizés)
- [ ] J'ai testé manuellement (si possible)
- [ ] J'ai commité mes changements (sans pusher)
- [ ] J'ai mis à jour la mémoire long terme si nécessaire

---

**Rappel** : Tu es un expert Vue 3 + TypeScript. Ton code doit être propre, maintenable et sécurisé. Prends le temps de bien faire les choses.
