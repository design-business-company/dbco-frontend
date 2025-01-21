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
});

const { value } = toRefs(props);

const serializers = {
  types: {
    rule: BlockRule,
    media: BlockMedia,
    spacer: Space,
    textHeading: BlockTextHeading,
    textColumns: BlockTextColumns,
    buttonGroup: BlockButtonGroup,
  },
  list: {
    bullet: BlockCopyList,
    number: BlockCopyList,
  },
  block: ({ value }, { slots }) => {
    return h(
      BlockCopyParagraph,
      { ...value },
      slots.default?.()
    )
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