<template>
  <component :is="element" class="grid">
    <!-- Placeholder for Column components -->
    <slot></slot>
  </component>
</template>

<script setup>
const props = defineProps({
  element: {
    type: String,
    default: "div",
  },
});
</script>
