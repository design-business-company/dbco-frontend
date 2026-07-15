<template>
  <Text :size="$attrs.value.size" element="div">
    <PortableText :value="$attrs.value.text" :components="serializers" />
  </Text>
</template>

<script setup>
import { h } from "vue";
import { PortableText } from "@portabletext/vue";

// Visual size comes from the wrapping Text class, not the tag — headings
// authored with the "h1" style render as h2 so pages keep a single h1.
const serializers = {
  block: {
    h1: (_, { slots }) => h("h2", slots.default?.()),
  },
};
</script>
