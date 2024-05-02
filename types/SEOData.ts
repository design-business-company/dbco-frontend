export interface SEOData {
  title?: string;
  ogTitle?: string;
  description?: string;
  ogDescription?: string;
  image?: string;
  ogImage?: string;
  twitterCard?: string | null;
  // need to add something else?
  // heads to choose from here: https://github.com/harlan-zw/zhead/blob/main/src/metaFlat.ts
  // nuxt docs here: https://nuxt.com/docs/api/composables/use-seo-meta
}
