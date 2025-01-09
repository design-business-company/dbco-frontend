export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndexNoFollow?: boolean;
}

export default function pageSEO(seoData: SEOData) {
  const defaultData = {
    title: seoData.title,
    description: seoData.description,
    author: "Design Business Company",
    publisher: "Design Business Company",
    robots: seoData.noIndexNoFollow ? "noindex, nofollow" : "index, follow",

    // opengraph
    ogTitle: seoData.title,
    ogDescription: seoData.description,
    ogImage: seoData.image,
    ogType: "website",
    ogUrl: seoData.url,

    // twitter
    twitterCard: seoData.image ? "summary_large_image" : null,
    twitterTitle: seoData.title,
    twitterDescription: seoData.description,
    twitterImage: seoData.image,
    twitterUrl: seoData.url,
    twitterSite: "@designbizco",
    twitterCreator: "@designbizco",
  };

  // Filter out empty values so they don't override the globals
  const filteredData = Object.fromEntries(
    Object.entries(defaultData).filter(([_, value]) => Boolean(value))
  );

  return filteredData;
}
