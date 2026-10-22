import { markRaw } from "vue";
import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";
import BlockCopyLinkInternal from "~/components/Block/CopyLinkInternal.vue";
import BlockCopyCode from "~/components/Block/CopyCode.vue";
import BlockCopyUnderline from "~/components/Block/CopyUnderline.vue";
import BlockCopyStrike from "~/components/Block/CopyStrike.vue";

// Mark serializers for the backend `richTextSimple` type (work
// shortDescription/description/credits, snack descriptions). Without these,
// <SanityContent> falls back to a bare <a> that ignores the annotation's
// "Open in new tab" toggle and can't resolve internal links.
export const richTextSimpleSerializers = {
  marks: {
    link: markRaw(BlockCopyLinkExternal),
    internalLink: markRaw(BlockCopyLinkInternal),
    code: markRaw(BlockCopyCode),
    underline: markRaw(BlockCopyUnderline),
    "strike-through": markRaw(BlockCopyStrike),
  },
};
