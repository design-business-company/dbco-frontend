# CLAUDE.md — frontend (dbco.online)

Nuxt 3 frontend for Design Business Company's marketing site. Content is authored in a separate Sanity Studio repo (`../backend`, project ID `5jjj3zhb`, dataset `production`) and fetched here via `@nuxtjs/sanity`. Deployed to Netlify (`nitro.preset: "netlify"`). See `README.md` for the one-paragraph pitch; this file covers what isn't obvious from the directory listing.

## Runtime

- Node version pinned in `.nvmrc`: **22.23.1** (bumped July 2026 — the Nuxt/Vite toolchain's native bindings, e.g. `oxc-parser`, now require Node `^20.19.0 || >=22.12.0`; below that floor npm silently fails to install the platform-specific optional binary instead of erroring, see npm/cli#4828).
- `npm run dev` / `build` / `preview` / `generate` — standard Nuxt scripts, nothing custom.
- `.npmrc` points the `@gsap` scope at GreenSock's private registry using a `GSAP_TOKEN` env var — `npm install` will fail without it configured (GSAP Club GreenSock license). GSAP itself is actually installed from a **local tarball** (`gsap-bonus.tgz`, checked into the repo) per `package.json`'s `"gsap": "file:gsap-bonus.tgz"` — the registry auth is seemingly vestigial/for a different bonus plugin, not the base gsap install.
- Env vars read via `runtimeConfig` in `nuxt.config.ts`:
  - `ENCRYPTION_KEY` — server-only, used by `server/helpers.ts` (Cryptr) to encrypt/decrypt page passwords.
  - `MUX_ENV_KEY` — public, for Mux video analytics.
  - `BYPASS_PASSWORD_GATE` — public boolean (`"true"` string), globally disables the password-gate middleware. Useful for local dev/previews.
- `npm audit` was hardened July 2026 (99 → 6 vulnerabilities): removed the unused `swiper` dependency (sole critical), pinned `@nuxt/devtools` off the `"latest"` tag (which resolves to a Nuxt 4 alpha and was dragging in unrelated Nuxt 4 tooling), and pinned ~24 nested transitive deps via a `package.json` `overrides` block without bumping their parents' major versions. **5 moderate vulnerabilities remain**, all tracing to `@nuxtjs/sanity`'s bundled (and unused-by-this-site) visual-editing feature — only fixable via a major version bump (1.13 → 2.x) of the module that powers every GROQ query and image fetch on this site. Deliberately not forced, given the single production dataset and no staging environment; revisit as a dedicated pass.

## Architecture at a glance

- **Global CSS must stay in `nuxt.config.ts` `css: []`, and `features.inlineStyles` must stay `false`** (both set July 2026). The design tokens (`:root` vars in `assets/styles/theme.scss`) previously lived in `app.vue`/`error.vue` `<style>` blocks, which Nuxt's SSR style-inlining treats as component styles: it inlined them and stripped the entry stylesheet from the client manifest, and unhead swept the inlined block on the first client-side navigation — so any SSR entry on a non-prerendered route (e.g. `/password`, the gated-page funnel) left every subsequent page with `var(--small)` etc. undefined and all `<Space>` spacers collapsed to 0. This bug shipped twice (a manual `build:manifest` hook, removed in `1a09f66`; then reintroduced upstream by the Nuxt 3.17→3.21 bump in `53391c8`). Dev mode can never reproduce it (Nuxt forces `inlineStyles: false` in dev) — verify with a production build (`npx nuxi build --preset=node-server`) by SSR-loading `/password` and client-navigating out.
- **Routing**: `pages/[id].vue` is the catch-all — nearly every marketing page is a Sanity `page` document rendered generically through this one route (fetches by `slug.current == $id`, renders `data.content` via `<ContentBlocks>`). `about.vue`, `contact.vue`, `index.vue` are bespoke pages with their own queries/layout. Unknown slugs `throw createError({ statusCode: 404 })` (rendered by `error.vue`); query failures throw 500 — do not reintroduce the old `navigateTo("/error")` pattern, which re-matched the catch-all and crashed.
- **Content blocks pattern**: Sanity pages are built from a `content` array of typed blocks (`richText`, `media`, `spotlight`, `snackGrid`, `themeSwitcher`, `carousel`, `textBlock`, `rule`, `spacer`, `hyperText`, and page-specific `customBlock` variants keyed off `block.type`). `components/ContentBlocks.vue` is the switchboard: it `v-if`s on `block._type` and renders the matching component. **Adding a new block type means updating both the Sanity schema (`../backend/schemaTypes`) and this switchboard** — there's no registry/lookup map, just a growing if-chain.
- **Component naming = Nuxt auto-import path prefixing.** Components live in feature folders (`Block/`, `Header/`, `About/`, `Contact/`, `Tools/`, `GatedPage/`) and are referenced in templates by their folder-prefixed PascalCase name, e.g. `components/Block/CopyCode.vue` → `<BlockCopyCode>`, `components/About/Clients.vue` → `<AboutClients>`. Shared layout primitives (`Grid.vue`, `Column.vue`, `Space.vue`, `Text.vue`, `ContentBlocks.vue`) live flat at `components/` root with no prefix. When adding a component, folder placement *is* the naming convention — don't fight it by importing manually.
- **Two `ContentBlocks.vue` files exist**: `components/ContentBlocks.vue` (the generic page switchboard, described above) and `components/About/ContentBlocks.vue` (About-page-specific — referenced as `<AboutContentBlocks>`). Don't conflate them when searching.

## Sanity data layer

- Queries live in `queries/`, written as tagged `groq` template literals, composed from shared fragments in `queries/fragments.js` (e.g. `pictureFields`, `videoFields`, `seoQuery`, `themeSwitcherFields`) and `queries/blocks.js` (`contentBlocksQuery` — the GROQ projection matching what `ContentBlocks.vue` expects). Page-specific queries live under `queries/pages/`.
- Fetching is done with `useSanityQuery` (auto-imported from `@nuxtjs/sanity`), always awaited at the top of `<script setup>` — this is an SSR data-fetching pattern, not client-only.
- Images: `$urlFor` (provided by `plugins/sanity/sanity-image-builder.js`) wraps `@sanity/image-url`, auto-formats. Portable Text uses custom serializers in `plugins/sanity/serializers.js` (currently only a `customSpan` mark; extend here for new rich-text marks defined in the Studio schema).
- There is no shared TypeScript interface layer for Sanity documents — types are inferred ad hoc or left as `any` in stores/composables. If you add typed Sanity fetching, there's no existing convention to match; use your judgment.

## Password-gated pages

Some Sanity `page` documents can have `password.enabled == true`. The flow spans three files and has a non-obvious quirk:

1. `plugins/gated-pages.server.ts` runs on every server request, calling `authStore.fetchGatedPageRoutes()` (query in `queries/pages/page.js`: `gatedPagesQuery`) to populate `authStore.routes` with the slugs that require a password.
2. `middleware/auth.ts` (applied via `definePageMeta({ middleware: "auth" })` on `pages/[id].vue`) checks if the current slug is in `authStore.routes`. If so and `authStore.authenticated` is false, it redirects to `/password?slug=...`.
3. `pages/password.vue` renders `GatedPagePasswordForm`, which presumably calls `authStore.authenticateUser({ slug, password })` → `POST /api/authenticate` → `server/api/authenticate.post.ts` compares against the encrypted password stored on the Sanity document (`server/helpers.ts`, Cryptr + `ENCRYPTION_KEY`).

Auth is per-slug via `authStore.authenticatedRoutes` (persists for the session; `logUserOut()` clears it). `BYPASS_PASSWORD_GATE=true` skips all of this.

Gated slugs are also forced to `noindex, nofollow` in `[id].vue` (via `authStore.routes`) regardless of the editor's SEO setting, and are excluded from the sitemap and never listed in robots.txt (listing would leak the secret slug).

`/api/encrypt` remains (the Studio's `PasswordInput.jsx` calls it to store new passwords; note the password rides a query param, so it lands in server logs). **`/api/decrypt` was deliberately removed** (July 2026): it was public, and ciphertexts are readable from the public dataset, so anyone could recover every gated password. The Studio field is now write-only — don't reintroduce a decrypt endpoint. Deeper caveat: gated page *content* is still fetchable from the public dataset (the gate is client-side); a private-dataset migration is a tracked follow-up.

## State (Pinia stores)

Three stores, registered via `pinia.storesDirs: ["./stores/app", "./stores/device"]` in `nuxt.config.ts` (note: `stores/auth.ts` is **not** in that dirs list, but Pinia still picks it up fine since Nuxt auto-imports composables from the whole `stores/` dir regardless — the `storesDirs` option there looks vestigial/incomplete rather than load-bearing).

- **`app`** — app-shell/session UI flags: `appHasLoaded`, `routeIsTransitioning`, `headerIsVisible`, `mobileNavIsVisible`. Simple setters, no async logic.
- **`device`** — the big one: touch/cursor/mobile detection, scroll position + direction + near-top/bottom flags, reduced-motion and theme OS preferences, viewport/document dimensions and DPI, current theme (`{ background, foreground, accent }`) vs. `pageTheme` (the page's "default" theme a `resetTheme()` call falls back to), and an inactivity tracker (`startTracking`/`stopTracking`, mouse/scroll/key/touch listeners). Populated by the `plugins/device/*` client plugins (`deviceInfo`, `deviceDimensions`, `deviceMotionPreference`, `deviceThemePreference`, `deviceScroll`, `deviceResize` — note `deviceResize.ts` is registered **twice** in `nuxt.config.ts`'s plugins array, likely a copy-paste leftover, harmless but worth cleaning up if you're touching that file anyway).
- **`auth`** — gated-page state described above: `routes`, `authenticated`, `loading`.

Theme reads/writes should generally go through the `useTheme()` composable (`setTheme`, `setPageTheme`, `resetTheme`), not direct store mutation — it also pushes the values onto `document.documentElement` CSS custom properties (`--background-primary` etc.), which is what components actually style against.

## Composables

`composables/README.md` exists but is **stale** — it documents `PageSetup` (actual file/export is `usePageSetup`, default export) and describes `useTheme` as backed by "a Vuex store" (it's Pinia). Trust the source over that README if they conflict. Other composables:
- `Observer.ts` (default export `observe`) — Intersection Observer wrapper, matches the README's description.
- `usePageSetup.ts` — per-page SEO head tags (via `pageSEO()` from `assets/scripts/pages/seo.ts`) + `<mux-player>`/`<img>` preloading on mount.
- `useEventBus.js` — simple pub/sub (`emit`/`on` presumably); used e.g. in `pages/[id].vue` to fire `"page::mounted"`.
- `SplitText.ts`, `Hypertext/Pulse.js`, `Hypertext/Wave.js` — text-animation helpers backing the `Block/Hypertext.vue` / `HypertextSpan.vue` components (GSAP-driven character/word splitting effects).

## Notable libraries and where they show up

- **GSAP** (+ local `gsap-bonus.tgz`) — text/scroll animation, see `Hypertext/*` composables and animation utils in `assets/scripts/utils/`.
- **Lenis** (`nuxt3-lenis`) — smooth scroll, wired up globally in `app.vue`/`error.vue` (`<Lenis>` wrapping `<NuxtLayout>`, `useLenis()`).
- **nuxt-viewport** — breakpoint system, custom breakpoints defined in `nuxt.config.ts` (`mobile/phablet/tablet/laptop/desktop/ultrawide`).
- **Mux** (`@mux/mux-player`, `@mux/blurup`) — video hosting/playback; `vue.compilerOptions.isCustomElement` in `nuxt.config.ts` whitelists the `mux-player` custom element so Vue doesn't warn on it. `Block/Vid.vue` defers creating `<mux-player>` until mounted on client-side navigations (`showPlayer`) — SSR/hydration renders it in the initial HTML as before; keep that split or hydration mismatches / media-chrome warnings return.
- **Three.js** — dependency is now unused (`pages/three.vue` was deleted July 2026); safe to remove from package.json when convenient.
- **Embla** (`embla-carousel-vue`, `embla-carousel-auto-scroll`) — backs `Block/Carousel.vue` and `Block/SpotlightMediaCarousel.vue`. Both carousels focus-guard their global arrow-key handlers (`isFocused`) — keep that guard when touching key handling, or one keypress drives every instance on the page.
- **Plausible** (`@nuxtjs/plausible`) — analytics, `localhost` ignored per config. Event taxonomy (goals + custom props are allowlisted in the Plausible dashboard — coordinate before renaming): `Carousel interact` {project} (once per page load, real interaction only — embla `pointerUp`/arrow keys via `composables/useCarouselTracking.ts`; AutoScroll must never fire it), `Project view` {project} (2s cumulative visible) and `Project dwell` {project, milestone: 10s|30s} (cumulative-attention milestones in `Block/Spotlight.vue` — clock pauses off-screen/tab-hidden), `Contact: copy email` {email, page} (`Block/CopyLinkExternal.vue`).
- **d3** — installed but not obviously wired into a component; check before assuming it's dead weight.

## SEO

`assets/scripts/pages/seo.ts` (`pageSEO()`) is the single source of truth for meta tag generation — both `usePageSetup` and `app.vue`/`error.vue` call into it directly (the latter two build meta manually via `useServerSeoMeta` instead of going through `usePageSetup`, so there are two call sites constructing overlapping meta — check both if changing SEO defaults). Global site title/description/favicon/OG image come from the Sanity `settingsSeo` singleton (`queries/settingsSeo.js`), fetched independently in `app.vue`/`error.vue`. `pageSEO()` also truncates description/og/twitter text to safe lengths (160/125/200 chars) so an overlong Sanity field can't break social-preview truncation.

**Per-page fallback (added July 2026):** if a page's own `seo` object is present but incomplete (e.g. has an OG image but no title/description — common for pages mid-edit in Studio), `usePageSetup`'s `useHead()` call used to silently drop `description`/`og:description`/`twitter:description` entirely instead of inheriting the sitewide default — unhead doesn't fall back per-key across two separate `useHead()`/`useServerSeoMeta()` registrations, it just has nothing to render for a key neither call supplies. Fixed by sharing the sitewide title/description from `app.vue` via `useState("siteSeoTitle"/"siteSeoDescription")`, which `usePageSetup` reads as its own fallback before calling `pageSEO()` — so every page now emits a complete tag set from one call, regardless of what its own `seo` object fills in.

Added July 2026 (see the `seo-analytics-fixes` PR for full context):

- **`utils/seo-constants.ts`** — `SITE_URL`, `PRERENDERED_ROUTES` (keep in sync with `nuxt.config.ts` routeRules), and `canonicalUrl()`. The canonical form is **trailing-slash for every route**; canonical tags (`app.vue`) and the sitemap both derive from `canonicalUrl()`, so they can't diverge — route any new URL generation through it.
- **`server/routes/sitemap.xml.ts` + `robots.txt.ts`** — dynamic, fetch live slugs from Sanity (1h edge cache, safe static fallback). Gated + noindex pages are excluded from the sitemap; non-gated noindex pages get robots `Disallow` lines; gated slugs are never listed anywhere. `public/llms.txt` is static, hand-maintained (work links pending case-study pages).
- **Organization JSON-LD** in `app.vue` (`sameAs` from footer links, editor-controlled); a dormant Article JSON-LD hook in `usePageSetup` activates when a page passes `seoMeta.type === "article"`.
- **Single-h1 convention**: header logos are `<p>` tags; each page owns exactly one (usually sr-only) `<h1>`. `Block/TextHeading.vue` renders portable-text "h1"-styled headings as `<h2>` — heading tags and visual size are decoupled (classes carry the styling), so don't "fix" that mapping back.
- **Workaround plugins** (each has a header comment explaining why it exists — read before deleting): `plugins/error-payload-fix.server.ts` (null-prototype `payload.error` from h3 `getQuery()` crashed pinia payload serialization, breaking every error page's SSR) and `plugins/silence-media-chrome-warning.client.ts` (benign but noisy media-chrome warning on client-side nav, unfixable app-side).

## TypeScript

`typescript.strict: false` at the Nuxt-config level, but `tsconfig.json` sets `compilerOptions.strict: true` — Nuxt's generated `.nuxt/tsconfig.json` (which this file extends) is what actually wins for editor/type-checking purposes; don't assume loose typing is sanctioned just because of the Nuxt config flag. In practice the codebase mixes `.ts` (stores, composables, server) and plain `.js`/`.vue` `<script setup>` without types (most components, most queries) — match whatever the file you're editing already does rather than introducing types unilaterally.
