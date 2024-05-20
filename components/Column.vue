<template>
  <component :is="element" :style="styleObject" class="column">
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  element: {
    type: String,
    default: "div",
  },
  span: String,
  spanMobile: String,
  startMobile: String,
  spanPhablet: String,
  startPhablet: String,
  spanTablet: String,
  startTablet: String,
  spanLaptop: String,
  startLaptop: String,
  spanDesktop: String,
  startDesktop: String,
  spanUltrawide: String,
  startUltrawide: String,
  style: Object,
});

// Helper function to compute grid-column value
const setGridColumn = (start, span) => {
  return start ? `${start} / span ${span}` : `span ${span}`;
};

// Compute the style object with default and responsive settings
const styleObject = computed(() => {
  let lastSpan = props.span || "12";
  let lastStart = undefined;

  const styles = {
    "--grid-column": setGridColumn(undefined, lastSpan),
  };

  const breakpoints = [
    { key: "mobile", span: "spanMobile", start: "startMobile" },
    { key: "phablet", span: "spanPhablet", start: "startPhablet" },
    { key: "tablet", span: "spanTablet", start: "startTablet" },
    { key: "laptop", span: "spanLaptop", start: "startLaptop" },
    { key: "desktop", span: "spanDesktop", start: "startDesktop" },
    { key: "ultrawide", span: "spanUltrawide", start: "startUltrawide" },
  ];

  breakpoints.forEach(({ key, span, start }) => {
    const bpSpan = props[span];
    const bpStart = props[start];

    lastSpan = bpSpan || lastSpan;
    lastStart = bpStart || lastStart;

    styles[`--${key}-grid-column`] = setGridColumn(lastStart, lastSpan);
  });

  if (props.style) {
    Object.assign(styles, props.style);
  }

  return styles;
});
</script>

<style scoped lang="scss">
@import "~/assets/styles/mixins";

.column {
  grid-column: var(--grid-column); // Use general settings

  @include mobile {
    grid-column: var(--mobile-grid-column, var(--grid-column));
  }
  @include phablet {
    grid-column: var(--phablet-grid-column, var(--grid-column));
  }
  @include tablet {
    grid-column: var(--tablet-grid-column, var(--grid-column));
  }
  @include laptop {
    grid-column: var(--laptop-grid-column, var(--grid-column));
  }
  @include desktop {
    grid-column: var(--desktop-grid-column, var(--grid-column));
  }
  @include ultrawide {
    grid-column: var(--ultrawide-grid-column, var(--grid-column));
  }
}
</style>
