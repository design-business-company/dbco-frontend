<template>
  <Grid class="hypertext">
    <Column span="12" span-tablet="10">
      <SanityContent :blocks="blocks" :serializers="serializers" />
    </Column>
  </Grid>
</template>

<script setup>
import { markRaw } from "vue";
import BlockHypertextSpan from "@/components/Block/HypertextSpan.vue";

// Props
const props = defineProps({
  blocks: {
    type: Array,
    required: true,
  },
});

// Data for serializers
const serializers = {
  marks: {
    hypertextSpan: markRaw(BlockHypertextSpan),
  },
};
</script>

<style lang="scss">
.hypertext p {
  text-indent: var(--text-indent);
  margin-bottom: 1em;

  .hypertext__span {
    text-indent: 0;
  }
}
</style>
