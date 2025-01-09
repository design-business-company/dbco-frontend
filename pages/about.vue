<template>
  <section :class="['page', 'about']">
    <AboutContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import pageSEO from "~/assets/scripts/pages/seo";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { aboutQuery } from "~/queries/pages/about";
import { useEventBus } from "~/composables/useEventBus";
import { useAppStore } from "~/stores/app";

const app = useAppStore();

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const { data, error, status, refresh } = await useSanityQuery(aboutQuery);

// if (error.value) await navigateTo("/error");

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
