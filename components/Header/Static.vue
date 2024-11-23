<template>
  <Observer :onEnter="onEnter" :onLeave="onLeave" class="static-header-wrapper">
    <header
      class="static-header"
      v-bind="inertAttribute"
    >
      <Grid>
        <Column class="text-body-1" span="6" span-laptop="4" span-desktop="3">
          <HeaderStaticLogo />
        </Column>
        <Column class="text-body-1" span="6" span-laptop="4" span-desktop="3">
          <HeaderStaticNav />
        </Column>
      </Grid>
    </header>
  </Observer>
</template>

<style lang="scss">
@use "~/assets/styles/mixins";

.static-header-wrapper {
  margin-top: var(--huge);

  @include tablet {
    margin-top: 0;
  }
}

.static-header {
  position: relative;
  width: 100%;
  z-index: 999;
  padding-top: var(--tinier);
  padding-bottom: var(--big);

  display: none;

  @include tablet {
    display: block;
  }
}
</style>

<script setup>
import { useAppStore } from "~/stores/app";

const app = useAppStore();

const inertAttribute = computed(() => {
  if (app.headerIsVisible) {
    return { inert: true };
  }
  return {};
});

function onEnter() {
  // disable sticky nav when header in view
  // app.setMobileNavVisibility(false);
  // console.log("hide", app.headerIsVisible);
}

function onLeave() {
  // app.setMobileNavVisibility(true);
}
</script>
