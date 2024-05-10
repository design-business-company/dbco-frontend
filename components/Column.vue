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
  span: String, // General span, applies if no specific breakpoint spans are set
  mobileSpan: String,
  mobileStart: String,
  phabletSpan: String,
  phabletStart: String,
  tabletSpan: String,
  tabletStart: String,
  laptopSpan: String,
  laptopStart: String,
  desktopSpan: String,
  desktopStart: String,
  ultrawideSpan: String,
  ultrawideStart: String,
  style: Object,
});

// Helper function to compute grid-column value
const setGridColumn = (start, span) => {
  return start ? `${start} / span ${span}` : `span ${span}`;
};

// Compute the style object with default and responsive settings
const styleObject = computed(() => {
  // Default to full width if no general span is provided
  let lastSpan = props.span || "12";
  let lastStart = undefined;

  const styles = {
    "--grid-column": setGridColumn(undefined, lastSpan), // Set general grid-column
  };

  // List of breakpoints in order
  const breakpoints = [
    "mobile",
    "phablet",
    "tablet",
    "laptop",
    "desktop",
    "ultrawide",
  ];
  breakpoints.forEach((bp) => {
    const bpSpan = props[`${bp}Span`];
    const bpStart = props[`${bp}Start`];

    // Update lastSpan/lastStart if new values are provided
    lastSpan = bpSpan || lastSpan;
    lastStart = bpStart || lastStart;

    // Set CSS variables for each breakpoint
    styles[`--${bp}-grid-column`] = setGridColumn(lastStart, lastSpan);
  });

  // Merge additional inline styles provided through props
  if (props.style) {
    Object.assign(styles, props.style);
  }

  return styles;
});
</script>

<style scoped lang="scss">
@import "~/assets/styles/mixins"; // Ensure you have mixins for responsive behavior

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
