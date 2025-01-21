<template>
  <Grid class="hypertext">
    <Column span="12" span-tablet="10">
      <CustomPortableText :value="blocks" />
    </Column>
  </Grid>
</template>

<script setup>
import { toRefs } from "vue";

// Props
const props = defineProps({
  blocks: {
    type: Array,
    required: true,
  },
});

const { blocks } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss">
.hypertext p {
  text-indent: var(--text-indent);
  margin-bottom: 1em;

  .hypertext__span {
    text-indent: 0;
  }
}
</style>
