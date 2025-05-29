<template>
  <div class="button-group">
    <Button
      v-for="button in $attrs.value.buttons"
      as="link"
      :size="button.buttonSize"
      :style="button.buttonStyle"
      :icon="button.iconStyle"
      :to="button.link.slug === '/' ? '/' : `/${button.link.slug}`"
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
  flex-direction: column;
  gap: var(--grid-gap);
  margin: var(--smaller) 0;

  @include phablet {
    flex-direction: row;

    > * {
      flex: 1;
    }
  }

  @include tablet {
    > * {
      flex: none;
    }
  }
}
</style>
