<template>
  <div v-for="row in $attrs.value.row" class="text-columns">
    <BlockTextBody
      class="text-column col-left"
      :blocks="row.leftColumn.text[0]"
    />
    <BlockTextBody
      class="text-column col-right"
      :blocks="row.rightColumn.text[0]"
    />
  </div>
</template>

<script setup></script>

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
