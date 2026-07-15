export const SITE_URL = "https://dbco.online";

// Keep in sync with the prerendered routeRules in nuxt.config.ts.
export const PRERENDERED_ROUTES = ["/", "/about", "/contact", "/tools"];

// Canonical form is trailing-slash for every route: Netlify 301s the
// prerendered pages to it, and SSR routes serve both forms (no redirect),
// so the canonical tag + sitemap must agree on one — this one.
export const canonicalUrl = (path: string) => {
  const bare = (path.split(/[?#]/)[0] ?? "").replace(/\/+$/, "") || "/";
  return `${SITE_URL}${bare === "/" ? "/" : `${bare}/`}`;
};
