<template>
  <section :class="['page', 'contact']">
    <header class="sr-only"><h1>Contact Design Business Company</h1></header>
    <ContactTextOnPath />
    <ContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import pageSEO from "~/assets/scripts/pages/seo";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { contactQuery } from "~/queries/pages/contact";
import { useEventBus } from "~/composables/useEventBus";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const { data, error, status, refresh } = await useSanityQuery(contactQuery);

/* ----------------------------------------------------------------------------
 * Set page theme
 * --------------------------------------------------------------------------*/

watch(
  data,
  (sanityData) => {
    if (!process.client || !sanityData || sanityData.length === 0) return;

    const { setPageTheme } = useTheme();

    if (sanityData?.pageTheme?.theme) {
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

useSeoMeta(
  pageSEO({
    ...data.value?.seo,
    url: process.client
      ? `https://dbco.online${window.location.pathname}${window.location.search}`
      : "https://dbco.online",
  })
);

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
