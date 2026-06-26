<template>
  <section class="py-24 bg-[#06050a] relative z-10" id="faq">
    <div class="max-w-4xl mx-auto px-6">
      
      <header class="text-center mb-16">
        <h2 class="font-['Space_Grotesk'] text-[clamp(1.8rem,4vw,2.75rem)] font-bold text-white tracking-tight">
          Vos questions, nos réponses
        </h2>
      </header>

      <div class="space-y-2">
        <div 
          v-for="(item, index) in faqData" 
          :key="index"
          class="border-b border-[rgba(255,255,255,0.05)] transition-all duration-300"
        >
          <button 
            @click="toggle(index)"
            class="w-full flex justify-between items-center py-8 text-left focus:outline-none group"
          >
            <span class="text-[1.15rem] font-semibold text-white group-hover:text-[#6356e5] transition-colors">
              {{ item.q }}
            </span>
            <div class="w-8 h-8 flex items-center justify-center text-[#6356e5]">
              <i 
                class="bi bi-chevron-down transition-transform duration-300"
                :class="{'rotate-180': openIndex === index}"
              />
            </div>
          </button>
          
          <div 
            v-show="openIndex === index"
            class="pb-8 text-[0.95rem] leading-[1.6] text-[#bbb8d8] font-['Outfit']"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* FAQ Animations */
section {
  animation: fadeInUp 0.8s ease-out;
}

header h2 {
  animation: fadeInDown 0.6s ease-out 0.2s both;
}

div[class*="space-y"] > div {
  opacity: 0;
  transform: translateX(-20px);
}

div[class*="space-y"] > div:nth-child(1) { animation: fadeInLeft 0.6s ease-out 0.3s both; }
div[class*="space-y"] > div:nth-child(2) { animation: fadeInLeft 0.6s ease-out 0.4s both; }
div[class*="space-y"] > div:nth-child(3) { animation: fadeInLeft 0.6s ease-out 0.5s both; }
div[class*="space-y"] > div:nth-child(4) { animation: fadeInLeft 0.6s ease-out 0.6s both; }
div[class*="space-y"] > div:nth-child(5) { animation: fadeInLeft 0.6s ease-out 0.7s both; }
div[class*="space-y"] > div:nth-child(6) { animation: fadeInLeft 0.6s ease-out 0.8s both; }

button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateX(5px);
}

button span[class*="rotate"] {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

div[v-show] {
  animation: fadeIn 0.4s ease-out;
}
</style>

<script setup lang="ts">

import { ref } from 'vue';

interface FaqItem {
  q: string;
  a: string;
}

const faqData: FaqItem[] = [
  {
    q: "Capacité de stockage ?",
    a: "Chaque envoi est limité à 10 Go."
  },
  {
    q: "Sécurité des serveurs ?",
    a: "Nos serveurs sont durcis selon les recommandations de l'ANSSI et font l'objet d'audits réguliers."
  },
  {
    q: "Disponibilité ?",
    a: "Nos services affichent un taux de disponibilité (SLA) de 99,99%, assurant la continuité de vos activités."
  },
  {
    q: "Les fichiers sont-ils conservés ?",
    a: "Oui, vos fichiers sont conservés pendant 30 jours après leur envoi."
  },
  {
    q: "Les fichiers sont-ils chiffrés ?",
    a: "Oui, vos fichiers sont chiffrés avec l'algorithme AES-256-CBC avant d'être stockés."
  },
  {
    q: "Peut on perdre nos fichiers ?",
    a: "Cela est très peu probable, lors de la periode de 30 jours après téléversement les fichiers sont copier sur 3 support différent."
  }
];

const openIndex = ref<number | null>(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

</script>