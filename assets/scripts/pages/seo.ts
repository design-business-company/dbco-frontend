export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndexNoFollow?: boolean;
  logo?: string;
  siteName?: string;
  type?: "website" | "article";
}

// Truncates on a word boundary so descriptions don't get cut mid-word before
// social platforms/search engines apply their own truncation.
function truncate(text: string | undefined, maxLength: number) {
  if (!text || text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

export default function pageSEO(seoData: SEOData) {
  const siteName = seoData.siteName || "Design Business Company";

  const defaultData = {
    title: seoData.title,
    description: truncate(seoData.description, 160),
    author: siteName,
    publisher: siteName,
    robots: seoData.noIndexNoFollow ? "noindex, nofollow" : "index, follow",

    // opengraph
    ogTitle: seoData.title ? `${siteName} • ${seoData.title}` : siteName,
    ogDescription: truncate(seoData.description, 125),
    ogImage: seoData.image,
    ogType: seoData.type || "website",
    ogUrl: seoData.url,
    ogLogo: seoData.logo,
    ogSiteName: siteName,

    // twitter
    twitterCard: seoData.image ? "summary_large_image" : null,
    twitterTitle: seoData.title ? `${siteName} • ${seoData.title}` : siteName,
    twitterDescription: truncate(seoData.description, 200),
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
