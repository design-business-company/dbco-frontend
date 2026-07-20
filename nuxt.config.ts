import vueJsx from "@vitejs/plugin-vue-jsx";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sanity",
    "@nuxtjs/plausible",
    "nuxt3-lenis",
    "nuxt-viewport",
  ],

  plugins: [
    { src: "~/plugins/device/deviceInfo.ts", mode: "client" },
    { src: "~/plugins/device/deviceDimensions.ts", mode: "client" },
    { src: "~/plugins/device/deviceMotionPreference.ts", mode: "client" },
    { src: "~/plugins/device/deviceThemePreference.ts", mode: "client" },
    { src: "~/plugins/device/deviceScroll.ts", mode: "client" },
    { src: "~/plugins/device/deviceResize.ts", mode: "client" },
    { src: "~/plugins/device/deviceResize.ts", mode: "client" },
    "~/plugins/sanity/sanity-image-builder.js",
  ],

  pinia: {
    storesDirs: ["./stores/app", "./stores/device"],
  },

  future: {
    compatibilityVersion: 4,
  },

  // Always ship global/component CSS as linked stylesheets. Under
  // compatibilityVersion 4, Nuxt 3.21 inlines all .vue styles into the SSR'd
  // HTML and (new since 3.17) strips the entry stylesheet from the client
  // manifest when all of its sources were inlined — since our design tokens
  // (:root vars in theme.scss) lived in app.vue's style block, they vanished
  // on the first client-side navigation (see removed build:manifest hook,
  // commit 1a09f66, for the previous incarnation of this same bug).
  features: {
    inlineStyles: false,
  },

  // Global styles (order matters: theme tokens → reset → grid → typography).
  css: [
    "~/assets/styles/theme.scss",
    "~/assets/styles/reset.scss",
    "~/assets/styles/grid.scss",
    "~/assets/styles/typography.scss",
  ],

  routeRules: {
    "/": { prerender: true },
    "/about": { prerender: true },
    "/contact": { prerender: true },
    "/tools": { prerender: true },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  nitro: {
    preset: "netlify",
  },

  plausible: {
    ignoredHostnames: ["localhost"],
  },

  runtimeConfig: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    public: {
      muxEnvKey: process.env.MUX_ENV_KEY,
      bypassPasswordGate: process.env.BYPASS_PASSWORD_GATE === "true",
    },
  },

  // Details on warning in console: https://github.com/nuxt-modules/sanity/issues/1059
  sanity: {
    projectId: "5jjj3zhb",
    dataset: "production",
    apiVersion: "2022-03-07",
  },

  typescript: {
    typeCheck: true,
    strict: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("mux-player"),
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/_global.scss" as *;
          `,
        },
      },
    },
  },

  viewport: {
    breakpoints: {
      mobile: 360,
      phablet: 430,
      tablet: 600,
      laptop: 1024,
      desktop: 1350,
      ultrawide: 1660,
    },
    fallbackBreakpoint: "tablet",
    defaultBreakpoints: {
      mobile: "phablet",
      tablet: "tablet",
      desktop: "desktop",
    },
  },

  compatibilityDate: "2025-01-27",
});
