<template>
  <section
    ref="pageRef"
    :class="['page', 'contact']"
    v-if="data"
  >
    <header class="sr-only"><h1>Contact Design Business Company</h1></header>
    <ContactTextOnPath />
    <ContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { useTheme } from "~/composables/useTheme";
import usePageSetup from "~/composables/usePageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { contactQuery } from "~/queries/pages/contact";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const { data, error, status, refresh } = await useSanityQuery(contactQuery);
if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/
const pageRef = ref(null);

usePageSetup({ seoMeta: data.value?.seo, pageRef });

/* ----------------------------------------------------------------------------
 * Setup page theme
 * --------------------------------------------------------------------------*/
const { setPageTheme } = useTheme();

setPageTheme(data.value.pageTheme);

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
