<template>
  <Grid v-if="data">
    <Column>
      <pre>{{ data }}</pre>
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
import { useRoute } from "vue-router";
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

const route = useRoute();
const pageId = route.params.id;

const query = groq`*[_type=="page" && slug.current=='${pageId}']`;
// *[_type=='page' && slug.current=='test']
const { data } = useSanityQuery(query, { pageId });

// Run common mount/unmount scripts. Setup SEO, etc.
PageSetup({
  seoMeta: { title: "Dynamic Page" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
