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
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { contactQuery } from "~/queries/pages/contact";
import { useEventBus } from "~/composables/useEventBus";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const { data, error, pending, refresh } = useSanityQuery(contactQuery);

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

PageSetup({
  seoMeta: {
    title: "Contact",
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
