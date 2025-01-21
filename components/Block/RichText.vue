<template>
  <div class="content" :class="[{ '--indented': indent }, 'content']">
    <CustomPortableText :value="blocks" />
  </div>
</template>

<script setup>
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
