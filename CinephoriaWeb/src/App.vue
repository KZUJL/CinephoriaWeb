<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="custom-bg-primary text-white">
    <header>
      <HeaderComponent />
    </header>
    <main>
      <RouterView />
    </main>

    <footer class="custom_sd_primary text-white">
      <FooterComponent />
    </footer>
  </div>

</template>
