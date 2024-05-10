<template>
  <Observer :onEnter="onEnter" :onLeave="onLeave">
    <Grid class="static-header foo">
      <Column span="6" laptop-start="7" laptop-span="3">
        <HeaderStaticLogo />
      </Column>
      <Column span="6" laptop-start="10" laptop-span="3">
        <HeaderStaticNav />
      </Column>
    </Grid>
  </Observer>
</template>

<style>
.static-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  position: relative;
  z-index: 999;
  padding-top: var(--tinier);
  padding-bottom: var(--tinier);
}
</style>

<script setup>
import { useAppStore } from "~/stores/app";

const app = useAppStore();

function onEnter() {
  // disable sticky nav when header in view
  app.setHeaderIsVisible(false);
  console.log("hide", app.headerIsVisible);
}

function onLeave() {
  app.setHeaderIsVisible(true);
  console.log("show", app.headerIsVisible);
}
</script>
