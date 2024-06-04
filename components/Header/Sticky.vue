<template>
  <nav
    ref="nav"
    :class="[
      'sticky-nav',
      { 'nav-is-open': app.mobileNavIsVisible },
      { 'is-hidden': !app.headerIsVisible },
      { 'is-disabled': !app.headerIsVisible && device.winHeight <= 600 },
      { 'is-behind-static-header': device.scrollNearTop },
    ]"
  >
    <Grid class="wrapper">
      <Column
        class="text-body-1"
        span="6"
        tablet-span="4"
        span-laptop="4"
        span-desktop="3"
      >
        <HeaderStickyLogo />
      </Column>

      <Column class="links text-body-1" span="6" tablet-span="6">
        <HeaderStickyLinks class="default-nav" />
        <HeaderMobileNavTrigger
          @click="handleMobileNavClick"
          class="mobile-nav-trigger"
        />
      </Column>

      <Column>
        <HeaderMobileNav />
      </Column>
    </Grid>
    <Debug v-if="isDev" />
  </nav>

  <!--     :class="[
      'sticky-nav',
      { 'is-visible': headerIsVisible },
      { 'is-disabled': !app.headerIsVisible },
      { 'is-behind-static-header': device.scrollNearTop },
      { 'nav-is-open': app.mobileNavIsVisible },
    ]"
  > -->
</template>

<script setup>
import { useDeviceStore } from "~/stores/device";
import { useAppStore } from "~/stores/app";
import { onMounted, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";

const isDev = process.dev;

const app = useAppStore();
const device = useDeviceStore();

const scrollUpThreshold = 5;
const previousScrollY = ref(0);

// watch main window event
const nuxt = useNuxtApp();
const scroll = nuxt.$scroll;
const scrollEl = ref({});

const handleScroll = () => {
  const currentScrollY = scroll.instance.y;

  if (
    device.scrollNearTop ||
    device.scrollAtTop ||
    device.scrollAtBottom ||
    device.scrollNearBottom ||
    app.mobileNavIsVisible
  ) {
    app.setHeaderIsVisible(true);
  } else if (
    currentScrollY < previousScrollY.value - scrollUpThreshold &&
    device.scrollDirection === "up"
  ) {
    app.setHeaderIsVisible(true);
  } else if (
    // currentScrollY > previousScrollY.value + scrollUpThreshold &&
    device.scrollDirection === "down"
  ) {
    console.log("scroll down");
    app.setHeaderIsVisible(false);
  }
};

const handleScrollStop = () => {
  // save this position
  previousScrollY.value = scroll.instance.y;
};

const handleMobileNavClick = () => {
  app.setMobileNavVisibility(!app.mobileNavIsVisible);
};

onMounted(() => {
  scrollEl.value = scroll.instance.el;
  scrollEl.value.addEventListener("scrollY", handleScroll);
  scrollEl.value.addEventListener("scrollStop", handleScrollStop);
});

onUnmounted(() => {
  scrollEl.value.removeEventListener("scrollY", handleScroll);
  scrollEl.value.removeEventListener("scrollStop", handleScrollStop);
});

const nav = ref(null);

onClickOutside(nav, (event) => {
  if (app.mobileNavIsVisible) {
    app.setMobileNavVisibility(false);
  }
});
</script>

<style lang="scss" scoped>
@import "~/assets/styles/mixins";

.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .wrapper {
    transform: translate3d(0, 0, 0);
    background-color: var(--background-primary);
    padding-top: var(--tinier);
    padding-bottom: var(--tinier);
    transition: background-color var(--transition) var(--transition-page-delay),
      color var(--transition) var(--transition-page-delay),
      transform 200ms var(--transition-function);
  }

  &.is-hidden .wrapper {
    transform: translate3d(0, -100%, 0);
  }

  &:hover .wrapper {
    transform: translate3d(0, 0, 0);
  }

  &.is-disabled {
    pointer-events: none;

    .wrapper {
      transform: translate3d(0, -150%, 0);
    }
  }

  &.is-behind-static-header .wrapper {
    @include tablet {
      transform: translate3d(0, -150%, 0);
    }
    // visibility: hidden;
  }

  // &.nav-is-open {
  //   .wrapper {
  //     visibility: visible;
  //     pointer-events: all;
  //     transform: translate3d(0, 0, 0);
  //   }
  // }

  .links {
    display: flex;
  }
}

.mobile-nav-trigger {
  margin-left: auto;
  @include tablet {
    display: none;
  }
}

.default-nav {
  display: none;

  @include tablet {
    display: block;
  }
}
</style>
