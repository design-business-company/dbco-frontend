<template>
  <div style="display: grid">
    <Space :size="spaceAbove.size || spaceAbove" />
    <Column>
      <hr class="rule" />
    </Column>
    <Space :size="spaceAbove.size || spaceBelow" />
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

const { spaceAbove, spaceBelow } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss">
.rule {
  border-color: var(--background-secondary);
  transition: border-color var(--transition);
  // transition-delay: var(--transition-page-delay);
}
</style>
