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

// GSAP ticks on requestAnimationFrame, which browsers freeze in background
// tabs — without a non-rAF fallback the scrim (z-index 99999, pointer-
// blocking) can sit over the page indefinitely on background-tab loads.
// setTimeout is throttled in hidden tabs but always fires eventually, so it
// guarantees the transition hook's done() runs and the scrim is removed.
function withTimeoutFallback(el, done, timeoutMs) {
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    gsap.killTweensOf(el);
    done();
  };

  const fallback = setTimeout(finish, timeoutMs);

  return finish;
}

function onEnter(el, done) {
  // duration 1s + delay 0.5s, plus buffer
  const finish = withTimeoutFallback(el, done, 2000);

  gsap.to(el, {
    ease: "expo.out",
    duration: 1,
    delay: 0.5,
    opacity: 1,
    y: 0,
    rotate: 0,
    onComplete: finish,
  });
}

function onLeave(el, done) {
  // duration 1s + delay 0.125s, plus buffer
  const finish = withTimeoutFallback(el, done, 1750);

  gsap.to(el, {
    ease: "Power2.easeOut",
    duration: 1,
    delay: 0.125,
    opacity: 0,
    onComplete: finish,
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
