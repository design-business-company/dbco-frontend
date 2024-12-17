<template>
  <div class="button-group">
    <Button
      v-for="button in $attrs.value.buttons"
      as="link"
      :style="button.buttonStyle"
      :icon="button.iconStyle"
      :to="button.link.slug"
    >
      {{ button.text }}
    </Button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  gap: var(--grid-gap);
}
</style>
