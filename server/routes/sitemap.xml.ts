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

// Password-gated and noindex pages are intentionally excluded. The
// prerendered routes are backed by singleton docs (homepage/about/contact)
// or a page doc (tools) — fetch their _updatedAt for <lastmod> too.
const sitemapQuery = `{
  "pages": *[_type == "page" && defined(slug.current) && password.enabled != true && seo.noIndexNoFollow != true]{
    "slug": slug.current,
    _updatedAt
  },
  "singletons": {
    "/": *[_type == "homepage"][0]._updatedAt,
    "/about": *[_type == "about"][0]._updatedAt,
    "/contact": *[_type == "contact"][0]._updatedAt
  }
}`;

export default defineEventHandler(async (event) => {
  let pages: { slug: string; _updatedAt?: string }[] = [];
  let singletons: Record<string, string | null> = {};

  try {
    const result = await client.fetch(sitemapQuery);
    pages = result.pages ?? [];
    singletons = result.singletons ?? {};
  } catch {
    // On a Sanity outage still serve the prerendered routes.
  }

  const lastmodByPath = new Map<string, string | undefined>();

  for (const [path, updatedAt] of Object.entries(singletons)) {
    lastmodByPath.set(path, updatedAt ?? undefined);
  }

  for (const page of pages) {
    lastmodByPath.set(`/${page.slug}`, page._updatedAt);
  }

  const paths = [
    ...PRERENDERED_ROUTES,
    ...pages
      .map((page) => `/${page.slug}`)
      .filter((path) => !PRERENDERED_ROUTES.includes(path)),
  ];

  const urls = paths
    .map((path) => {
      const lastmod = lastmodByPath.get(path)?.split("T")[0];

      return [
        "  <url>",
        `    <loc>${canonicalUrl(path)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  setResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Netlify-CDN-Cache-Control":
      "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    "Cache-Control": "public, max-age=0, must-revalidate",
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
});
