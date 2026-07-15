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
// Each entry carries its OG image (fallback: the global settingsSeo image)
// as an image-sitemap extension for image search.
const sitemapQuery = `{
  "pages": *[_type == "page" && defined(slug.current) && password.enabled != true && seo.noIndexNoFollow != true]{
    "slug": slug.current,
    _updatedAt,
    "image": seo.image.asset->url
  },
  "singletons": {
    "/": *[_type == "homepage"][0]{ _updatedAt, "image": seo.image.asset->url },
    "/about": *[_type == "about"][0]{ _updatedAt, "image": seo.image.asset->url },
    "/contact": *[_type == "contact"][0]{ _updatedAt, "image": seo.image.asset->url }
  },
  "fallbackImage": *[_type == "settingsSeo"][0].image.asset->url
}`;

interface SitemapDoc {
  _updatedAt?: string;
  image?: string | null;
}

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default defineEventHandler(async (event) => {
  let pages: ({ slug: string } & SitemapDoc)[] = [];
  let singletons: Record<string, SitemapDoc | null> = {};
  let fallbackImage: string | null = null;

  try {
    const result = await client.fetch(sitemapQuery);
    pages = result.pages ?? [];
    singletons = result.singletons ?? {};
    fallbackImage = result.fallbackImage ?? null;
  } catch {
    // On a Sanity outage still serve the prerendered routes.
  }

  const docByPath = new Map<string, SitemapDoc>();

  for (const [path, doc] of Object.entries(singletons)) {
    if (doc) docByPath.set(path, doc);
  }

  for (const page of pages) {
    docByPath.set(`/${page.slug}`, page);
  }

  const paths = [
    ...PRERENDERED_ROUTES,
    ...pages
      .map((page) => `/${page.slug}`)
      .filter((path) => !PRERENDERED_ROUTES.includes(path)),
  ];

  const urls = paths
    .map((path) => {
      const doc = docByPath.get(path);
      const lastmod = doc?._updatedAt?.split("T")[0];
      const image = doc?.image ?? fallbackImage;

      return [
        "  <url>",
        `    <loc>${canonicalUrl(path)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        image
          ? `    <image:image>\n      <image:loc>${xmlEscape(image)}</image:loc>\n    </image:image>`
          : null,
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

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
});
