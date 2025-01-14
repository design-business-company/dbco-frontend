<template>
  <section :class="['page', 'about']" v-if="data">
    <AboutContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { useTheme } from "~/composables/useTheme";
import usePageSetup from "~/composables/usePageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { aboutQuery } from "~/queries/pages/about";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const { data, error } = await useSanityQuery(aboutQuery);
if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/
usePageSetup({ seoMeta: data.value?.seo });

/* ----------------------------------------------------------------------------
 * Setup page theme
 * --------------------------------------------------------------------------*/
const { setPageTheme } = useTheme();

setPageTheme(data.value.pageTheme);

// onMounted(() => {
//   // tell the app that the page has successfully mounted
//   const { emit } = useEventBus();
//   emit("page::mounted");
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
