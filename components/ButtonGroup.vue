<template>
  <div v-if="buttons?.length" class="button-group">
    <Button
      v-for="button in buttons"
      as="link"
      :size="button.buttonSize"
      :style="button.buttonStyle"
      :icon="button.iconStyle"
      :to="button.link.slug"
    >
      {{ button.text }}
    </Button>
  </div>
</template>

<script setup>
const props = defineProps({
  buttons: {
    type: Array,
    required: false,
    default: () => [],
  },
});

defineOptions({
  inheritAttrs: false,
});
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
