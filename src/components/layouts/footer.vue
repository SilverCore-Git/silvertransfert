<script setup lang="ts">
import { getConfigValue } from '../../utils/config';
import navigation_json from '../../config/navigation.json';
import { scrollToCurrentHash } from '../../router';

const fallbackBrand = 'Silver<span class="text-(--color-primary-strong)">Transfert</span>';

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    discord: 'bi-discord',
    github: 'bi-github',
    twitter: 'bi-twitter',
    facebook: 'bi-facebook',
    linkedin: 'bi-linkedin'
  };
  return icons[platform] || 'bi-globe';
}
</script>

<template>
  <footer class="bg-(--color-bg-deep) relative z-10 border-t border-(--color-border) pt-10 pb-12 px-5 md:px-8">
    <div v-if="navigation_json.footer?.silvercore" class="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-10 mb-12 border-b border-(--color-border)">
      <p class="text-(--color-text-secondary)">{{ navigation_json.footer.silvercore.text }}</p>
      <a :href="navigation_json.footer.silvercore.url" target="_blank" rel="noopener" class="inline-flex items-center gap-2 font-medium text-(--color-primary) hover:underline">
        {{ navigation_json.footer.silvercore.link }} <i aria-hidden="true" class="bi bi-arrow-up-right"></i>
      </a>
    </div>
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-8 sm:gap-12 lg:gap-16 mb-16">
      
      <div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 font-['Space_Grotesk'] text-[1.5rem] font-bold text-(--color-text) mb-5">
          <div v-html="navigation_json.footer?.brand || fallbackBrand"></div>
          <iframe src="https://status.silvertransfert.fr/embed-badges/live-status?align=start&background-dark=0c0c11&text-dark=f2f2f5" title="État des services SilverTransfert" width="180" height="30" loading="lazy" frameborder="0" scrolling="no" class="border-0 ring-0 max-w-full"></iframe>
        </div>
        <p class="text-(--color-text-secondary) leading-relaxed max-w-[40ch]">
          {{ navigation_json.footer?.tagline || 'Le transfert de fichiers, simple et sécurisé, hébergé en France et respectueux de votre vie privée.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div v-for="section in [
          navigation_json.footer?.siteMap,
          navigation_json.footer?.ourServices,
          navigation_json.footer?.legal
        ].filter(Boolean)" :key="section.title" class="space-y-4">
          <h2 class="text-sm font-semibold text-(--color-text)">{{ section.title }}</h2>
          <nav class="space-y-3">
            <template v-for="item in section.items" :key="item.label">
              <component :is="('path' in item) ? 'router-link' : 'a'" 
                :to="('path' in item) ? item.path : ''"
                :href="('url' in item) ? item.url : ''"
                :target="('url' in item) ? '_blank' : ''"
                @click="('path' in item) && item.path && scrollToCurrentHash(item.path)"
                class="block text-[0.9rem] text-[var(--color-text-secondary)] hover:text-(--color-text) transition-colors"
              >
                {{ item.label }}
              </component>
            </template>
          </nav>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto pt-8 border-t border-(--color-border) flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <span class="text-[0.8rem] sm:text-[0.85rem] text-(--color-text-muted) text-center sm:text-left" v-html="getConfigValue('navigation.footer.copyright', { year: String(new Date().getFullYear()) }) || `&copy; 2025 - ${new Date().getFullYear()} Silvercore. Tous droits réservés.`"></span>
      
      <div class="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
        <a v-for="(url, platform) in navigation_json.footer?.social || {}" :key="platform" :href="url" :aria-label="String(platform).charAt(0).toUpperCase() + String(platform).slice(1)" target="_blank" rel="noopener" class="text-(--color-text-muted) hover:text-(--color-text) text-[1.25rem] transition-colors">
          <i aria-hidden="true" class="bi" :class="getSocialIcon(String(platform))"></i>
        </a>
      </div>
    </div>
  </footer>
</template>