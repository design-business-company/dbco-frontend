<template>
  <div class="content" :class="[{ '--indented': indent }, 'content']">
    <SanityContent :blocks="blocks" :serializers="serializers" />
  </div>
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
import BlockRule from "~/components/Block/Rule.vue";

defineProps({
  blocks: {
    type: Array,
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
  },
  // listItem: BlockCopyListItem,
  // listItem: (props) => {
  //   console.log("BlockCopyListItem props:", props);
  //   return h(BlockCopyListItem, props);
  // },
  styles: {
    // h2, h3, h4, etc
    h1: BlockCopyParagraph,
    h2: BlockCopyParagraph,
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

<style lang="scss" scoped>
// @import "~/assets/styles/grid";

.content {
  &.--indented {
    text-indent: var(--text-indent);
  }
}

.content:deep(ol) {
  list-style-position: outside;
  list-style-type: decimal-leading-zero;
  padding-left: 2em;

  li {
    margin-bottom: 1em;
    display: list-item;

    &::marker {
      color: color-mix(
        in srgb,
        var(--foreground-primary) 50%,
        var(--background-primary) 50%
      );
    }
  }
}

.content:deep(ul) {
  list-style-position: outside;
  list-style-type: disc;
  padding-left: 2em;

  li {
    margin-bottom: 1em;
    display: list-item;

    &::marker {
      color: color-mix(
        in srgb,
        var(--foreground-primary) 50%,
        var(--background-primary) 50%
      );
    }
  }
}

.content:deep(p) {
  + p {
    margin-top: 1em;
  }

  > span {
    display: contents;
  }
}
</style>
