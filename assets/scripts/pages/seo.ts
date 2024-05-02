import type { SEOData } from "~/types/SEOData";

export default function pageSEO(seoData: SEOData) {
  const defaultData: SEOData = {
    title: seoData.title,
    ogTitle: seoData.title,
    description: seoData.description,
    ogDescription: seoData.description,
    ogImage: seoData.image,
    twitterCard: seoData.image ? "summary_large_image" : null,
  };

  return { ...defaultData };
}
