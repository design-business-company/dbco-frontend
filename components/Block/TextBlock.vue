<template>
  <Grid :class="['content', { '--indented': settings.indent }]">
    <Space size="small" />
    <Column
      v-if="settings.alignment === 'center'"
      span-laptop="8"
      start-laptop="3"
      span-desktop="6"
      start-desktop="4"
      ref="animateElements"
    >
      <Observer
        :onEnter="onEnter"
        :onLeave="onLeave"
        :once="settings.animation === 'none'"
      >
        <PortableText :value="blocks" :components="serializers" />
      </Observer>
    </Column>

    <Column
      v-else-if="settings.alignment === 'left'"
      span-tablet="10"
      span-laptop="8"
      span-desktop="6"
      ref="animateElements"
    >
      <Observer
        :onEnter="onEnter"
        :onLeave="onLeave"
        :once="settings.animation === 'none'"
      >
        <PortableText :value="blocks" :components="serializers" />
      </Observer>
    </Column>
    <Space size="small" />
  </Grid>
</template>

<script setup>
import { scrollHighlightAnimation } from "~/assets/scripts/utils/animateScrollHighlight.js";
import { scrollFadeOnEnter } from "~/assets/scripts/utils/animateFadeOnEnter.js";
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
import BlockButtonGroup from "~/components/ButtonGroup.vue";
import Space from "~/components/Space.vue";
import { gsap } from "gsap";

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

const animateElements = ref(null);

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

const onEnter = (ev) => {
  if (!ev) return;

  const domElements = ev.children;

  if (!domElements) return;

  switch (props.settings.animation) {
    case "enterFade":
      scrollFadeOnEnter(domElements);
      break;

    case "scrollHighlight":
      scrollHighlightAnimation(domElements);
      break;

    // none
    default:
      break;
  }
};

const onLeave = (ev) => {
  if (!ev) return;

  const domElements = ev.children;

  if (!domElements) return;

  switch (props.settings.animation) {
    case "enterFade":
      Array.from(domElements).forEach((node) => {
        gsap.set(node, {
          opacity: 0.2,
        });
      });
      break;

    case "scrollHighlight":
      Array.from(domElements).forEach((node) => {
        gsap.set(node, {
          opacity: 0.2,
        });
      });
      break;

    // none
    default:
      break;
  }
};

// onMounted(() => {
//   const portableTextComponent = animateElements.value;
//   const domElements = portableTextComponent?.$el.children;

//   if (!process.client) return;
//   if (!domElements) return;

//   switch (props.settings.animation) {
//     case "enterFade":
//       // scrollFadeOnEnter(domElements);
//       break;

//     case "scrollHighlight":
//       scrollHighlightAnimation(domElements);
//       break;

//     default:
//       break;
//   }
// });
</script>

<style lang="scss" scoped>
.content {
  :deep(.text-headline-1),
  :deep(.text-headline-2),
  :deep(.text-headline-3) {
    margin-top: var(--small);
  }

  :deep(.text-body-2),
  :deep(.text-body-1) {
    margin-top: var(--smallest);
  }

  :deep(.text-normal),
  :deep(.text-caption-2),
  :deep(.text-caption-1) {
    margin-top: var(--smaller);
  }

  // Headlines: add space between bodies and headlines
  :deep([class*="text-body-"]) + [class*="text-headline-"],
  :deep(.text-normal) + [class*="text-headline-"] {
    margin-top: var(--biggest);
  }

  // Body text that follws headlines
  :deep([class*="text-headline-"]) + [class*="text-body-"] {
    margin-top: var(--small);
  }

  :deep(.media) {
    margin-top: var(--small);
    margin-bottom: var(--bigger);

    & + [class*="text-"] {
      margin-top: var(--bigger);
    }
  }

  :deep(.text-body-1) {
    max-width: 50ch;
  }

  :deep(.text-body-2),
  :deep(.text-normal) {
    max-width: 60ch;

    li + li {
      margin-top: 0.25ch;
    }
  }

  :deep(.text-caption-1) {
    max-width: 60ch;
  }

  :deep(.text-caption-2) {
    max-width: 60ch;
  }

  :deep(ul),
  :deep(ol) {
    margin-top: 2ch;
    margin-bottom: 2ch;
  }

  // most lists have text-size as parent, some don't
  :deep(li) {
    * {
      margin-top: 0 !important;
    }
  }

  &.--indented {
    text-indent: var(--text-indent);

    :deep(span) {
      text-indent: 0;
    }

    :deep(.underline) {
      text-decoration-color: var(--foreground-tertiary);
    }
  }

  @include laptop {
    :deep(.text-body-1) {
      max-width: 60ch;
    }
  }
}
</style>
