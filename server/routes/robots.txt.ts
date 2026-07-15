import { createClient } from "@sanity/client";
import { SITE_URL } from "../../utils/seo-constants";

const client = createClient({
  projectId: "5jjj3zhb",
  dataset: "production",
  apiVersion: "2022-03-07",
  useCdn: true,
});

// Only non-gated noindex pages are disallowed here. Gated slugs are secret —
// listing them in robots.txt would leak them; they rely on forced
// noindex/nofollow meta and sitemap exclusion instead.
const noindexQuery = `*[_type == "page" && seo.noIndexNoFollow == true && password.enabled != true]{ "slug": slug.current }`;

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export default defineEventHandler(async (event) => {
  const lines: string[] = ["User-agent: *", "Allow: /"];

  for (const bot of AI_CRAWLERS) {
    lines.push("", `User-agent: ${bot}`, "Allow: /");
  }

  try {
    const pages: { slug: string }[] = await client.fetch(noindexQuery);
    const disallows = pages
      .filter((page) => page.slug)
      .map((page) => `Disallow: /${page.slug}`);

    if (disallows.length) {
      lines.push("", "User-agent: *", ...disallows);
    }
  } catch {
    // On a Sanity outage stay allow-all rather than failing the route.
  }

  lines.push("", `Sitemap: ${SITE_URL}/sitemap.xml`, "");

  setResponseHeaders(event, {
    "Content-Type": "text/plain; charset=utf-8",
    "Netlify-CDN-Cache-Control":
      "public, durable, s-maxage=3600, stale-while-revalidate=86400",
    "Cache-Control": "public, max-age=0, must-revalidate",
  });

  return lines.join("\n");
});
