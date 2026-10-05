<template>
  <section class="faq" id="faq">
    <div class="faq-grid">
      <h2 class="faq-title">{{ faq_json.title || 'Questions fréquentes' }}</h2>

      <div class="faq-list">
        <div v-for="(item, index) in faqData" :key="index" class="faq-item">
          <h3>
            <button
              @click="toggle(index)"
              :id="`faq-q-${index}`"
              :aria-expanded="openIndex === index"
              :aria-controls="`faq-a-${index}`"
              class="faq-question"
            >
              <span>{{ item.question }}</span>
              <i aria-hidden="true" class="bi bi-chevron-down faq-chevron" :class="{ open: openIndex === index }"></i>
            </button>
          </h3>
          <div
            v-show="openIndex === index"
            :id="`faq-a-${index}`"
            role="region"
            :aria-labelledby="`faq-q-${index}`"
            class="faq-answer"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 4rem 0;
}

.faq-grid {
  max-width: var(--container-page);
  margin: 0 auto;
  padding: 0 1.25rem;
  display: grid;
  gap: 2rem;
}

.faq-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
}

.faq-item:first-child {
  border-top: 1px solid var(--color-border);
}

.faq-question {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: color 0.2s ease;
}

@media (hover: hover) {
  .faq-question:hover {
    color: var(--color-primary);
  }
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.faq-chevron.open {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.faq-answer {
  padding: 0 0 1.4rem;
  max-width: 65ch;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .faq {
    padding: 6rem 0;
  }

  .faq-grid {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .faq-grid {
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    align-items: start;
  }

  .faq-title {
    position: sticky;
    top: 2rem;
  }
}
</style>

<script setup lang="ts">

import { ref } from 'vue';
import faq_json from '../../../../config/faq.json';

interface FaqItem {
  question: string;
  answer: string;
}

// Use config data or fallback to default
const faqData: FaqItem[] = faq_json.items || [
  {
    question: "Capacité de stockage ?",
    answer: "Chaque envoi est limité à 10 Go."
  },
  {
    question: "Sécurité des serveurs ?",
    answer: "Nos serveurs sont durcis selon les recommandations de l'ANSSI et font l'objet d'audits réguliers."
  },
  {
    question: "Disponibilité ?",
    answer: "Nos services affichent un taux de disponibilité (SLA) de 99,99%, assurant la continuité de vos activités."
  },
  {
    question: "Les fichiers sont-ils conservés ?",
    answer: "Oui, vos fichiers sont conservés pendant 30 jours après leur envoi."
  },
  {
    question: "Les fichiers sont-ils chiffrés ?",
    answer: "Oui, de bout en bout : ils sont chiffrés dans votre navigateur (AES-256-GCM) avant l'envoi, et la clé ne quitte jamais le lien."
  },
  {
    question: "Peut-on perdre nos fichiers ?",
    answer: "Cela est très peu probable : pendant la période de 30 jours après le téléversement, les fichiers sont copiés sur 3 supports différents."
  }
];

const openIndex = ref<number | null>(0);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

</script>