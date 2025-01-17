<template>
  <nav
    ref="nav"
    :class="[
      'sticky-nav',
      { 'is-hidden': !app.headerIsVisible },
      { 'is-disabled': !app.headerIsVisible && device.winHeight <= 600 },
      { 'is-behind-static-header': isHydrated && device.scrollNearTop },
    ]"
    data-lenis-prevent
  >
    <Grid class="wrapper">
      <Column
        class="logo text-body-1"
        span="6"
        span-laptop="4"
        span-desktop="3"
      >
        <HeaderStickyLogo />
      </Column>

      <Column
        class="trigger text-body-1"
        span="6"
        span-laptop="4"
        span-desktop="9"
      >
        <HeaderStickyLinks :links="links" class="default-nav" />
        <HeaderMobileNavTrigger
          @click="handleMobileNavClick"
          class="mobile-nav-trigger"
        />
      </Column>
    </Grid>
    <HeaderMobileNav />
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useDeviceStore } from "~/stores/device";
import { useAppStore } from "~/stores/app";
import { onClickOutside } from "@vueuse/core";
import * as focusTrap from "focus-trap";

const props = defineProps({
  links: {
    type: Array,
    required: true,
  },
});

const nav = ref(null);
const app = useAppStore();
const device = useDeviceStore();
const isHydrated = ref(false);
const lenis = useLenis();
let trapInstance = null;

watch(
  () => app.mobileNavIsVisible,
  (navIsVisible) => {
    if (navIsVisible) {
      enableFocusTrap();
      disableBodyScroll();
    } else {
      disableFocusTrap();
      enableBodyScroll();
    }
  }
);

watch(
  () => device.winWidth,
  (windowSize) => {
    if (windowSize >= 600) {
      app.setMobileNavVisibility(false);
    }
  }
);

function enableFocusTrap() {
  if (nav.value) {
    trapInstance = focusTrap.createFocusTrap(nav.value, {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
    });
    trapInstance.activate();
  }
}

function disableFocusTrap() {
  if (trapInstance) {
    trapInstance.deactivate();
    trapInstance = null;
  }
}

function enableBodyScroll() {
  lenis.instance.value.isStopped = false;
}

function disableBodyScroll() {
  lenis.instance.value.isStopped = true;
}

const scrollUpThreshold = 10;
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
    // currentScrollY < previousScrollY.value - scrollUpThreshold &&
    device.scrollDirection === "up"
  ) {
    app.setHeaderIsVisible(true);
  } else if (
    // currentScrollY > previousScrollY.value + scrollUpThreshold &&
    device.scrollDirection === "down"
  ) {
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
  nextTick(() => {
    isHydrated.value = true;
  });
  scrollEl.value = scroll.instance.el;
  scrollEl.value.addEventListener("scrollY", handleScroll);
  scrollEl.value.addEventListener("scrollStop", handleScrollStop);
});

onUnmounted(() => {
  scrollEl.value.removeEventListener("scrollY", handleScroll);
  scrollEl.value.removeEventListener("scrollStop", handleScrollStop);
});

onClickOutside(nav, (event) => {
  if (app.mobileNavIsVisible) {
    app.setMobileNavVisibility(false);
  }
});
</script>

<style lang="scss" scoped>
.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;

  .wrapper {
    visibility: visible;
    pointer-events: all;
    transform: translate3d(0, 0, 0);
    will-change: transform, background-color;
    transition: transform 400ms var(--transition-function),
      background-color var(--transition);
    background-color: var(--background-primary);
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
      transform: translate3d(0, -125%, 0);
    }
  }

  &.is-behind-static-header {
    @include tablet {
      pointer-events: none;

      .wrapper {
        transform: translate3d(0, -100%, 0);
      }
    }
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
