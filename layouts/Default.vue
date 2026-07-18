<template>
  <div class="site-wrapper" v-if="data?.links">
    <a class="skip-link text-caption-1" href="#main-content"
      >Skip to content</a
    >
    <HeaderSticky :links="data?.links" />
    <HeaderStatic :links="data?.links" />
    <main
      id="main-content"
      tabindex="-1"
      :class="['site-content', { 'nav-is-open': app.mobileNavIsVisible }]"
    >
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
    }, 500);
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

  // Skip-link target — focused programmatically, no outline needed
  &:focus {
    outline: none;
  }

  &.nav-is-open {
    overflow: hidden;
    pointer-events: none;
  }
}

// First tab stop on every page; visually hidden until focused (the link
// itself is what receives focus, so it is always visible when it matters).
.skip-link {
  position: fixed;
  top: 0;
  left: 0;
  // Above the sticky nav (z-index 9999)
  z-index: 10000;
  padding: var(--tiny) var(--smallest);
  background-color: var(--background-primary);
  color: var(--foreground-primary);
  border-radius: 0 0 var(--border-radius) 0;
  transform: translate3d(0, -150%, 0);

  &:focus-visible {
    transform: translate3d(0, 0, 0);
  }
}
</style>
