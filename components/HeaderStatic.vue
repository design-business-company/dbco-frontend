<template>
  <Observer :onEnter="onEnter" :onLeave="onLeave">
    <Grid>
      <Column span="6" laptop-start="7" laptop-span="3">
        <HeaderStaticLogo />
      </Column>
      <Column span="6" laptop-start="10" laptop-span="3">
        <HeaderStaticNav />
      </Column>
    </Grid>
  </Observer>
</template>

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
