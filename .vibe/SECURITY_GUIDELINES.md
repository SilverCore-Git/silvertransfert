# Silvertransfert - Directives de Sécurité

> **Priorité Absolue** : La sécurité passe avant tout.
> **Version** : 1.0
> **Dernière mise à jour** : 2026-06-29

## Table des matières
1. [Principe de base](#principe-de-base)
2. [Injections (XSS, SQLi, etc.)](#injections)
3. [Validation des inputs](#validation-des-inputs)
4. [Gestion des fichiers](#gestion-des-fichiers)
5. [Authentification et autorisation](#authentification-et-autorisation)
6. [Protection des données](#protection-des-données)
7. [Communication sécurisée](#communication-sécurisée)
8. [Stockage](#stockage)
9. [Dépendances](#dépendances)
10. [Audit et monitoring](#audit-et-monitoring)
11. [Checklist sécurité](#checklist-sécurité)

---

## Principe de base

**"Ne jamais faire confiance, toujours vérifier."**

- **Tous les inputs sont malveillants** jusqu'à preuve du contraire
- **Tous les outputs doivent être échappés** par défaut
- **Principe du moindre privilège** : le code n'a que les permissions nécessaires
- **Défense en profondeur** : plusieurs couches de protection
- **Fail securely** : en cas d'erreur, refuser plutôt qu'accepter

---

## Injections

### XSS (Cross-Site Scripting)

**NE JAMAIS utiliser `v-html`**

```vue
<!-- ❌ DANGER ABSOLU - XSS -->
<div v-html="userInput"></div>

<!-- ❌ DANGER ABSOLU - innerHTML -->
<div ref="el"></div>
<script>
el.value.innerHTML = userInput;
</script>

<!-- ❌ DANGER ABSOLU - eval -->
eval(userInput);

<!-- ❌ DANGER ABSOLU - new Function -->
new Function(userInput)();

<!-- ❌ DANGER ABSOLU - setTimeout avec string -->
setTimeout(userInput, 100);
```

**Si vous devez absolument afficher du HTML** (très rare) :

```typescript
// ✅ SEULEMENT SI ABSOLUMENT NÉCESSAIRE
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userInput);
// Puis utiliser cleanHtml
```

### SQL Injection

**Toujours utiliser des requêtes paramétrées** :

```typescript
// ✅ BON - Axios avec params
const response = await axios.get('/api/files', {
  params: { id: fileId }  // Axios escape automatiquement
});

// ✅ BON - Requête POST avec body typé
interface UploadRequest {
  fileId: string;
  password: string;
}
const response = await axios.post('/api/upload', {
  fileId: sanitizedId,
  password: sanitizedPassword
} as UploadRequest);

// ❌ MAUVAIS - Concatenation de requêtes
// NE JAMAIS FAIRE ÇA
const query = `SELECT * FROM files WHERE id = '${userId}'`;
```

### Command Injection

```typescript
// ❌ MAUVAIS - Executer des commandes système
const { exec } = require('child_process');
exec(`ls ${userInput}`);  // DANGER

// ✅ BON - Si vraiment nécessaire, utiliser un whitelist
const allowedCommands = ['ls', 'pwd'];
if (allowedCommands.includes(command)) {
  exec(command);
}
```

---

## Validation des inputs

### Règles générales

1. **Toujours valider** côté client ET côté serveur
2. **Valider le type** (string, number, etc.)
3. **Valider le format** (regex, longueur, etc.)
4. **Valider la plage** (min, max, pattern)
5. **Valider le contenu** (blacklist/whitelist)

### Implémentation

```typescript
// ✅ BON - Validation complète
import { z } from 'zod';

const fileUploadSchema = z.object({
  file: z.instanceof(File),
  name: z.string()
    .min(1, 'Le nom ne peut pas être vide')
    .max(255, 'Le nom est trop long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Nom de fichier invalide'),
  size: z.number()
    .max(10 * 1024 * 1024 * 1024, 'Fichier trop grand (max 10Go)'),
  type: z.string()
    .regex(/^[a-zA-Z]+\/[a-zA-Z0-9+.-]+$/, 'Type MIME invalide'),
});

type FileUpload = z.infer<typeof fileUploadSchema>;

function validateFile(file: unknown): FileUpload | null {
  try {
    return fileUploadSchema.parse(file);
  } catch (error) {
    console.error('Validation failed:', error);
    return null;
  }
}

// Utilisation
const validatedFile = validateFile(userFile);
if (!validatedFile) {
  // Gérer l'erreur
  showError('Fichier invalide');
  return;
}
```

### Sans Zod (validation manuelle)

```typescript
// ✅ BON - Validation manuelle
interface ValidFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

function isValidFile(input: unknown): input is ValidFile {
  if (!input || typeof input !== 'object') return false;
  
  const file = input as Record<string, unknown>;
  
  // Valider File
  if (!(file.file instanceof File)) return false;
  
  // Valider name
  if (typeof file.name !== 'string') return false;
  if (file.name.length === 0 || file.name.length > 255) return false;
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) return false;
  
  // Valider size
  if (typeof file.size !== 'number') return false;
  if (file.size < 0 || file.size > 10 * 1024 * 1024 * 1024) return false;
  
  // Valider type
  if (typeof file.type !== 'string') return false;
  if (!/^[a-zA-Z]+\/[a-zA-Z0-9+.-]+$/.test(file.type)) return false;
  
  return true;
}

// Utilisation
const userFile: unknown = /* ... */;
if (!isValidFile(userFile)) {
  showError('Fichier invalide');
  return;
}
// userFile est maintenant typé comme ValidFile
```

### Whitelist vs Blacklist

- **Préférer les whitelists** (autoriser seulement ce qui est connu)
- Éviter les blacklists (interdire ce qui est connu comme dangereux)

```typescript
// ✅ BON - Whitelist des extensions
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.png', '.txt'];
function isAllowedExtension(filename: string): boolean {
  const extension = filename.slice(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(extension.toLowerCase());
}

// ❌ MAUVAIS - Blacklist (toujours incomplète)
const BLOCKED_EXTENSIONS = ['.exe', '.js', '.php'];
function isBlockedExtension(filename: string): boolean {
  return BLOCKED_EXTENSIONS.includes(filename.slice(filename.lastIndexOf('.')));
}
```

---

## Gestion des fichiers

### Upload de fichiers

**Risques principaux** :
- Fichiers malveillants (virus, malware)
- Fichiers trop grands (DoS)
- Types de fichiers dangereux
- Noms de fichiers malveillants

**Bonnes pratiques** :

```typescript
// ✅ BON - Validation complète avant upload
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10Go
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain',
  // ... autres types autorisés
];

function validateFileBeforeUpload(file: File): { valid: boolean; error?: string } {
  // 1. Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Fichier trop grand (max: ${formatSize(MAX_FILE_SIZE)})` };
  }
  
  // 2. Vérifier le type MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé' };
  }
  
  // 3. Vérifier l'extension
  const extension = file.name.slice(file.name.lastIndexOf('.'));
  const allowedExtensions = ALLOWED_MIME_TYPES.map(t => {
    const match = t.match(/\/([a-z0-9]+)$/i);
    return match ? `.${match[1]}` : '';
  });
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return { valid: false, error: 'Extension non autorisée' };
  }
  
  // 4. Vérifier le nom (pas de caractères dangereux)
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return { valid: false, error: 'Nom de fichier invalide' };
  }
  
  return { valid: true };
}
```

### Téléchargement de fichiers

```typescript
// ✅ BON - Téléchargement sécurisé
async function downloadFile(id: string, password: string): Promise<void> {
  try {
    // 1. Valider les inputs
    if (!/^[a-zA-Z0-9]{8,10}$/.test(id)) {
      throw new Error('ID de transfert invalide');
    }
    if (!/^[a-zA-Z0-9]{10,32}$/.test(password)) {
      throw new Error('Mot de passe invalide');
    }
    
    // 2. Requête sécurisée
    const response = await axios.get(`/api/download/${id}`, {
      params: { password },
      responseType: 'blob',
      // Timeout pour éviter les attaques par ralentissement
      timeout: 30000,
    });
    
    // 3. Vérifier le type de contenu
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('application/')) {
      throw new Error('Type de contenu invalide');
    }
    
    // 4. Créer un blob et un URL temporaire
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    
    // 5. Créer un lien pour le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fichier');
    document.body.appendChild(link);
    link.click();
    
    // 6. Nettoyer
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Gérer l'erreur
  }
}
```

### Stockage des fichiers

- **NE JAMAIS stocker les fichiers dans le répertoire web** (accessible directement)
- Stocker les fichiers en dehors de la racine web
- Utiliser des noms de fichiers aléatoires (pas les noms originaux)

```typescript
// ✅ BON - Génération de nom de fichier sécurisé
function generateSafeFilename(): string {
  const random = crypto.getRandomValues(new Uint32Array(4));
  const hash = Array.from(random).map(x => x.toString(16).padStart(8, '0')).join('');
  return `${hash}.dat`;  // Pas d'extension pour éviter l'exécution
}
```

---

## Authentification et autorisation

### Principes

- **Toujours vérifier l'authentification** côté serveur
- **Ne jamais stocker de mots de passe en clair**
- **Utiliser des jetons temporaires** (JWT, etc.)
- **Toujours vérifier les permissions** avant chaque action

### Implémentation

```typescript
// ✅ BON - Vérification de l'authentification
interface User {
  id: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
}

const authState = ref<AuthState>({ user: null, token: null, expiresAt: null });

function isAuthenticated(): boolean {
  return authState.value.token !== null && 
         authState.value.expiresAt !== null &&
         authState.value.expiresAt > Date.now();
}

function hasRole(role: 'user' | 'admin'): boolean {
  return isAuthenticated() && 
         authState.value.user?.role === role;
}

// Dans les composants/requêtes
if (!isAuthenticated()) {
  // Rediriger vers la page de login
  router.push('/login');
  return;
}

if (!hasRole('admin')) {
  // Afficher erreur 403
  showError('Accès non autorisé');
  return;
}
```

### JWT

```typescript
// ✅ BON - Gestion des JWT
interface JwtPayload {
  sub: string;  // User ID
  role: 'user' | 'admin';
  exp: number;  // Timestamp d'expiration
  iat: number;  // Timestamp de création
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}
```

---

## Protection des données

### Chiffrement

**Silvertransfert utilise AES-256-CBC** pour le chiffrement des fichiers.

```typescript
// ✅ BON - Utilisation du chiffrement côté backend
// Le frontend ne doit PAS implémenter le chiffrement lui-même
// mais doit s'assurer que le backend le fait correctement

interface UploadResponse {
  status: 'await_crypting' | 'OK' | 'error';
  message?: string;
}

async function uploadFile(file: File): Promise<UploadResponse> {
  const response = await axios.post('/api/upload', { file });
  
  // Vérifier que le serveur a bien chiffré le fichier
  if (response.data.status !== 'await_crypting' && 
      response.data.status !== 'OK') {
    throw new Error('Le fichier n\'a pas été chiffré correctement');
  }
  
  return response.data;
}
```

### Ne pas stocker de données sensibles

```typescript
// ❌ MAUVAIS - Stocker des données sensibles
localStorage.setItem('userToken', token);  // Pas sécurisé
sessionStorage.setItem('userPassword', password);  // JAMAIS

// ✅ BON - Stocker seulement ce qui est nécessaire
// et utiliser des mécanismes sécurisés
const authStore = useAuthStore();  // Pinia avec persistence sécurisée
authStore.setToken(token);  // Le store gère le stockage sécurisé
```

### Masquage des données

```typescript
// ✅ BON - Masquer les données sensibles dans l'UI
function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  return `${username[0]}***@${domain}`;
}

function maskPassword(password: string): string {
  return '*'.repeat(password.length);
}
```

---

## Communication sécurisée

### HTTPS

- **Toujours utiliser HTTPS** en production
- Rediriger HTTP vers HTTPS
- Utiliser HSTS (HTTP Strict Transport Security)

```typescript
// ✅ BON - Forcer HTTPS
const API_URL = import.meta.env.VITE_API_URL;

// En production, s'assurer que API_URL commence par https://
if (import.meta.env.PROD && !API_URL.startsWith('https://')) {
  console.warn('API_URL doit être en HTTPS en production');
  // Rediriger ou bloquer
}
```

### CORS

- Configurer CORS côté serveur de manière restrictive
- Ne pas utiliser `*` en production

```typescript
// ✅ BON - Configuration CORS côté serveur (exemple)
// Ce code va dans le backend, pas dans le frontend
// Mais le frontend doit connaître les origines autorisées
const ALLOWED_ORIGINS = [
  'https://silvertransfert.fr',
  'https://www.silvertransfert.fr',
];
```

### Headers de sécurité

- Utiliser les headers de sécurité HTTP
- Configurer côté serveur

```typescript
// ✅ BON - Headers recommandés (à configurer côté serveur)
// Content-Security-Policy (CSP)
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Referrer-Policy: strict-origin-when-cross-origin
// Strict-Transport-Security: max-age=31536000; includeSubDomains
// Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Stockage

### localStorage / sessionStorage

- **Ne pas stocker de données sensibles**
- **Chiffrer les données sensibles** si vraiment nécessaire
- Préférer sessionStorage (effacé à la fermeture du navigateur)

```typescript
// ❌ MAUVAIS - Stocker des données sensibles
localStorage.setItem('userPassword', password);

// ✅ BON - Stocker seulement des données non sensibles
sessionStorage.setItem('lastVisit', Date.now().toString());

// ✅ MIEUX - Utiliser un store sécurisé
import { useLocalStorage } from '@vueuse/core';
const theme = useLocalStorage('theme', 'dark');  // OK - pas sensible
```

### Cookies

- **Toujours utiliser `HttpOnly`** pour les cookies sensibles
- **Toujours utiliser `Secure`** en production
- **Toujours utiliser `SameSite`**

```typescript
// ✅ BON - Configuration des cookies (côté serveur)
// HttpOnly: true
// Secure: true
// SameSite: 'Lax' ou 'Strict'
// Path: /
// Domain: .silvertransfert.fr
// Max-Age: 3600 (1 heure)
```

---

## Dépendances

### Gestion des dépendances

- **Toujours vérifier les dépendances** avant de les utiliser
- **Mettre à jour régulièrement** les dépendances
- **Éviter les dépendances obsolètes**
- **Vérifier les vulnérabilités** (npm audit, Snyk, etc.)

```bash
# ✅ BON - Vérifier les vulnérabilités
npm audit
npm audit fix

# ✅ BON - Mettre à jour les dépendances
npm update
npm outdated
```

### Dépendances de confiance

- **Préférer les dépendances populaires et maintenues**
- **Éviter les dépendances sans maintenance**
- **Vérifier le code source** si dépendance critique

### Dépendances utilisées dans Silvertransfert

| Dépendance | Version | Usage | Sécurité |
|------------|---------|-------|----------|
| vue | ^3.5.24 | Framework | ✅ |
| typescript | ~5.9.3 | Langage | ✅ |
| axios | ^1.16.1 | HTTP Client | ✅ |
| vue-router | ^4.6.3 | Routing | ✅ |
| tailwindcss | ^4.1.17 | CSS | ✅ |
| bootstrap-icons | ^1.13.1 | Icons | ✅ |
| vite | ^7.2.2 | Build | ✅ |

---

## Audit et monitoring

### Logging

- **Ne pas logger de données sensibles**
- **Logger les erreurs** de manière sécurisée
- **Logger les tentatives de sécurité** (brute force, etc.)

```typescript
// ✅ BON - Logging sécurisé
function logError(error: Error, context: Record<string, unknown> = {}): void {
  // Ne pas logger d'informations sensibles
  const safeContext = { ...context };
  delete safeContext.password;
  delete safeContext.token;
  delete safeContext.email;
  
  console.error('[ERROR]', {
    message: error.message,
    stack: import.meta.env.DEV ? error.stack : undefined,  // Stack seulement en dev
    context: safeContext,
    timestamp: new Date().toISOString(),
  });
  
  // Envoyer au serveur de monitoring (sans données sensibles)
  if (import.meta.env.PROD) {
    sendErrorToServer({
      message: error.message,
      context: safeContext,
      userAgent: navigator.userAgent,
      path: window.location.pathname,
    });
  }
}
```

### Monitoring

- **Surveiller les erreurs** côté client
- **Surveiller les tentatives de sécurité** (injections, etc.)
- **Alerter en cas d'anomalie**

---

## Checklist sécurité

Avant chaque commit, vérifiez :

### Inputs
- [ ] Tous les inputs utilisateur sont validés
- [ ] Tous les inputs sont typés correctement
- [ ] Les fichiers uploadés sont validés (taille, type, nom)
- [ ] Les paramètres d'URL sont validés

### Outputs
- [ ] Aucun `v-html` utilisé
- [ ] Aucun `innerHTML` utilisé
- [ ] Aucun `eval` ou `Function` utilisé
- [ ] Les données affichées sont échappées

### Communication
- [ ] HTTPS utilisé en production
- [ ] Pas de données sensibles dans les URLs
- [ ] Les headers de sécurité sont configurés

### Stockage
- [ ] Pas de données sensibles dans localStorage/sessionStorage
- [ ] Les cookies sensibles ont HttpOnly et Secure
- [ ] Les tokens sont stockés de manière sécurisée

### Dépendances
- [ ] Toutes les dépendances sont à jour
- [ ] Aucune vulnérabilité connue (npm audit)
- [ ] Les dépendances sont de sources fiables

### Code
- [ ] Pas de `any` dans TypeScript
- [ ] Toutes les erreurs sont gérées
- [ ] Les permissions sont vérifiées
- [ ] Le code suit les bonnes pratiques

### Tests
- [ ] Les tests de sécurité passent
- [ ] Les injections sont testées
- [ ] Les validations sont testées

---

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Vue Security Guide](https://vuejs.org/guide/best-practices/security.html)
- [TypeScript Security](https://github.com/microsoft/TypeScript/wiki/Security)

---

**Rappel** : La sécurité n'est pas un état, c'est un processus. Soyez toujours vigilant.
