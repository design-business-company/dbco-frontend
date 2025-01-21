<template>
  <div v-if="row" v-for="singleRow in row" class="text-columns">
    <BlockTextBody
      class="text-column col-left"
      :blocks="singleRow.leftColumn.text"
    />
    <BlockTextBody
      class="text-column col-right"
      :blocks="singleRow.rightColumn.text"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
});

const { row } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.text-columns {
  width: 100%;
  margin-top: var(--big);
  text-indent: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: baseline;

  > * {
    width: 100%;

    &:first-child {
      color: var(--foreground-secondary);
    }
  }

  .col-right {
    > *:first-child {
      margin-top: var(--tiny);
    }
  }

  @include tablet {
    gap: var(--grid-gap);
    display: flex;
    flex-direction: row;
  }
}
</style>
