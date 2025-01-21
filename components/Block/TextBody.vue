<template>
  <div :class="['content']">
    <CustomPortableText :value="blocks" />
  </div>
</template>

<script setup>
const props = defineProps({
  blocks: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.content {
  :deep(.text-body-1) {
    max-width: 40ch;
    margin-bottom: var(--smallest);
  }

  &.--indented {
    text-indent: var(--text-indent);
  }

  @include laptop {
    :deep(.text-body-1) {
      max-width: 60ch;
    }
  }
}
</style>
