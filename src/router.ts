import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home/Home.vue';
import Download from './views/Download/Download.vue';
import TermsOfService from './views/Legal/TermsOfService.vue';
import PrivacyPolicy from './views/Legal/PrivacyPolicy.vue';
import LegalNotices from './views/Legal/LegalNotices.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Silvertransfert' }
  },
  {
    path: '/t/:id',
    name: 'Download',
    component: Download,
    meta: { title: 'Récupérer un transfert - Silvertransfert' }
  },
  {
    path: '/cgu',
    name: 'TermsOfService',
    component: TermsOfService,
    meta: { title: 'CGU - Silvertransfert' }
  },
  {
    path: '/mentions-legales',
    name: 'LegalNotices',
    component: LegalNotices,
    meta: { title: 'Mentions légales - Silvertransfert' }
  },
  {
    path: '/politique-de-confidentialite',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { title: 'Politique de confidentialité - Silvertransfert' }
  }
]



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, _savedPosition) {
    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) return { top: (el as HTMLElement).offsetTop, behavior: 'smooth' };
    }
    return { top: 0 };
  }
});

router.beforeEach((to: any, _from: any, next: any) => {
  const title = to.meta.title as string;

  if (title) {
    document.title = title;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.setAttribute('content', title);
      document.head.appendChild(meta);
    }
  }

  next();
});



export default router
