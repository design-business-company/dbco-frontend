<template>
  <div style="display: grid">
    <Space :size="spaceAbove.size" />
    <Column>
      <hr class="rule" />
    </Column>
    <Space :size="spaceAbove.size" />
  </div>
</template>

<script setup>
const props = defineProps({
  spaceAbove: {
    required: false,
    default: "smallest",
  },
  spaceBelow: {
    required: false,
    default: "smallest",
  },
});
</script>

<style lang="scss">
.rule {
  border-color: color-mix(
    in srgb,
    var(--foreground-primary) 30%,
    var(--background-primary) 70%
  );
  transition: border-color var(--transition);
  transition-delay: var(--transition-page-delay);
}
</style>
