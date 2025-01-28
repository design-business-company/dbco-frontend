<template>
  <section
    v-if="data.content"
    ref="pageRef"
    :class="['page']"
  >
    <ContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import { pageQuery } from "~/queries/pages/page";
import { useEventBus } from "~/composables/useEventBus";
import usePageSetup from "~/composables/usePageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const route = useRoute();
const pageId = route.params.id;

const { data, error, status, refresh } = await useSanityQuery(pageQuery, {
  slug: pageId,
});
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
  middleware: "auth",
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
