<template>
  <div class="site-wrapper">
    <Header />
    <main class="site-content">
      <Scrim />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useAppStore } from "~/stores/app";

const app = useAppStore();
const route = useRoute();

onMounted(() => {
  app.setAppHasLoaded(true);
  app.setRouteIsTransitioning(false);
});

watch(
  () => route.path,
  () => {
    app.setRouteIsTransitioning(true);
  }
);
</script>

<style lang="css">
.site-content {
  padding-left: var(--big);
  padding-right: var(--big);
  padding-top: calc(var(--big) * 6);
}

:root {
  --base-font-size: clamp(24px, 4vw, 48px);
  --scale-factor: 0.13;
}

.placeholder-hero {
  font-size: var(--base-font-size);
  max-width: 30ch;
  letter-spacing: calc(0.1em - var(--base-font-size) * var(--scale-factor));
  line-height: 1.1;
  transform: translateX(-0.03em);
}
</style>
