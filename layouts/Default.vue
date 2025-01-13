<template>
  <div class="site-wrapper" v-if="data?.links">
    <HeaderSticky :links="data?.links" />
    <HeaderStatic :links="data?.links" />
    <main :class="['site-content', { 'nav-is-open': app.mobileNavIsVisible }]">
      <Scrim />
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useAppStore } from "~/stores/app";
import { settingsHeader } from "~/queries/settingsHeader";

const app = useAppStore();
const route = useRoute();
const { data, error, status, refresh } = await useSanityQuery(settingsHeader);

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
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-content {
  transition: filter 400ms ease-in-out, opacity 400ms ease-in-out;
  flex: 1;

  &.nav-is-open {
    // filter: blur(var(--tiniest));
    // opacity: 0.2;
    pointer-events: none;
  }
}
</style>
