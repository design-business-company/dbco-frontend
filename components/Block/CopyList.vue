<template>
  <div v-if="listItem" class="text-body-2">
    <component :is="listType">
      <slot />
    </component>
  </div>
</template>

<script setup>
const props = defineProps({
  listItem: {
    type: String,
    required: true,
  }
})

const { listItem } = toRefs(props);

const listType = computed(() => {
  return listItem.value === "bullet"
    ? "ul"
    : listItem.value === "number"
    ? "ol"
    : "div";
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
ul,
ol {
  padding-left: 1em;
}

ul {
  list-style-type: disc;
}

ol {
  list-style-type: decimal;
}
</style>
