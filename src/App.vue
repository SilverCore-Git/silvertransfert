<script setup lang="ts">
import Footer from './components/layouts/footer.vue';

</script>

<template>
  <router-view />
  <Footer />
  <div class="fixed inset-0  bg-(--bg) bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-60" />
</template>