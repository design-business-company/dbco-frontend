<template>
  <Lenis :options="lenisOptions" root>
    <div>
      <NuxtLayout>
        <Grid>
          <Space size="huge" />

          <Column span-tablet="6" span-laptop="4" span-desktop="3">
            <Text
              element="h1"
              style="padding-bottom: var(--smallest)"
              size="headline-1"
              >Dammit!</Text
            >
          </Column>
          <Column span-tablet="6">
            <Text size="body-1" style="margin-top: var(--tiniest)"
              >For one reason or another, this page returned a
              <BlockCopyCode>{{ statusCode }}</BlockCopyCode>
              error and isn't accessible at the moment. We've gone ahead and
              notified Jordan — if something busted, he'll sort it out. In the
              meantime, you can head
              <nuxt-link to="/">home</nuxt-link> or enjoy watching each of the
              <BlockCopyCode>{{ statusCode }}</BlockCopyCode> error
              codes dance below.
            </Text>
            <!-- </Text> -->
          </Column>
          <Space size="huge" />
        </Grid>

        <ErrorArtwork :code="statusCode" />
        <!-- <pre>{{ $attrs }}</pre> -->
      </NuxtLayout>
    </div>
  </Lenis>
</template>

<script setup>
import { settingsSeoQuery } from "~/queries/settingsSeo";
import pageSEO from "~/assets/scripts/pages/seo";
import { useRoute } from "vue-router";

const { $urlFor } = useNuxtApp();

const { data, error, status, refresh } = await useSanityQuery(settingsSeoQuery);

// Capture the error ref once in setup — useHead's reactive getters run
// outside the component context, where calling useError() lazily would throw.
const nuxtError = useError();
const statusCode = computed(() => nuxtError.value?.statusCode ?? 500);

const title = computed(() => data.value?.title);
const description = computed(() => data.value?.description);

const icons = computed(() => {
  if (!data.value?.favicon) return [];

  return [
    {
      rel: "icon",
      type: "image/png",
      href: $urlFor(data.value.favicon)
        .format("png")
        .width(96)
        .height(96)
        .url(),
    },
    {
      rel: "apple-touch-icon",
      href: $urlFor(data.value.favicon)
        .format("png")
        .width(180)
        .height(180)
        .url(),
      sizes: "180x180",
    },
  ];
});

const ogImage = computed(() => {
  if (data.value?.image) {
    return $urlFor(data.value.image).url();
  }

  return "";
});

const logo = computed(() => {
  if (!data.value?.favicon) return undefined;

  return $urlFor(data.value.favicon).format("png").width(512).height(512).url();
});

const route = useRoute();
const url = computed(() => `https://dbco.online${route.path}`); // Reactive URL

useLenis();

const lenisOptions = {
  duration: 0.7,
  easing: function (t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
};

useHead({
  title: () => (statusCode.value === 404 ? "Page not found" : "Error"),
  templateParams: {
    siteName: () => title?.value ?? "Design Business Company",
  },
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} • ${title?.value}` : title?.value,
  link: icons.value,
});

useServerSeoMeta(
  pageSEO({
    description: description?.value,
    image: ogImage?.value,
    url: url.value,
    logo: logo.value,
  })
);
</script>

<style>
@import "~/assets/styles/theme.scss";
@import "~/assets/styles/reset.scss";
@import "~/assets/styles/grid.scss";
@import "~/assets/styles/typography.scss";
</style>
