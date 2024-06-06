<template>
  <transition @leave="onLeave" @enter="onEnter">
    <div v-if="app.mobileNavIsVisible" class="mobile-nav">
      <ul ref="navItems" class="text-headline-3 mobile-nav__primary">
        <li><NuxtLink to="/">Work</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        <li><NuxtLink to="/test">Slug</NuxtLink></li>
      </ul>

      <!-- <div class="cols">
        <BlockRule />
        <div class="col">
          <Text size="caption-1">Social</Text>
        </div>
        <div class="col"></div>
      </div> -->
      <Grid>
        <Column>
          <BlockRule space-above="tiny" space-below="tiny" />
        </Column>
        <Column span="6">
          <Text size="caption-1">Social</Text>
        </Column>
        <Column span="6" element="ul">
          <li><a href="" target="_blank">Instagram</a></li>
          <li><a href="" target="_blank">Twitter</a></li>
          <li><a href="" target="_blank">Are.na</a></li>
          <li><a href="" target="_blank">LinkedIn</a></li>
          <li><a href="" target="_blank">GitHub</a></li>
        </Column>
        <Column>
          <BlockRule space-above="big" space-below="tiny" />
        </Column>
        <Column span="6">
          <Text size="caption-1">Copyright</Text>
        </Column>
        <Column span="6" element="ul">
          <Text size="caption-1">2023-{{ new Date().getFullYear() }}</Text>
        </Column>
        <Space size="huge" />
      </Grid>
    </div>
  </transition>
</template>

<script setup>
import gsap from "gsap";
import { useAppStore } from "~/stores/app";
import { useDeviceStore } from "~/stores/device";

const app = useAppStore();
const navItems = ref(null);

const device = useDeviceStore();

// scroll to close
// watch(
//   () => device.scrollY,
//   (changes, oldValue) => {
//     // only watch if nav is visible
//     if (app.mobileNavIsVisible && changes) {
//       app.setMobileNavVisibility(false);
//     }
//   }
// );

watch(
  () => device.winWidth,
  (windowSize) => {
    if (windowSize >= 600) {
      app.setMobileNavVisibility(false);
    }
  }
);

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getAlternatingX(index) {
  return index % 2 === 0 ? -20 : 20;
}

function getAlternatingRotation(index) {
  return index % 2 === 0 ? -5 : 5;
}

function onEnter(el, done) {
  const timeline = gsap.timeline({ onComplete: done });

  // Initial animation for the nav container
  timeline.fromTo(
    el,
    { height: 0 },
    { ease: "expo.out", duration: 0.3, height: "100lvh" }
  );

  // Staggered animation for the list items with alternating x values
  timeline.fromTo(
    navItems.value.children,
    {
      opacity: 0,
      y: -40,
      // x: (index) => getAlternatingX(index),
      // rotation: (index) => getAlternatingRotation(index),
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "center center",
      stagger: -0.2,
      duration: 0.3,
      ease: "Power2.easeOut",
    },
    "-=0.25" // overlap the end of the previous animation
  );
}
function onLeave(el, done) {
  const timeline = gsap.timeline({ onComplete: done });
  const children = el.querySelectorAll(".mobile-nav__primary li");

  timeline.to(children, {
    opacity: 0,
    // y: -40,
    stagger: -0.1,
    duration: 0.3,
    ease: "Power2.easeOut",
  });

  timeline.to(
    el,
    {
      ease: "Power2.easeOut",
      duration: 0.3,
      opacity: 0,
      height: 0,
      onComplete: done,
    },
    "-=0"
  );
}
</script>

<style lang="scss" scoped>
@import "~/assets/styles/grid";

.mobile-nav {
  overflow-y: auto;
  height: 100%;
}

.mobile-nav__primary {
  margin: 0;
  padding-top: var(--small);
  padding-bottom: var(--small);
  display: flex;
  flex-direction: column;
  height: 80%;
  gap: $grid-gap;
  overflow: hidden;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 1;
    opacity: 0;

    &:has(.router-link-active) {
      a {
        background-color: var(--accent-primary);
        border-radius: 100vw;
        width: 100%;
        padding-top: calc(50% - 20px);
        padding-bottom: calc(50% - 20px);
        animation: flip 20s infinite;
      }
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    background: var(--background-tertiary);
    width: 100%;
    height: 100%;
    border-radius: var(--tinier);

    display: flex;
    justify-content: center;
    align-items: center;
    transition: all var(--transition-fast);
  }
}

@keyframes flip {
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
}
</style>
