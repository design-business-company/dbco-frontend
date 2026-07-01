<template>
  <Column :style="spaceStyle" class="space" />
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

// Define props
const props = defineProps({
  size: {
    type: String,
    default: "small", // Default size
  },
  sizeMobile: String,
  sizePhablet: String,
  sizeTablet: String,
  sizeLaptop: String,
  sizeDesktop: String,
  sizeUltrawide: String,
});

// Add type for attrs
const attrs = useAttrs() as { value: { size?: string } };

// Determine the effective size by prioritizing props and falling back to $attrs.value.size
const effectiveSize = computed(() => {
  let size = props.size;

  // portable text passes 'size' as an attribute
  if (attrs.value && attrs.value.size) {
    size = attrs.value.size;
  }

  return size;
});

// Define the breakpoint hierarchy
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
    "--margin-top": `var(--${effectiveSize.value})`, // Default size
  };

  let previousValue = effectiveSize.value; // Start with the default size

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
  height: var(--margin-top);

  // Apply breakpoint-specific styles
  @include mobile {
    height: var(--mobile-margin-top, var(--margin-top));
  }
  @include phablet {
    height: var(--phablet-margin-top, var(--margin-top));
  }
  @include tablet {
    height: var(--tablet-margin-top, var(--margin-top));
  }
  @include laptop {
    height: var(--laptop-margin-top, var(--margin-top));
  }
  @include desktop {
    height: var(--desktop-margin-top, var(--margin-top));
  }
  @include ultrawide {
    height: var(--ultrawide-margin-top, var(--margin-top));
  }
}
</style>
