<template>
  <div
    v-if="items?.length"
    class="spotlight-media"
    :style="{
      '--grid-cols': items.length,
    }"
  >
    <div
      class="spotlight-media__container"
      :class="[{ 'full-width': items.length <= 1 }]"
    >
      <BlockMedia
        v-for="item in items"
        :key="item._key"
        :media="item"
        :sizes="sizes"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const { items } = toRefs(props);

const sizes = computed(() => {
  return `(max-width: 1024px) 100vw, ${100 / (items.value?.length ?? 1)}vw`
})
</script>

<style lang="scss" scoped>
.spotlight-media {
  width: 100%;
  padding-inline: var(--grid-margin);

  &__container {
    display: grid;
    gap: var(--tinier);

    &.full-width {
      grid-template-columns: repeat(1, 1fr);
    }

    @include laptop {
      grid-template-columns: repeat(2, 1fr);
    }

    @include desktop {
      grid-template-columns: repeat(var(--grid-cols), 1fr);
    }
  }
}
</style>
