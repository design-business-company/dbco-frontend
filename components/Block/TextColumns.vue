<template>
  <Observer
    v-for="row in $attrs.value.row"
    :onEnter="onEnter"
    once
    class="text-columns"
  >
    <PortableText
      class="text-column col-left"
      :value="row.leftColumn.text[0].text || row.leftColumn.text"
      :components="serializers"
    />
    <PortableText
      class="text-column col-right"
      :value="row.rightColumn.text[0].text || row.rightColumn.text"
      :components="serializers"
    />
  </Observer>
</template>

<script setup>
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
import gsap from "gsap";

const serializers = {
  types: {
    rule: BlockRule,
    media: BlockMedia,
    textHeading: BlockTextHeading,
    textColumns: BlockTextColumns,
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
  },
};

const onEnter = (ev) => {
  const nodes = ev.children;

  gsap.fromTo(
    nodes,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      delay: 0.25,
      duration: 1,
    }
  );
};
</script>

<style lang="scss" scoped>
.text-columns {
  width: 100%;
  margin-top: var(--big);

  > * {
    width: 100%;
    opacity: 0;

    &:first-child {
      color: var(--foreground-secondary);
    }
  }

  @include tablet {
    gap: var(--grid-gap);
    display: flex;
  }
}
</style>
