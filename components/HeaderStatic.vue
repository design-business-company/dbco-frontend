<template>
  <Observer :onEnter="onEnter" :onLeave="onLeave">
    <header class="static-header">
      <Grid>
        <Column class="text-body-1" span="6" laptop-start="7" laptop-span="3">
          <HeaderStaticLogo />
        </Column>
        <Column class="text-body-1" span="6" laptop-start="10" laptop-span="3">
          <HeaderStaticNav />
        </Column>
      </Grid>
    </header>
  </Observer>
</template>

<style>
.static-header {
  position: relative;
  width: 100%;
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
  // console.log("hide", app.headerIsVisible);
}

function onLeave() {
  app.setHeaderIsVisible(true);
}
</script>
