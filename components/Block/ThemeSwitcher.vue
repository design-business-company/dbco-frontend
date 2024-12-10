<template>
  <div aria-hidden="true" class="theme-switcher" ref="themePickerRef"></div>
</template>

<script setup>
import { defaultThemes } from "~/composables/useTheme";
import { useTheme } from "~/composables/useTheme";
import { useIntersectionObserver } from "@vueuse/core";

const { setTheme, getProcessedTheme } = useTheme();

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

const processedTheme = computed(() => getProcessedTheme(props));

const { stop } = useIntersectionObserver(themePickerRef, ([entry]) => {
  if (entry.isIntersecting) {
    setTheme(processedTheme.value);
  }
}, {
  threshold: 0.01,
  rootMargin: `-${props.settings.percent}% 0px -${props.settings.percent}% 0px`,
})
  
onBeforeUnmount(() => {
  stop();
})
</script>

<style lang="scss">
.theme-switcher {
  top: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin-top: -1px;
}
</style>
