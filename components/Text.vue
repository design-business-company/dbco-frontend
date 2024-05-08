<template>
  <component :is="element" :class="`text-${size}`">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from "vue";

type SizeType =
  | "micro"
  | "caption-1"
  | "caption-2"
  | "body-1"
  | "body-2"
  | "headline-1"
  | "headline-2"
  | "headline-3";

const props = defineProps({
  size: {
    type: String as PropType<SizeType>,
    default: "body1",
    validator: (value: SizeType): boolean =>
      [
        "micro",
        "caption-1",
        "caption-2",
        "body-1",
        "body-2",
        "headline-1",
        "headline-2",
        "headline-3",
      ].includes(value),
  },
  element: {
    type: String as PropType<string>,
    default: "p",
  },
});
</script>

<style scoped>
.text-micro {
  font-size: var(--type-micro-size);
  line-height: var(--type-micro-leading);
  letter-spacing: var(--type-micro-tracking);
}

.text-caption-1 {
  font-size: var(--type-caption1-size);
  line-height: var(--type-caption1-leading);
  letter-spacing: var(--type-caption1-tracking);
}

.text-caption-2 {
  font-size: var(--type-caption2-size);
  line-height: var(--type-caption2-leading);
  letter-spacing: var(--type-caption2-tracking);
}

.text-body-1 {
  font-size: var(--type-body1-size);
  line-height: var(--type-body1-leading);
  letter-spacing: var(--type-body1-tracking);
}

.text-body-2 {
  font-size: var(--type-body2-size);
  line-height: var(--type-body2-leading);
  letter-spacing: var(--type-body2-tracking);
}

.text-headline-1 {
  font-size: var(--type-headline1-size);
  line-height: var(--type-headline1-leading);
  letter-spacing: var(--type-headline1-tracking);
}

.text-headline-2 {
  font-size: var(--type-headline2-size);
  line-height: var(--type-headline2-leading);
  letter-spacing: var(--type-headline2-tracking);
}

.text-headline-3 {
  font-size: var(--type-headline3-size);
  line-height: var(--type-headline3-leading);
  letter-spacing: var(--type-headline3-tracking);
}

/* Continue defining other styles */
</style>
