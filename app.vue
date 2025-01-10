<template>
  <Lenis :options="lenisOptions" root>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </Lenis>
</template>

<script setup>
import { settingsSeoQuery } from "~/queries/settingsSeo";
import { useRoute } from "vue-router";
import { useAppStore } from "~/stores/app";

// helpers...
const { $urlFor } = useNuxtApp();
const appStore = useAppStore();
const route = useRoute();

// fetch data from sanity
const { data } = await useSanityQuery(settingsSeoQuery);

// set up data, make it reactive
const title = computed(() => data.value?.title);

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

const url = computed(() => `https://dbco.online${route.path}`);

appStore.setSeoData({
  image: $urlFor(data.value.image).url(),
  description: data.value?.description,
  url: url,
  logo: $urlFor(data.value?.favicon).format("png").width(512).height(512).url(),
});

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
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} • ${title?.value}` : title?.value,
  link: icons.value,
});
</script>

<style>
@import "~/assets/styles/theme.scss";
@import "~/assets/styles/reset.scss";
@import "~/assets/styles/grid.scss";
@import "~/assets/styles/typography.scss";
</style>
