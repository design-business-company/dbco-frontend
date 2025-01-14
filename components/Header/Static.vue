<template>
  <Observer :onEnter="onEnter" class="static-header-wrapper">
    <header class="static-header">
      <Grid>
        <Column class="text-body-1" span="6" span-laptop="4" span-desktop="3">
          <HeaderStaticLogo />
        </Column>
        <Column class="text-body-1" span="6" span-laptop="4" span-desktop="3">
          <HeaderStaticNav :links="links" />
        </Column>
      </Grid>
    </header>
  </Observer>
</template>

<style lang="scss">
@use "~/assets/styles/mixins";

.static-header-wrapper {
  margin-top: var(--biggest);
  position: relative;

  @include tablet {
    margin-top: 0;
  }
}

.static-header {
  position: relative;
  width: 100%;
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
import { useTheme } from "~/composables/useTheme";

const app = useAppStore();

const props = defineProps({
  links: {
    type: Array,
    required: true,
  },
});

function onEnter() {
  app.setHeaderIsVisible(true);
}
</script>
