<template>
  <div class="site-wrapper">
    <HeaderStatic />
    <HeaderSticky />
    <main :class="['site-content', { 'nav-is-open': app.mobileNavIsVisible }]">
      <Scrim />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useAppStore } from "~/stores/app";
import { useDeviceStore } from "~/stores/device";

const app = useAppStore();
const device = useDeviceStore();
const route = useRoute();

onMounted(() => {
  app.setAppHasLoaded(true);
  app.setRouteIsTransitioning(false);
});

watch(
  () => route.path,
  () => {
    // tell the store we're transitioning
    app.setRouteIsTransitioning(true);
    // close nav
    setTimeout(() => {
      app.setMobileNavVisibility(false);
    }, 1000);
  }
);
</script>

<style lang="scss" scoped>
.site-content {
  transition: filter 400ms ease-in-out, opacity 400ms ease-in-out;

  &.nav-is-open {
    filter: blur(var(--tiniest));
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>
