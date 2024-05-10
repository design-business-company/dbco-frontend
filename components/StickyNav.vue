<template>
  <nav
    :class="[
      'sticky-nav',
      { 'is-visible': headerIsVisible },
      { 'is-disabled': !app.headerIsVisible },
    ]"
  >
    <Grid class="wrapper">
      <Column span="6">
        <StickyNavLogo />
      </Column>

      <Column span="6">
        <StickyNavLinks />
      </Column>
    </Grid>
    <Debug v-if="isDev" />
  </nav>
</template>

<script setup>
import { useDeviceStore } from "~/stores/device";
import { useAppStore } from "~/stores/app";
import { onMounted, onUnmounted } from "vue";
const isDev = process.dev;

const app = useAppStore();
const deviceStore = useDeviceStore();
const headerIsVisible = ref(true);

// watch main window event
const nuxt = useNuxtApp();
const scroll = nuxt.$scroll;
const scrollEl = ref({});
const handleScroll = () => {
  if (
    deviceStore.scrollNearTop ||
    deviceStore.scrollAtTop ||
    deviceStore.scrollDirection === "up"
  ) {
    headerIsVisible.value = true;
  } else {
    headerIsVisible.value = false;
  }
};

onMounted(() => {
  scrollEl.value = scroll.instance.el;
  scrollEl.value.addEventListener("scrollY", handleScroll);
});

onUnmounted(() => {
  scrollEl.value.removeEventListener("scrollY", handleScroll);
});
</script>

<style lang="scss" scoped>
.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  &:hover .wrapper {
    transform: translate3d(0, 0, 0);
  }

  .wrapper {
    transition: transform 300ms ease-out;
    transform: translate3d(0, -150%, 0);
    background-color: var(--background-primary);
  }

  &.is-visible .wrapper {
    transform: translate3d(0, 0, 0);
  }

  &.is-disabled .wrapper {
    transform: translate3d(0, -150%, 0);
  }
}
</style>
