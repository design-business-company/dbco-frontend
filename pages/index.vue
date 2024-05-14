<template>
  <Grid v-if="data">
    <Column>
      <Text size="headline-1">Hello World</Text>
    </Column>
    <Column>
      <BlockHypertext :blocks="data[0]?.foo.text" />
    </Column>
  </Grid>
</template>

<style lang="scss">
@import "@/assets/styles/mixins.scss";

svg {
  display: flex;
  width: 100%;
  height: auto;

  path {
    fill: var(--foreground-primary);
  }
}
</style>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
const { setTheme } = Theme();

setTheme({
  background: "#fff",
  foreground: "#0000ff",
  accent: "#ff0000",
});

const query = groq`*[_type=="homepage"]`;
const { data } = useSanityQuery(query);

// Run common mount/unmount scripts. Setup SEO, etc.
PageSetup({
  seoMeta: { title: "Index" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
