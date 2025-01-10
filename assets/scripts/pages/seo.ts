// @ts-nocheck

import { useAppStore } from "~/stores/app";

export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndexNoFollow?: boolean;
  logo?: string;
}

export default function pageSEO(seoData: SEOData = {}) {
  const appStore = useAppStore(); // Access the Pinia store

  // Use store values as defaults
  const defaultSeo: SEOData = {
    description: appStore.seo.description,
    image: appStore.seo.image || "https://example.com/default-image.png", // Ensure fallback
    url: appStore.seo.url,
    logo: appStore.seo.logo,
    noIndexNoFollow: false,
  };

  // Merge defaults with provided SEO data, ignoring null/undefined in seoData
  const mergedSeoData: SEOData = { ...defaultSeo };
  Object.keys(seoData).forEach((key) => {
    const typedKey = key as keyof SEOData;
    if (seoData[typedKey] !== null && seoData[typedKey] !== undefined) {
      mergedSeoData[typedKey] = seoData[typedKey]!;
    }
  });

  const defaultData = {
    description: mergedSeoData.description,
    author: "Design Business Company",
    publisher: "Design Business Company",
    robots: mergedSeoData.noIndexNoFollow
      ? "noindex, nofollow"
      : "index, follow",

    // Open Graph
    ogDescription: mergedSeoData.description,
    ogImage: mergedSeoData.image,
    ogType: "website",
    ogUrl: mergedSeoData.url,
    ogLogo: mergedSeoData.logo,

    // Twitter
    twitterCard: mergedSeoData.image ? "summary_large_image" : null,
    twitterDescription: mergedSeoData.description,
    twitterImage: mergedSeoData.image,
    twitterUrl: mergedSeoData.url,
    twitterSite: "@designbizco",
    twitterCreator: "@designbizco",
  };

  return defaultData;
}
