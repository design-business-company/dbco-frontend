<template>
  <section :class="['page']">
    <template v-if="pending">
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
import { pageQuery } from "~/queries/pages/page";

import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const pageId = route.params.id;

const { data, error, pending, refresh } = useSanityQuery(pageQuery, {
  slug: pageId,
});

// if (error.value) await navigateTo("/error");

/* ----------------------------------------------------------------------------
 * Set page theme
 * --------------------------------------------------------------------------*/

watch(
  data,
  (sanityData) => {
    if (!process.client || !sanityData || sanityData.length === 0) return;

    const { setTheme } = useTheme();

    if (sanityData?.pageTheme) {
      setTheme(sanityData.pageTheme);
    }
  },
  { immediate: true }
);

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/

PageSetup({
  seoMeta: {
    title: data.value?.title,
    description: data.value?.seo?.description,
    image: `${data.value?.seo?.image}?w=1200`,
    url: `https://dbco.online${route.fullPath}`,
    noIndexNoFollow: data.value?.seo?.noIndexNoFollow,
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
