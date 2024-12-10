<template>
  <Observer
    v-for="row in $attrs.value.row"
    :onEnter="onEnter"
    once
    class="text-columns"
  >
    <!-- BlockTextBody -->
    <!-- <pre>{{ row.leftColumn.text }}</pre> -->
    <BlockTextBody
      class="text-column col-left"
      :blocks="row.leftColumn.text[0]"
    />
    <BlockTextBody
      class="text-column col-right"
      :blocks="row.rightColumn.text[0]"
    />
  </Observer>
</template>

<script setup>
import gsap from "gsap";

const onEnter = (ev) => {
  const nodes = ev.children;

  gsap.fromTo(
    nodes,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      delay: 0.25,
      duration: 1,
    }
  );
};
</script>

<style lang="scss" scoped>
.text-columns {
  width: 100%;
  margin-top: var(--big);
  text-indent: 0 !important;

  > * {
    width: 100%;
    opacity: 0;

    &:first-child {
      color: var(--foreground-secondary);
    }
  }

  @include tablet {
    gap: var(--grid-gap);
    display: flex;
  }
}
</style>
