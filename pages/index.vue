<template>
  <section :class="['page']">
    <template v-if="status === 'pending'">
      <p>pending</p>
    </template>
    <template v-else>
      <ContentBlocks :content="data.content" />
    </template>
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import { homeQuery } from "~/queries/pages/home";
import { useEventBus } from "~/composables/useEventBus";
// import PageSetup from "~/composables/PageSetup";
import pageSEO from "~/assets/scripts/pages/seo";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
// const route = useRoute();
const { data, error, status } = await useSanityQuery(homeQuery);

if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Set page theme
 * --------------------------------------------------------------------------*/

watch(
  data,
  (sanityData) => {
    if (!process.client || !sanityData || sanityData.length === 0) return;

    const { setPageTheme } = useTheme();

    if (sanityData?.pageTheme) {
      setPageTheme(sanityData.pageTheme);
    }
  },
  { immediate: true }
);

onMounted(() => {
  // tell the app that the page has successfully mounted
  const { emit } = useEventBus();
  emit("page::mounted");
});

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/

// useSeoMeta(pageSEO(data.value?.seo));

useSeoMeta({
  title: "My Amazing Site",
  ogTitle: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage:
    "https://cdn.sanity.io/images/5jjj3zhb/production/ec37f9d70ab0e425132020df39beaa4051f9303c-2724x1740.jpg?w=1200&auto=format",
  twitterCard: "summary_large_image",
});

// PageSetup({
//   seoMeta: {
//     description: data.value?.seo?.description,
//     image: `${data.value?.seo?.image}?w=1200`,
//     url: `https://dbco.online${route.fullPath}`,
//     noIndexNoFollow: data.value?.seo?.noIndexNoFollow,
//   },
// });

/* ----------------------------------------------------------------------------
 * Define page transitions or other page meta
 * --------------------------------------------------------------------------*/
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>

<style lang="scss" scoped>
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
