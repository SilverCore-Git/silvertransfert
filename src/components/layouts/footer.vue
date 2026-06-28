<template>
  <footer class="bg-[#030207] pt-32 pb-16 px-8 z-10 relative border-t border-[rgba(255,255,255,0.03)]">
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr,2fr] gap-16 mb-24">
      
      <div>
        <div class="font-['Space_Grotesk'] text-[1.75rem] font-bold text-white mb-6 flex items-center gap-4">
          <div>Silver<span class="text-[#6356e5]">Transfert</span></div>
          <iframe src="https://status.silvertransfert.fr/embed-badges/live-status?align=start&background-dark=06050a&text-dark=ffffff" width="180" height="30" loading="lazy" frameborder="0" scrolling="no" class=" border-0 rign-0"></iframe>
        </div>
        <p class="text-[0.95rem] text-white leading-relaxed max-w-4xl">
          Les transferts de fichiers simple et sécurisé, hébergé en France et respectueux de votre vie privée.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div class="space-y-7">
          <h6 class="text-[0.75rem] uppercase text-white tracking-[0.1em] font-semibold">Plan du site</h6>
          <nav class="space-y-4">
            <a href="/#accueil" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Transfert</a>
            <a href="/#presentation" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Fonctionnalités</a>
            <a href="/#faq" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Questions</a>
          </nav>
        </div>

        <div class="space-y-7">
          <h6 class="text-[0.75rem] uppercase text-white tracking-[0.1em] font-semibold">Nous sommes aussi</h6>
          <nav class="space-y-4">
            <a href="https://www.silvercore.fr" target="_blank" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Silvercore</a>
            <a href="https://www.silvernote.fr" target="_blank" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Silvernote</a>
          </nav>
        </div>

        <div class="space-y-7">
          <h6 class="text-[0.75rem] uppercase text-white tracking-[0.1em] font-semibold">Légal</h6>
          <nav class="space-y-4">
            <router-link to="/politique-de-confidentialite" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Confidentialité</router-link>
            <router-link to="/cgu" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">CGU</router-link>
            <a href="https://www.silvercore.fr/legal" target="blanc" class="block text-[0.9rem] text-[#bbb8d8] hover:text-[#6356e5] transition-colors">Mentions légales</a>
          </nav>
        </div>

      </div>
    </div>

    <div class="max-w-[1200px] mx-auto pt-12 border-t border-[rgba(255,255,255,0.03)] flex flex-col md:flex-row justify-between items-center gap-6">
      <span class="text-[0.85rem] text-[#a09cb4]">&copy; 2025 - {{ new Date().getFullYear() }} Silvercore. Tous droits réservés. </span>
      
      <div class="flex gap-6">
        <a href="https://taap.it/silvercore.discord" class="text-[#a09cb4] hover:text-[#6356e5] text-[1.25rem] transition-all hover:-translate-y-1">
          <i class="bi bi-discord"></i>
        </a>
        <a href="https://github.com/SilverCore-Git" class="text-[#a09cb4] hover:text-[#6356e5] text-[1.25rem] transition-all hover:-translate-y-1">
          <i class="bi bi-github"></i>
        </a>
      </div>
    </div>
  </footer>
</template>