<template>
  <SanityContent :blocks="blocks" :serializers="serializers" />
</template>

<script setup>
import { h } from "vue";
import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";
import BlockCopyLinkInternal from "~/components/Block/CopyLinkInternal.vue";
import BlockCopyCode from "~/components/Block/CopyCode.vue";
import BlockCopyUnderline from "~/components/Block/CopyUnderline.vue";
import BlockCopyHighlight from "~/components/Block/CopyHighlight.vue";
import BlockCopyStrike from "~/components/Block/CopyStrike.vue";
import BlockCopyParagraph from "~/components/Block/CopyParagraph.vue";
import BlockCopyList from "~/components/Block/CopyList.vue";
import BlockCopyListItem from "~/components/Block/CopyListItem.vue";

defineProps({
  blocks: Array,
});

const serializers = {
  types: {
    // list: BlockCopyList,
    // listItem: BlockCopyListItem,
  },
  styles: {
    // h2, h3, h4, etc
    normal: BlockCopyParagraph,
  },
  marks: {
    link: BlockCopyLinkExternal,
    internalLink: BlockCopyLinkInternal,
    code: BlockCopyCode,
    underline: BlockCopyUnderline,
    highlight: BlockCopyHighlight,
    "strike-through": BlockCopyStrike,
    fontSize: ({ value }, { slots }) => {
      return h("span", { class: value?.class || "" }, slots.default?.());
    },
  },
};
</script>

<style lang="scss" scoped>
// .content:deep(span) {
//   display: inline;
// }
</style>
