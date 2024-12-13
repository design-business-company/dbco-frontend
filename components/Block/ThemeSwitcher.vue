<template>
  <div class="theme-switcher" ref="themePickerRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores/app";
import { useTheme } from "~/composables/useTheme";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEventBus } from "~/composables/useEventBus";

gsap.registerPlugin(ScrollTrigger);

const { setTheme } = useTheme();
const { routeIsTransitioning } = storeToRefs(useAppStore());

// Global theme stack to track the current and previous themes
const themeStack = ref([]);

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

const scrollTriggerRef = ref(null);

const processedTheme = computed(() => {
  return {
    theme: props.theme,
    background: props.backgroundPrimary?.hex,
    foreground: props.foregroundPrimary?.hex,
    accent: props.accentPrimary?.hex,
  };
});

watch(
  () => routeIsTransitioning.value,
  (newVal) => {
    if (!newVal) {
      // setupScrollTrigger();
    }
  }
);

// wait for  page mounts...
// in nuxt, children mount before parents (pages)
const { on } = useEventBus();
const pageHasMounted = ref(false);

on("page::mounted", () => (pageHasMounted.value = true));

watch(
  () => pageHasMounted.value,
  (newValue) => {
    if (newValue) {
      setupScrollTrigger();
    }
  }
);

const setupScrollTrigger = () => {
  destroyScrollTrigger();

  scrollTriggerRef.value = gsap.from(themePickerRef.value, {
    scrollTrigger: {
      trigger: themePickerRef.value,
      start: `top ${props.settings.percent}%`,
      end: `bottom ${props.settings.percent}%`,
      toggleActions: "play none none none",
      // markers: true,
      onEnter: () => {
        themeStack.value.push(processedTheme.value);
        setTheme(processedTheme.value);
      },
      onLeave: () => {
        themeStack.value.pop();
        if (themeStack.value.length > 0) {
          setTheme(themeStack.value[themeStack.value.length - 1]);
        }
      },
      onEnterBack: () => {
        themeStack.value.push(processedTheme.value);
        setTheme(processedTheme.value);
      },
      onLeaveBack: () => {
        themeStack.value.pop();
        if (themeStack.value.length > 0) {
          setTheme(themeStack.value[themeStack.value.length - 1]);
        }
      },
    },
  });
};

onUnmounted(() => {
  destroyScrollTrigger();
});

const destroyScrollTrigger = () => {
  if (!scrollTriggerRef.value) return;
  scrollTriggerRef.value.scrollTrigger?.kill();
  scrollTriggerRef.value = null;
};
</script>

<!-- <style lang="scss">
.theme-switcher {
  top: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin-top: -1px;
}
</style> -->
