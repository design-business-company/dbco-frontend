<template>
  <div>
    <SanityContent :blocks="blocks" :serializers="serializers" />
  </div>
</template>

<script setup>
import { defineProps, markRaw } from "vue";
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
