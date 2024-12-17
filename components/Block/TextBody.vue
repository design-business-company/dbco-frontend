<template>
  <div :class="['content']">
    <PortableText :value="blocks" :components="serializers" />
  </div>
</template>

<script setup>
import { PortableText } from "@portabletext/vue";
import { h, ref } from "vue";

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
import Space from "~/components/Space.vue";
import BlockButtonGroup from "~/components/ButtonGroup.vue";

const props = defineProps({
  blocks: {
    type: Object,
    required: true,
  },
});

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
  block: {
    normal: BlockCopyParagraph,
    "body-1": BlockCopyParagraph,
    "body-2": BlockCopyParagraph,
    "caption-1": BlockCopyParagraph,
    "caption-2": BlockCopyParagraph,
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
