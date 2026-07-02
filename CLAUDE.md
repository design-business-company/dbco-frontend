# CLAUDE.md — frontend (dbco.online)

Nuxt 3 frontend for Design Business Company's marketing site. Content is authored in a separate Sanity Studio repo (`../backend`, project ID `5jjj3zhb`, dataset `production`) and fetched here via `@nuxtjs/sanity`. Deployed to Netlify (`nitro.preset: "netlify"`). See `README.md` for the one-paragraph pitch; this file covers what isn't obvious from the directory listing.

## Runtime

- Node version pinned in `.nvmrc`: **22.7.0**.
- `npm run dev` / `build` / `preview` / `generate` — standard Nuxt scripts, nothing custom.
- `.npmrc` points the `@gsap` scope at GreenSock's private registry using a `GSAP_TOKEN` env var — `npm install` will fail without it configured (GSAP Club GreenSock license). GSAP itself is actually installed from a **local tarball** (`gsap-bonus.tgz`, checked into the repo) per `package.json`'s `"gsap": "file:gsap-bonus.tgz"` — the registry auth is seemingly vestigial/for a different bonus plugin, not the base gsap install.
- Env vars read via `runtimeConfig` in `nuxt.config.ts`:
  - `ENCRYPTION_KEY` — server-only, used by `server/helpers.ts` (Cryptr) to encrypt/decrypt page passwords.
  - `MUX_ENV_KEY` — public, for Mux video analytics.
  - `BYPASS_PASSWORD_GATE` — public boolean (`"true"` string), globally disables the password-gate middleware. Useful for local dev/previews.

## Architecture at a glance

- **Routing**: `pages/[id].vue` is the catch-all — nearly every marketing page is a Sanity `page` document rendered generically through this one route (fetches by `slug.current == $id`, renders `data.content` via `<ContentBlocks>`). `about.vue`, `contact.vue`, `index.vue` are bespoke pages with their own queries/layout. `three.vue` and `viewport.vue` look like internal test/demo pages (Three.js and viewport-breakpoint debugging respectively), not linked in real nav.
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

**Gotcha**: in `middleware/auth.ts`, the `else` branch (when already authenticated) immediately does `authStore.authenticated = false` *before* letting the navigation through. This means the "authenticated" flag is consumed on the very next navigation to a gated route — a reload or repeat visit to the same gated page re-triggers the password prompt. This looks like intentional "must re-enter password every navigation" behavior rather than a persistent session, but verify with Jordan before "fixing" it if it comes up — it may be deliberate.

`BYPASS_PASSWORD_GATE=true` skips all of this.

There's also `/api/encrypt` and `/api/decrypt` (GET, query-string based) — these look like ad hoc helper endpoints for generating an encrypted password to paste into Sanity Studio, not part of the runtime auth flow. Note they take the plaintext/ciphertext as a GET query param, which will end up in server logs — treat as a manual/local tool, not something to link to from the UI.

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
- **Mux** (`@mux/mux-player`, `@mux/blurup`) — video hosting/playback; `vue.compilerOptions.isCustomElement` in `nuxt.config.ts` whitelists the `mux-player` custom element so Vue doesn't warn on it.
- **Three.js** — only referenced from the seemingly-experimental `pages/three.vue`.
- **Embla** (`embla-carousel-vue`, `embla-carousel-auto-scroll`) — backs `Block/Carousel.vue` and `Block/SpotlightMediaCarousel.vue`.
- **Plausible** (`@nuxtjs/plausible`) — analytics, `localhost` ignored per config.
- **d3** — installed but not obviously wired into a component; check before assuming it's dead weight.

## SEO

`assets/scripts/pages/seo.ts` (`pageSEO()`) is the single source of truth for meta tag generation — both `usePageSetup` and `app.vue`/`error.vue` call into it directly (the latter two build meta manually via `useServerSeoMeta` instead of going through `usePageSetup`, so there are two call sites constructing overlapping meta — check both if changing SEO defaults). Global site title/description/favicon/OG image come from the Sanity `settingsSeo` singleton (`queries/settingsSeo.js`), fetched independently in `app.vue`/`error.vue`.

## TypeScript

`typescript.strict: false` at the Nuxt-config level, but `tsconfig.json` sets `compilerOptions.strict: true` — Nuxt's generated `.nuxt/tsconfig.json` (which this file extends) is what actually wins for editor/type-checking purposes; don't assume loose typing is sanctioned just because of the Nuxt config flag. In practice the codebase mixes `.ts` (stores, composables, server) and plain `.js`/`.vue` `<script setup>` without types (most components, most queries) — match whatever the file you're editing already does rather than introducing types unilaterally.
