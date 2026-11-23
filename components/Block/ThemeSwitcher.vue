<template>
  <div class="theme-switcher" ref="themePickerRef">
    <slot></slot>
  </div>
</template>

<script>
/*
 * Shared across every ThemeSwitcher on the page (module scope — a ref inside
 * <script setup> would be per-instance).
 *
 * The active theme is derived from scroll position, never from enter/leave
 * history: it is the theme of the last switcher whose start line has been
 * scrolled past, or the page theme when none has. That makes the result
 * identical whatever the scroll speed, direction or callback order.
 */
const switchers = new Set();
let themeApi = null;

const resolveTheme = () => {
  if (!themeApi) return;

  let winner = null;
  switchers.forEach((entry) => {
    const { st } = entry;
    if (st.scroll() < st.start) return;
    // >= so that, on a tie, the switcher later in the document wins
    if (!winner || st.start >= winner.st.start) winner = entry;
  });

  if (winner) {
    themeApi.setTheme(winner.getTheme());
  } else {
    themeApi.resetTheme();
  }
};
</script>

<script setup>
import { ref } from "vue";
import { useTheme } from "~/composables/useTheme";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// client only: module scope is shared across requests on the server
if (import.meta.client) themeApi = useTheme();

const props = defineProps({
  theme: {
    type: String,
    required: false,
  },
  backgroundPrimary: {
    type: Object,
    required: false,
  },
  foregroundPrimary: {
    type: Object,
    required: false,
  },
  accentPrimary: {
    type: Object,
    required: false,
  },
  settings: {
    type: Object,
    required: false,
    default: () => ({
      percent: 50,
    }),
  },
});

const themePickerRef = ref(null);

const processedTheme = computed(() => {
  return {
    theme: props.theme,
    backgroundPrimary: props.backgroundPrimary,
    foregroundPrimary: props.foregroundPrimary,
    accentPrimary: props.accentPrimary,
  };
});

let entry = null;

onMounted(() => {
  setupScrollTrigger();
});

const setupScrollTrigger = () => {
  destroyScrollTrigger();

  const st = ScrollTrigger.create({
    trigger: themePickerRef.value,
    start: `top ${props.settings.percent}%`,
    end: `bottom ${props.settings.percent}%`,
    // markers: true,
    onEnter: resolveTheme,
    onLeave: resolveTheme,
    onEnterBack: resolveTheme,
    onLeaveBack: resolveTheme,
    // layout shifts / resizes move the start lines
    onRefresh: resolveTheme,
  });

  entry = { st, getTheme: () => processedTheme.value };
  switchers.add(entry);

  // covers mounting already scrolled past the start (e.g. reload mid-page)
  resolveTheme();
};

onUnmounted(() => {
  destroyScrollTrigger();
});

// Deliberately does not re-resolve: on a route change the incoming page has
// already applied its own page theme, and an outgoing switcher must not
// overwrite it.
const destroyScrollTrigger = () => {
  if (!entry) return;
  switchers.delete(entry);
  entry.st.kill();
  entry = null;
};
</script>
