<template>
  <Column :style="spaceStyle" class="space" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

// Define props with default and other size props
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

// Compute the spaceStyle to apply styles dynamically based on props
const spaceStyle = computed(() => {
  const style: Record<string, string> = {
    marginTop: `var(--${props.size})`, // Default margin-top based on size prop
  };

  const breakpoints = [
    { name: "mobile", prop: props.sizeMobile },
    { name: "phablet", prop: props.sizePhablet },
    { name: "tablet", prop: props.sizeTablet },
    { name: "laptop", prop: props.sizeLaptop },
    { name: "desktop", prop: props.sizeDesktop },
    { name: "ultrawide", prop: props.sizeUltrawide },
  ];

  // Set CSS variables for breakpoints dynamically
  breakpoints.forEach((bp) => {
    if (bp.prop) {
      style[`--${bp.name}-margin-top`] = `var(--${bp.prop})`;
    }
  });

  return style;
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins";

.space {
  margin-top: var(--margin-top);

  /* You can also apply breakpoint-specific styles using mixins if needed */
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
