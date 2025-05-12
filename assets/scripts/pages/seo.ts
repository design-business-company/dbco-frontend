export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndexNoFollow?: boolean;
  logo?: string;
  siteName?: string;
}

export default function pageSEO(seoData: SEOData) {
  const siteName = seoData.siteName || "Design Business Company";

  const defaultData = {
    title: seoData.title,
    description: seoData.description,
    author: siteName,
    publisher: siteName,
    robots: seoData.noIndexNoFollow ? "noindex, nofollow" : "index, follow",

    // opengraph
    ogTitle: seoData.title ? `${siteName} • ${seoData.title}` : siteName,
    ogDescription: seoData.description,
    ogImage: seoData.image,
    ogType: "website",
    ogUrl: seoData.url,
    ogLogo: seoData.logo,

    // twitter
    twitterCard: seoData.image ? "summary_large_image" : null,
    twitterTitle: seoData.title ? `${siteName} • ${seoData.title}` : siteName,
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
