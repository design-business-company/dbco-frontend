<template>
  <div v-if="$attrs.value.listItem">
    <component :is="listType">
      <slot />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    listType() {
      const listItemType = this.$attrs.value.listItem;
      return listItemType === "bullet"
        ? "ul"
        : listItemType === "number"
        ? "ol"
        : "div";
    },
  },
};
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
