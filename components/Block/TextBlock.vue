<template>
  <Grid :class="['content', { '--indented': settings.indent }]" ref="root">
    <Column
      v-if="settings.alignment === 'center'"
      span-laptop="8"
      start-laptop="3"
      span-desktop="6"
      start-desktop="4"
    >
      <PortableText :value="blocks" :components="serializers" />
    </Column>
  </Grid>
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Space from "~/components/Space.vue";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  blocks: {
    type: Object,
    required: true,
  },
  settings: {
    type: Object,
    required: false,
    default: () => ({
      indent: false,
      alignment: "center",
      animation: "enterFade",
    }),
  },
});

const root = ref(null);
defineExpose({
  root,
});

onMounted(() => {
  if (!process.client) return;

  const domParent = root.value?.$el || null;
  const domNodesToAnimate = domParent?.children[0]?.children;

  if (props.settings.animation === "scrollHighlight") {
    if (domNodesToAnimate) {
      Array.from(domNodesToAnimate).forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0.2 }, // Starting state
          {
            opacity: 1,
            duration: 1.5,
            scrollTrigger: {
              trigger: node,
              start: "top 80%",
              toggleActions: "play",
              once: true, // Animation happens only once
              // end: "top 50%",
              // scrub: true, // Smooth animation synced with scroll
              // toggleActions: "play pause reverse pause",
            },
          }
        );
      });
    }
  }
});
const serializers = {
  types: {
    rule: BlockRule,
    media: BlockMedia,
    spacer: Space,
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
