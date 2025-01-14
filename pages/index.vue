<template>
  <section :class="['page', 'home']" v-if="data">
    <ContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useTheme } from "~/composables/useTheme";
import { homeQuery } from "~/queries/pages/home";
import { useEventBus } from "~/composables/useEventBus";
import usePageSetup from "~/composables/usePageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const { data, error, status } = await useSanityQuery(homeQuery);

if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/
 await usePageSetup({
  seoMeta: data.value?.seo
})

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

.home {
  :deep(.grid:first-of-type) {
    @media (max-width: $tablet) {
      .media__video .vid-container {
        aspect-ratio: 1/1;
        margin-bottom: calc(-1 * var(--big));
      }
    }
  }
}
</style>
