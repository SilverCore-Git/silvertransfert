# Silvertransfert - Normes de Codage

> **Version** : 1.0
> **Dernière mise à jour** : 2026-06-29

## Table des matières

1. [Principe général](#principe-général)
2. [TypeScript](#typescript)
3. [Vue 3](#vue-3)
4. [Tailwind CSS](#tailwind-css)
5. [Nommage](#nommage)
6. [Organisation des fichiers](#organisation-des-fichiers)
7. [Commentaires](#commentaires)
8. [Gestion des erreurs](#gestion-des-erreurs)
9. [Performance](#performance)
10. [Accessibilité](#accessibilité)

---

## Principe général

**Règle d'or** : "Laissez le code plus propre que vous ne l'avez trouvé."

- **Lisibilité** > Astuces techniques
- **Maintenabilité** > Performance prématurée
- **Consistance** > Préferences personnelles
- **Sécurité** > Tout le reste

---

## TypeScript

### Typage strict

```typescript
// ❌ MAUVAIS - any
const data: any = fetchData();

// ❌ MAUVAIS - pas de type
const count = ref();

// ✅ BON - typage explicite
const data: UserData = await fetchData();
const count = ref<number>(0);

// ✅ BON - interface pour les objets complexes
interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}
```

### Types vs Interfaces

- **Préférer `interface`** pour les objets (étendable avec `extends`)
- **Préférer `type`** pour les unions, tuples, types littéraux

```typescript
// ✅ Interface pour les objets
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type pour les unions
type UploadStatus = "idle" | "uploading" | "success" | "error";

// ✅ Type pour les tuples
type Coordinates = [number, number];
```

### Types littéraux

```typescript
// ❌ MAUVAIS - string libre
status: string;

// ✅ BON - types littéraux
status: "idle" | "loading" | "success" | "error";
```

### Generics

```typescript
// ✅ BON - utiliser les generics pour les fonctions réutilisables
async function fetchData<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}
```

### Utility Types

```typescript
// ✅ Utiliser Partial, Pick, Omit, etc.
type PartialUser = Partial<User>;
type UserName = Pick<User, "name">;
type UserWithoutPassword = Omit<User, "password">;
```

### Éviter les castings

```typescript
// ❌ MAUVAIS - casting forcé
const user = response.data as User;

// ✅ BON - validation du type
const user: User = response.data;
// ou mieux : validation avec schema (Zod, etc.)
```

---

## Vue 3

### Structure d'un composant

```vue
<script setup lang="ts">
/* ============================================
   1. IMPORTS
   ============================================ */
// Vue
import { ref, computed, onMounted, watch } from "vue";

// Composants locaux
import ChildComponent from "./ChildComponent.vue";

// Libraries externes
import axios from "axios";

// Utils
import { formatSize } from "@/utils/file";

/* ============================================
   2. TYPES & INTERFACES
   ============================================ */
interface Props {
  value: string;
  disabled?: boolean;
}

type Emits = {
  (e: "update:value", value: string): void;
  (e: "submit"): void;
};

/* ============================================
   3. CONSTANTES
   ============================================ */
const API_URL = import.meta.env.VITE_API_URL;
const MIN_PASSWORD_LENGTH = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10Go

/* ============================================
   4. PROPS
   ============================================ */
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

/* ============================================
   5. EMITS
   ============================================ */
const emit = defineEmits<Emits>();

/* ============================================
   6. STATE (ref, reactive)
   ============================================ */
const files = ref<FileItem[]>([]);
const isUploading = ref<boolean>(false);
const uploadProgress = ref<number>(0);

/* ============================================
   7. COMPUTED
   ============================================ */
const totalSize = computed(() =>
  files.value.reduce((sum, file) => sum + file.size, 0),
);

const canUpload = computed(() => files.value.length > 0 && !isUploading.value);

/* ============================================
   8. METHODS
   ============================================ */
function addFile(file: File): void {
  // ...
}

function removeFile(id: string): void {
  files.value = files.value.filter((f) => f.id !== id);
}

async function uploadFiles(): Promise<void> {
  // ...
}

/* ============================================
   9. LIFECYCLE HOOKS
   ============================================ */
onMounted(() => {
  // Initialisation
});

onUnmounted(() => {
  // Nettoyage
});

/* ============================================
   10. WATCH
   ============================================ */
watch(
  () => files.value.length,
  (newLength) => {
    // Réaction
  },
);

watchEffect(() => {
  // Réaction automatique
});
</script>

<template>
  <!-- Template ici -->
</template>

<style scoped>
/* Styles spécifiques (si Tailwind ne suffit pas) */
</style>
```

### Bonnes pratiques Vue

#### Composition API

- **Toujours utiliser `<script setup>`**
- Éviter l'Options API
- Regrouper la logique par feature, pas par type (state, methods, etc.)

#### Props

- Toujours typées
- Utiliser `withDefaults` pour les valeurs par défaut
- Éviter les props mutables (préférer emit + update)

```typescript
// ✅ BON
const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

// ❌ MAUVAIS - pas de type
const props = defineProps({
  value: String,
  disabled: Boolean,
});
```

#### Emits

- Toujours typées
- Noms d'émits en kebab-case

```typescript
// ✅ BON
const emit = defineEmits<{
  (e: "update:value", value: string): void;
  (e: "submit"): void;
  (e: "error", error: Error): void;
}>();

// Utilisation
emit("update:value", newValue);
```

#### Ref vs Reactive

- **`ref`** : Pour les primitives (string, number, boolean) ou quand on a besoin de la réactivité dans les templates
- **`reactive`** : Pour les objets complexes

```typescript
// ✅ BON - ref pour les primitives
const count = ref<number>(0);
const isLoading = ref<boolean>(false);

// ✅ BON - reactive pour les objets
const user = reactive<User>({
  id: "",
  name: "",
  email: "",
});
```

#### Computed

- Toujours utiliser pour les valeurs dérivées
- Éviter les computed complexes dans les templates

```typescript
// ✅ BON
const fullName = computed(() => `${user.firstName} ${user.lastName}`);

// ❌ MAUVAIS - logique dans le template
<!-- <p>{{ user.firstName + ' ' + user.lastName }}</p> -->
```

#### Directives

- Préférer `:` à `v-bind:`
- Préférer `@` à `v-on:`
- Préférer `#` à `v-slot:`

```vue
<!-- ✅ BON -->
<div :class="classes" @click="handleClick">
  <slot name="header" />
</div>

<!-- ❌ MAUVAIS -->
<div v-bind:class="classes" v-on:click="handleClick">
  <slot name="header" />
</div>
```

#### v-for

- Toujours utiliser `:key` avec une valeur unique
- Éviter d'utiliser l'index comme key

```vue
<!-- ✅ BON -->
<div v-for="file in files" :key="file.id">
  {{ file.name }}
</div>

<!-- ❌ MAUVAIS - index comme key -->
<div v-for="(file, index) in files" :key="index">
  {{ file.name }}
</div>
```

#### v-if vs v-show

- **`v-if`** : Quand l'élément n'est pas souvent affiché (coût de création/destruction)
- **`v-show`** : Quand l'élément est souvent basculé (coût de rendu initial)

#### Éviter v-html

- **NE JAMAIS utiliser `v-html`** (risque XSS)
- Si nécessaire, utiliser DOMPurify

```vue
<!-- ❌ MAUVAIS - DANGER XSS -->
<div v-html="userInput"></div>

<!-- ✅ BON - si vraiment nécessaire -->
<!-- <div v-html="sanitize(userInput)"></div> -->
```

---

## Tailwind CSS

### Principes

- **Privilégier Tailwind** pour TOUT le style
- Utiliser les classes utilitaires dans le template
- Éviter le CSS custom sauf pour les animations complexes

### Bonnes pratiques

#### Nommage des classes

- Utiliser les classes Tailwind existantes
- Éviter de créer des classes CSS custom

```vue
<!-- ✅ BON - Tailwind uniquement -->
<button
  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
>
  Submit
</button>

<!-- ❌ MAUVAIS - CSS custom -->
<style>
.my-button {
  padding: 1rem;
  background: blue;
}
</style>
```

#### Responsive

- Utiliser les préfixes responsive de Tailwind

```vue
<!-- ✅ BON -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

#### Couleurs

- Respecter la charte couleur du projet
- Utiliser les variables CSS définies dans `style.css`

```vue
<!-- ✅ BON - utiliser les variables CSS -->
<div class="bg-(--color-bg) text-(--secondary)">
  Content
</div>

<!-- ou avec Tailwind -->
<div class="bg-[#06050a] text-[#F4F4F5]">
  Content
</div>
```

#### Animations

- Utiliser les classes d'animation de Tailwind
- Pour les animations complexes, utiliser `style.css`

```vue
<!-- ✅ BON -->
<div class="transition-all duration-300 ease-in-out hover:scale-105">
  Hover me
</div>
```

#### Custom CSS

- Si nécessaire, mettre dans `<style scoped>` du composant
- Pour les styles globaux, utiliser `style.css`

---

## Nommage

### Fichiers

- **PascalCase** pour les composants : `MyComponent.vue`
- **kebab-case** pour les autres : `my-util.ts`, `my-style.css`
- **SCREAMING_SNAKE_CASE** pour les constantes et env : `API_URL`, `MAX_SIZE`

### Variables et fonctions

- **camelCase** : `fileList`, `uploadFile`, `isUploading`
- **PascalCase** pour les types/interfaces : `FileItem`, `UploadStatus`
- **SCREAMING_SNAKE_CASE** pour les constantes : `MIN_PASSWORD_LENGTH`

### Composants

- Noms descriptifs : `DropZone`, `FileList`, `UploadProgress`
- Éviter les noms génériques : `Component`, `Item`, `List`

### Props

- Noms descriptifs et concis
- Booléens : préfixer avec `is`, `has`, `can`

```typescript
// ✅ BON
interface Props {
  files: FileItem[];
  isUploading: boolean;
  hasError: boolean;
  canSubmit: boolean;
}

// ❌ MAUVAIS
interface Props {
  f: FileItem[]; // trop court
  uploading: boolean; // pas de préfixe
}
```

### Routes

- Noms en camelCase : `home`, `download`, `termsOfService`
- Paths en kebab-case : `/`, `/t/:id`, `/cgu`

---

## Organisation des fichiers

```
src/
├── main.ts                 # Point d'entrée
├── App.vue                 # Composant racine
├── router.ts               # Configuration du router
├── style.css               # Styles globaux
├── env.d.ts                # Déclarations TypeScript
│
├── assets/                 # Assets statiques
│   ├── images/
│   └── fonts/
│
├── components/             # Composants réutilisables
│   ├── layouts/            # Layouts (header, footer)
│   │   └── footer.vue
│   └── ui/                 # Composants UI (boutons, inputs)
│       ├── Button.vue
│       └── Input.vue
│
├── composables/            # Composables (useXxx)
│   └── useUpload.ts
│
├── utils/                  # Utilitaires
│   ├── file.ts             # Fonctions pour les fichiers
│   ├── validation.ts       # Validation
│   └── format.ts           # Formattage
│
├── views/                  # Pages/vues
│   ├── Home/
│   │   ├── Home.vue        # Page d'accueil
│   │   └── components/     # Composants spécifiques à Home
│   │       └── ui/
│   │           ├── DropZone.vue
│   │           ├── FileList.vue
│   │           └── ...
│   ├── Download/
│   │   └── Download.vue    # Page de téléchargement
│   └── Legal/
│       ├── TermsOfService.vue
│       ├── PrivacyPolicy.vue
│       └── LegalNotices.vue
│
├── stores/                 # Pinia stores (si utilisé)
│   └── uploadStore.ts
│
└── types/                  # Types TypeScript partagés
    ├── file.d.ts
    └── api.d.ts
```

---

## Commentaires

### Quand commenter

- **OUI** : Pourquoi le code existe (raison business)
- **OUI** : Algorithmes complexes ou non évidents
- **OUI** : Hacks ou workarounds temporaires
- **OUI** : TODO et FIXME
- **NON** : Ce que le code fait (le code est auto-documenté)
- **NON** : Comment le code fonctionne (sauf si très complexe)

### Format des commentaires

```typescript
// ❌ MAUVAIS - commentaire inutile
// Incrémente le compteur
count.value++;

// ✅ BON - commentaire utile
// NOTE: On utilise un delay pour éviter les doubles clics
// TODO: Remplacer par une solution plus robuste
await new Promise((resolve) => setTimeout(resolve, 300));

// ✅ BON - commentaire pour algorithme complexe
/**
 * Calcule le temps restant estimé en fonction de:
 * - la progression actuelle
 * - la taille totale
 * - la vitesse de transfert
 */
const estimatedTime = computed(() => {
  // ...
});
```

### TODO/FIXME

```typescript
// TODO: Implémenter la validation côté serveur
// FIXME: Ce hack cause un re-rendu inutile
// HACK: Contournement temporaire pour le bug #123
```

---

## Gestion des erreurs

### Try/Catch

- Toujours gérer les erreurs des opérations asynchrones
- Ne pas ignorer les erreurs (sauf cas très spécifique)

```typescript
// ✅ BON
async function uploadFile(file: File): Promise<string> {
  try {
    const response = await axios.post("/upload", { file });
    return response.data.id;
  } catch (error) {
    console.error("Upload failed:", error);
    // Gérer l'erreur : afficher un message, relancer, etc.
    throw new Error("Upload failed", { cause: error });
  }
}

// ❌ MAUVAIS - erreur ignorée
async function uploadFile(file: File) {
  await axios.post("/upload", { file });
}
```

### Validation des inputs

- Toujours valider les inputs utilisateur
- Toujours valider les données API

```typescript
// ✅ BON
function validateFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    alert(`Fichier trop grand (max: ${formatSize(MAX_FILE_SIZE)})`);
    return false;
  }
  return true;
}

// Dans le composant
const handleFileSelect = (file: File) => {
  if (!validateFile(file)) return;
  // ...
};
```

### Erreurs API

- Typage des réponses d'erreur
- Gestion centralisée si possible

```typescript
interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

async function fetchData() {
  try {
    // ...
  } catch (error) {
    const apiError = error as AxiosError<ApiError>;
    if (apiError.response?.status === 401) {
      // Gérer 401
    } else if (apiError.response?.status === 404) {
      // Gérer 404
    } else {
      // Gérer autre erreur
    }
  }
}
```

---

## Performance

### Computed

- Utiliser `computed` pour les valeurs dérivées
- Éviter les calculs lourds dans les templates

### Memoization

- Pour les fonctions coûteuses, utiliser `memoize` (lodash ou implémentation custom)

### Lazy loading

- Utiliser le lazy loading pour les composants lourds

```typescript
// ✅ BON - Lazy loading
const HeavyComponent = defineAsyncComponent(
  () => import("./HeavyComponent.vue"),
);
```

### Éviter les re-rendus inutiles

- Utiliser `v-once` pour le contenu statique
- Éviter de muté des objets dans les props

### Optimisation des images

- Utiliser des images optimisées (WebP)
- Utiliser `loading="lazy"` pour les images offscreen

---

## Accessibilité

### Règles de base

- Toujours utiliser `alt` pour les images
- Toujours utiliser des labels pour les inputs
- Utiliser les attributs ARIA quand nécessaire
- Respecter l'ordre de tabulation

```vue
<!-- ✅ BON -->
<img src="logo.png" alt="Silvertransfert Logo" />

<input type="text" id="email" v-model="email" aria-label="Adresse email" />

<button @click="submit" :disabled="isLoading" :aria-busy="isLoading">
  {{ isLoading ? 'Chargement...' : 'Submit' }}
</button>

<!-- ❌ MAUVAIS -->
<img src="logo.png" />
<input type="text" v-model="email" />
```

### Keyboard navigation

- Tous les éléments interactifs doivent être accessibles au clavier
- Utiliser `:tabindex` si nécessaire

### Screen readers

- Utiliser `aria-hidden="true"` pour les éléments décoratifs
- Utiliser `aria-live` pour les notifications

```vue
<!-- ✅ BON -->
<div aria-hidden="true" class="decorative-element"></div>

<div aria-live="polite">
  {{ notification }}
</div>
```

---

## Checklist finale

Avant de valider votre code :

- [ ] Tout est bien typé (pas de `any`)
- [ ] Les noms suivent les conventions
- [ ] Le code est bien organisé (imports, types, state, etc.)
- [ ] Les erreurs sont gérées
- [ ] Le code est accessible
- [ ] Pas de `v-html`
- [ ] Les inputs sont validés
- [ ] Les dépendances sont à jour
- [ ] Les tests passent (si applicable)
- [ ] Le code compile sans erreur TypeScript
- [ ] Le code est commité (sans push)
