<template>
  <Grid>
    <Column>
      <pre>{{ data }}</pre>
    </Column>
  </Grid>
</template>

<script setup>
import { useRoute } from "vue-router";
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const pageId = route.params.id;

const query = groq`*[_type=="page" && slug.current=='${pageId}']{
  ...,
  seo {
    ...,
    "image": image.asset->url
  }
}`;
const { data } = useSanityQuery(query);

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/

PageSetup({
  seoMeta: {
    title: () => `${data.value[0].title} • Design Business Company`,
    description: () => `${data.value[0].seo.description}`,
    image: () => `${data.value[0].seo.image}?w=1200`,
    url: () => `https://dbco.online${route.fullPath}`,
    noIndexNoFollow: () => `${data.value[0].seo.noIndexNoFollow}`,
  },
});

/* ----------------------------------------------------------------------------
 * Define page transitions or other page meta
 * --------------------------------------------------------------------------*/
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>

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
