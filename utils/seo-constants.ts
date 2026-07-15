export const SITE_URL = "https://dbco.online";

// Keep in sync with the prerendered routeRules in nuxt.config.ts.
// Netlify serves these as static files and 301s them to a trailing slash;
// SSR'd Sanity slugs stay slash-less.
export const PRERENDERED_ROUTES = ["/", "/about", "/contact", "/tools"];

export const canonicalUrl = (path: string) => {
  const bare = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const trailing =
    bare !== "/" && PRERENDERED_ROUTES.includes(bare) ? `${bare}/` : bare;
  return `${SITE_URL}${trailing}`;
};
