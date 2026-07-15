import { createClient } from "@sanity/client";
import {
  PRERENDERED_ROUTES,
  canonicalUrl,
} from "../../utils/seo-constants";

const client = createClient({
  projectId: "5jjj3zhb",
  dataset: "production",
  apiVersion: "2022-03-07",
  useCdn: true,
});

// Password-gated and noindex pages are intentionally excluded.
const sitemapQuery = `*[_type == "page" && defined(slug.current) && password.enabled != true && seo.noIndexNoFollow != true]{ "slug": slug.current, _updatedAt }`;

export default defineEventHandler(async (event) => {
  let pages: { slug: string; _updatedAt?: string }[] = [];

  try {
    pages = await client.fetch(sitemapQuery);
  } catch {
    // On a Sanity outage still serve the prerendered routes.
  }

  const entries = PRERENDERED_ROUTES.map((path) => ({
    loc: canonicalUrl(path),
    lastmod: undefined as string | undefined,
  }));

  for (const page of pages) {
    if (PRERENDERED_ROUTES.includes(`/${page.slug}`)) continue;
    entries.push({
      loc: canonicalUrl(`/${page.slug}`),
      lastmod: page._updatedAt?.split("T")[0],
    });
  }

  const urls = entries
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${loc}</loc>${
          lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
        }\n  </url>`
    )
    .join("\n");

  setResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Netlify-CDN-Cache-Control":
      "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    "Cache-Control": "public, max-age=0, must-revalidate",
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
});
