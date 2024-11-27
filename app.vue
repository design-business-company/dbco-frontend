<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { settingsSeoQuery } from "~/queries/settingsSeo";
import pageSEO from "~/assets/scripts/pages/seo";
const { $urlFor } = useNuxtApp();

const { data, error, pending, refresh } = useSanityQuery(settingsSeoQuery);

const title = computed(() => data.value?.title);
const description = computed(() => data.value?.description);

const icons = computed(() => {
  if (!data.value?.favicon) return []

  return [
    {
      rel: "icon",
      type: "image/png",
      href: $urlFor(data.value.favicon).format('png').width(96).height(96).url(),
    },
    {
      rel: "apple-touch-icon",
      href: $urlFor(data.value.image).format('png').width(180).height(180).url(),
      sizes: "180x180",
    }
  ]
})

const ogImage = computed(() => {
  if (data.value?.image) {
    return $urlFor(data.value.image).url();
  }

  return "";
});

useHead({
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} • ${title?.value}` : title?.value,
  link: icons.value,
});

PageSetup({
  seoMeta: {
    description: description?.value,
    image: ogImage?.value,
    url: `https://dbco.online`,
  },
});
</script>
