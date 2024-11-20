<template>
  <div 
    v-if="items?.length" 
    class="spotlight-media"
    :style="{
      '--grid-cols': items.length,
    }"
  >
    <div class="spotlight-media__container">
      <BlockMedia v-for="item in items" :key="item._key" :media="item" />
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
</script>

<style lang="scss" scoped>
.spotlight-media {
  width: 100%;

  &__container {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    gap: $grid-gap;
  }
}
</style>
