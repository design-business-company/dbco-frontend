<template>
  <Column :style="spaceStyle" class="space" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

// Define props
const props = defineProps({
  size: {
    type: String,
    default: "small",
  },
  sizeMobile: String,
  sizePhablet: String,
  sizeTablet: String,
  sizeLaptop: String,
  sizeDesktop: String,
  sizeUltrawide: String,
});

// Define the breakpoint hierarchy with proper typing
const breakpointHierarchy = [
  { name: "mobile", prop: "sizeMobile" },
  { name: "phablet", prop: "sizePhablet" },
  { name: "tablet", prop: "sizeTablet" },
  { name: "laptop", prop: "sizeLaptop" },
  { name: "desktop", prop: "sizeDesktop" },
  { name: "ultrawide", prop: "sizeUltrawide" },
] as const;

// Compute spaceStyle with cascading sizes
const spaceStyle = computed(() => {
  const style: Record<string, string> = {
    "--margin-top": `var(--${props.size})`, // Default size
  };

  let previousValue = props.size; // Start with the default size

  breakpointHierarchy.forEach(({ name, prop }) => {
    const value = props[prop as keyof typeof props] || previousValue;
    style[`--${name}-margin-top`] = `var(--${value})`;
    previousValue = value; // Update the previous value for cascading
  });

  return style;
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins";

.space {
  margin-top: var(--margin-top);

  // Apply breakpoint-specific styles
  @include mobile {
    margin-top: var(--mobile-margin-top, var(--margin-top));
  }
  @include phablet {
    margin-top: var(--phablet-margin-top, var(--margin-top));
  }
  @include tablet {
    margin-top: var(--tablet-margin-top, var(--margin-top));
  }
  @include laptop {
    margin-top: var(--laptop-margin-top, var(--margin-top));
  }
  @include desktop {
    margin-top: var(--desktop-margin-top, var(--margin-top));
  }
  @include ultrawide {
    margin-top: var(--ultrawide-margin-top, var(--margin-top));
  }
}
</style>
