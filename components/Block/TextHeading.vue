<template>
  <Text :size="$attrs.value.size" element="div">
    <PortableText :value="$attrs.value.text" :components="serializers" />
  </Text>
</template>

<script setup>
import { PortableText } from "@portabletext/vue";
import BlockCopyHeading from "~/components/Block/CopyHeading.vue";

const serializers = {
  blocks: {
    normal: BlockCopyHeading,
  },
};
</script>
