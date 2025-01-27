<template>
  <Text element="div" size="micro" class="caption">
    <SanityContent :blocks="caption" :serializers="serializers" />
  </Text>
</template>

<script setup>
import BlockCopyCode from "~/components/Block/CopyCode.vue";

const props = defineProps({
  caption: {
    type: Array,
    required: true,
  },
});

const serializers = {
  marks: {
    code: BlockCopyCode,
  },
};
</script>

<style lang="scss" scoped>
.caption {
  max-width: 60ch;
  text-indent: 0;
  color: var(--foreground-secondary);
}
</style>
