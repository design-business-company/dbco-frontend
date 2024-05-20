// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "~/assets/styles/theme.scss",
    "~/assets/styles/reset.scss",
    "~/assets/styles/grid.scss",
    "~/assets/styles/typography.scss",
  ],
  modules: ["@pinia/nuxt", "@nuxtjs/sanity", "@nuxtjs/plausible"],
  plugins: [
    { src: "~/plugins/device/deviceInfo.ts", mode: "client" },
    { src: "~/plugins/device/deviceDimensions.ts", mode: "client" },
    { src: "~/plugins/device/deviceMotionPreference.ts", mode: "client" },
    { src: "~/plugins/device/deviceThemePreference.ts", mode: "client" },
    { src: "~/plugins/device/deviceScroll.ts", mode: "client" },
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
  plausible: {
    ignoredHostnames: ["localhost"],
  },
  sanity: {
    projectId: "5jjj3zhb",
    dataset: "production",
    apiVersion: "2022-03-07",
  },
});
