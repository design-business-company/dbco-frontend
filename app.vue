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
import pageSEO from "~/assets/scripts/pages/seo";
import { useRoute } from "vue-router";

const { $urlFor } = useNuxtApp();

const { data, error, status, refresh } = await useSanityQuery(settingsSeoQuery);

// Editor-controlled social/profile URLs for Organization JSON-LD sameAs
const { data: footerLinks } = await useSanityQuery(
  `*[_type=="settingsFooter"][0].links.content[].url`
);

const title = computed(() => data.value?.title);
const description = computed(() => data.value?.description);

// Shared with usePageSetup so per-page SEO can fall back to the sitewide
// title/description instead of a hardcoded literal when a page omits one.
const siteTitleState = useState("siteSeoTitle", () => title.value);
const siteDescriptionState = useState("siteSeoDescription", () => description.value);
watchEffect(() => {
  siteTitleState.value = title.value;
  siteDescriptionState.value = description.value;
});

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

const route = useRoute();
const url = computed(() => canonicalUrl(route.path)); // Reactive URL

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

const logo = computed(() => {
  if (!data.value?.favicon) return undefined;

  return $urlFor(data.value.favicon).format("png").width(512).height(512).url();
});

const sameAs = computed(() =>
  (footerLinks.value || []).filter((link) => /^https?:\/\//.test(link))
);

const organizationJsonLd = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: title?.value || "Design Business Company",
    url: `${SITE_URL}/`,
    ...(logo.value ? { logo: logo.value } : {}),
    ...(sameAs.value.length ? { sameAs: sameAs.value } : {}),
  })
);

useHead({
  templateParams: {
    siteName: () => title?.value ?? "Design Business Company",
  },
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} • ${title?.value}` : title?.value,
  link: () => [...icons.value, { rel: "canonical", href: url.value }],
  script: () => [
    {
      type: "application/ld+json",
      innerHTML: organizationJsonLd.value,
    },
  ],
});

const seoMeta = computed(() =>
  pageSEO({
    description: description?.value,
    image: ogImage?.value,
    url: url.value,
    logo: logo.value,
    siteName: title?.value || "Design Business Company",
  })
);

useServerSeoMeta(seoMeta);
</script>

<style>
@import "~/assets/styles/theme.scss";
@import "~/assets/styles/reset.scss";
@import "~/assets/styles/grid.scss";
@import "~/assets/styles/typography.scss";
</style>
