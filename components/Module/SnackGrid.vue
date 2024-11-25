<template>
  <div class="snack-grid">
    <div v-for="(item, index) in items" :key="`${index}-${item._key}`" class="snack-grid__item">
      <Text element="h3" size="micro" class="snack-grid__title">{{ item.title }}</Text>
      <div class="snack-grid__media">
        <BlockMedia :media="item.media?.[0]" />
      </div>
      <div class="snack-grid__description text-caption-2">
        <SanityContent v-if="item.shortDescription" :blocks="item.shortDescription.text" />
      </div>
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

console.log(props.items);
</script>

<style lang="scss">
.snack-grid {
  padding-inline: $grid-margin;
  padding-block: var(--biggest);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--grid-gap);
  row-gap: var(--smaller);

  @include tablet {
    grid-template-columns: repeat(4, 1fr);
  }

  @include laptop {
    grid-template-columns: repeat(6, 1fr);
    row-gap: var(--bigger);
  }

  &__title {
    padding-block: var(--tinier);
  }

  &__media {
    width: 100%;
    height: auto;

    .media {
      width: 100%;
      height: 100%;
    }
  }

  &__description {
    padding-right: var(--smallest);
    padding-top: var(--tinier);
    
    a {
      color: inherit;
    }
  }

}
</style>