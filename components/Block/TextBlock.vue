<template>
  <div class="content" :class="[{ '--indented': indent }, 'content']">
    <PortableText :value="blocks" :components="serializers" />
  </div>
</template>

<script setup>
import { PortableText } from "@portabletext/vue";
import { h } from "vue";

import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";
import BlockCopyLinkInternal from "~/components/Block/CopyLinkInternal.vue";
import BlockCopyCode from "~/components/Block/CopyCode.vue";
import BlockCopyUnderline from "~/components/Block/CopyUnderline.vue";
import BlockCopyHighlight from "~/components/Block/CopyHighlight.vue";
import BlockCopyStrike from "~/components/Block/CopyStrike.vue";
import BlockCopyParagraph from "~/components/Block/CopyParagraph.vue";
import BlockCopyList from "~/components/Block/CopyList.vue";
import BlockTextHeading from "~/components/Block/TextHeading.vue";
import BlockRule from "~/components/Block/Rule.vue";
import BlockMedia from "~/components/Block/Media.vue";

defineProps({
  blocks: {
    type: Object,
    required: true,
  },
  indent: {
    type: Boolean,
    required: false,
  },
  alignment: {
    type: String,
    default: "center",
  },
});

const serializers = {
  types: {
    rule: BlockRule,
    media: BlockMedia,
    textHeading: BlockTextHeading,
  },
  list: {
    bullet: BlockCopyList,
    number: BlockCopyList,
  },
  block: {
    normal: BlockCopyParagraph,
    "body-1": BlockCopyParagraph,
    "body-2": BlockCopyParagraph,
    h3: BlockCopyParagraph,
    h4: BlockCopyParagraph,
    h5: BlockCopyParagraph,
    h6: BlockCopyParagraph,
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
