<template>
  <PortableText
    :value="value"
    :components="serializers"
  />
</template>

<script setup>
import { h } from "vue";
import { PortableText } from "@portabletext/vue";
import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";
import BlockCopyLinkInternal from "~/components/Block/CopyLinkInternal.vue";
import BlockCopyCode from "~/components/Block/CopyCode.vue";
import BlockCopyUnderline from "~/components/Block/CopyUnderline.vue";
import BlockCopyHighlight from "~/components/Block/CopyHighlight.vue";
import BlockHypertextSpan from "~/components/Block/HypertextSpan.vue";
import BlockCopyStrike from "~/components/Block/CopyStrike.vue";
import BlockCopyParagraph from "~/components/Block/CopyParagraph.vue";
import BlockCopyList from "~/components/Block/CopyList.vue";
import BlockTextHeading from "~/components/Block/TextHeading.vue";
import BlockTextColumns from "~/components/Block/TextColumns.vue";
import BlockRule from "~/components/Block/Rule.vue";
import BlockMedia from "~/components/Block/Media.vue";
import BlockButtonGroup from "~/components/ButtonGroup.vue";
import Space from "~/components/Space.vue";

const props = defineProps({
  value: {
    type: Array,
    required: true,
  },
  // Used to render simple rich text (disregards style and just renders the text)
  simple: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const { value, simple } = toRefs(props);

const serializers = {
  types: {
    span: (props, { slots }) => {
      return h('span', { ...props }, slots.default?.());
    },
    rule: BlockRule,
    media: BlockMedia,
    spacer: Space,
    textHeading: ({ value }, { slots }) => {
      return h(BlockTextHeading, {...value}, slots.default)
    },
    textColumns: ({ value }) => {
      return h(BlockTextColumns, {...value } )
    },
    buttonGroup: BlockButtonGroup,
  },
  list: {
    bullet: BlockCopyList,
    number: BlockCopyList,
  },
  block: ({ value }, { slots }) => {
    return h(BlockCopyParagraph, { ...value, simple: simple.value }, slots.default)
  },
  marks: {
    link: BlockCopyLinkExternal,
    internalLink: BlockCopyLinkInternal,
    code: BlockCopyCode,
    underline: BlockCopyUnderline,
    highlight: BlockCopyHighlight,
    hypertextSpan: BlockHypertextSpan,
    "strike-through": BlockCopyStrike,
    fontSize: (props, { slots }) => {
      return h("span", { class: props?.class || "" }, slots.default?.());
    },
  },
};
</script>