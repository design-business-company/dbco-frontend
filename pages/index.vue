<template>
  <section :class="['page']">
    <template v-if="pending">
      <p>pending</p>
    </template>
    <template v-else>
      <ContentBlocks :content="data[0].content" />
    </template>
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const pageId = route.params.id;

const query = groq`*[_type=="homepage"]{
  ...,
  content[]{
    ...,
    _type == "richText" => {
      ...,
      text[]{
        ...,
        markDefs[]{
          ...,
          _type == "internalLink" => {
            "slug": @.reference->slug.current
          }
        }
      }
    }
  },
    seo {
    ...,
    "image": image.asset->url
  }
}`;
const { data, error, pending, refresh } = useSanityQuery(query);

// if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Set page theme
 * --------------------------------------------------------------------------*/

watch(
  data,
  (sanityData) => {
    if (!process.client || !sanityData || sanityData.length === 0) return;

    const { setTheme } = useTheme();

    if (sanityData[0]?.pageTheme) {
      setTheme(sanityData[0].pageTheme);
    }
  },
  { immediate: true }
);

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/

PageSetup({
  seoMeta: {
    title: () => `Design Business Company`,
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
svg {
  display: flex;
  width: 100%;
  height: auto;

  path {
    fill: var(--foreground-primary);
  }
}

.stroke {
  text-indent: var(--big);

  @include tablet {
    text-indent: 0;
    border-left: 1px solid var(--foreground-primary);
    padding-left: var(--tiny);
    padding-right: var(--smallest);
  }
}
</style>
