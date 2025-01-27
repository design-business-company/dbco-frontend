import vueJsx from "@vitejs/plugin-vue-jsx";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sanity",
    "@nuxtjs/plausible",
    "nuxt3-lenis",
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

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  // remove entry.css file from manifest in favor of inlining styles in app.vue
  hooks: {
    "build:manifest": (manifest) => {
      const css = manifest["node_modules/nuxt/dist/app/entry.js"]?.css;
      if (css) {
        for (let i = css.length - 1; i >= 0; i--) {
          if (css[i].startsWith("entry")) css.splice(i, 1);
        }
      }
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
          api: "modern",
          additionalData: `
            @use "~/assets/styles/_global.scss" as *;
          `,
        },
      },
    },
  },

  // this has been causing a netlify error:
  // error decoding lambda response: error decoding lambda
  compatibilityDate: "2025-01-27",
});
