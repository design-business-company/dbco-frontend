<template>
  <transition @leave="onLeave" @enter="onEnter">
    <div
      v-if="app.routeIsTransitioning && !app.appHasLoaded"
      class="scrim cover"
    ></div>
  </transition>
</template>

<script setup>
import { gsap } from "gsap";
import { onMounted } from "vue";
import { useAppStore } from "~/stores/app";

const app = useAppStore();

onMounted(() => {
  app.setRouteIsTransitioning(false);
});

function onEnter(el, done) {
  gsap.to(el, {
    ease: "expo.out",
    duration: 1,
    delay: 0.5,
    opacity: 1,
    y: 0,
    rotate: 0,
    onComplete: done,
  });
}

function onLeave(el, done) {
  gsap.to(el, {
    ease: "Power2.easeOut",
    duration: 1,
    delay: 0.125,
    opacity: 0,
    onComplete: done,
  });

  // const root = document.documentElement;
  // root.style["transition"] =
  //   "background-color var(--transition), color var(--transition)";
  // root.style["transition-delay"] = "var(--transition-page-delay)";
}
</script>

<style lang="scss">
.scrim {
  // background-color: var(--background-primary);
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.cover {
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
