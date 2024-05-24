<template>
  <Grid>
    <Space :size="spaceAbove" />
    <Column>
      <hr class="rule" />
    </Column>
    <Space :size="spaceAbove" />
  </Grid>
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
  border-color: var(--foreground-primary);
  transition: border-color var(--transition);
  transition-delay: var(--transition-page-delay);
}
</style>
