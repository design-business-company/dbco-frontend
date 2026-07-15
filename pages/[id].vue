<template>
  <section
    v-if="data.content"
    ref="pageRef"
    :class="['page']"
  >
    <header class="sr-only">
      <h1>{{ data.seo?.title || data.slug.current }}</h1>
    </header>
    <ContentBlocks :content="data.content" />
  </section>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "~/composables/useTheme";
import { useAuthStore } from "~/stores/auth";
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
if (error.value) throw createError({ statusCode: 500, fatal: true });
if (!data.value)
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });

/* ----------------------------------------------------------------------------
 * Handle SEO Shit
 * --------------------------------------------------------------------------*/
const pageRef = ref(null);

// Gated pages must never be indexed, regardless of the editor's SEO setting.
// authStore.routes (gated slugs) is populated SSR-side by plugins/gated-pages.server.ts.
const isGated = useAuthStore().routes.includes(pageId);

usePageSetup({
  seoMeta: isGated
    ? { ...data.value?.seo, noIndexNoFollow: true }
    : data.value?.seo,
  pageRef,
});

/* ----------------------------------------------------------------------------
 * Setup page theme
 * --------------------------------------------------------------------------*/
const { setPageTheme } = useTheme();

setPageTheme(data.value?.pageTheme);

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
