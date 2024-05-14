# dbco.online [![Netlify Status](https://api.netlify.com/api/v1/badges/1450d4ef-abd1-4e42-8389-38b77d766d08/deploy-status)](https://app.netlify.com/sites/dbco-frontend/deploys)

> Design Business Company's little corner of the internet.

## Introduction

This is a [Nuxt](https://nuxt.com/docs/getting-started/introduction) project which includes a handful of very help packages and plugins that I often use. Specifically:

- [GSAP](https://gsap.com/docs/v3/) for animations.
    - We have a business membership with GSAP to access all of their libraries and plugins. You will need to install the business library and set-up the business token. You can find set-up instructions [here](https://gsap.com/docs/v3/Installation/guides/Netlify/). Contact Jordan or Emma with questions!
- [Pinia](https://pinia.vuejs.org/introduction.html) for storing data that I share globally.
- [SASS](https://sass-lang.com/documentation/) has been configured so `scss` and `sass` are valid within single file components.
- A number of small plugins which help track user preferences and devie info.
  - [`deviceInfo`](./plugins/device/deviceInfo.ts) for fetching device context info (`isMobile`, `isTouch`, etc.).
  - [`deviceDimensions`](./plugins/device/deviceDimensions.ts) for fetching device and document dimensions, screen dpi, etc.
  - [`deviceMotionPreference`](./plugins/device/deviceMotionPreference.ts) for detecting if a user prefers reduced motion or not.
  - [`deviceThemePreference`](./plugins/device/deviceThemePreference.ts) for detecting a user's preferred color theme.
  - [`deviceScroll`](./plugins/device/deviceScroll.ts) for tracking user scroll info.
  - [`deviceResize`](./plugins/device/deviceResize.ts) for tracking window resize events.

## Helpful Composables/components

- Observer

## Setup

```bash
# clone repo
git clone https://github.com/egstad/nuxt.git

# install dependencies
npm install
```

## Scripts

```bash
# Run dev server (http://localhost:3000 by default):
npm run dev

# Build the application for production:
npm run build

# Locally preview production build:
npm run preview
```

## Store

Out of the box, there is a Pinia store called `device`. All of the plugins device plugins listed above post their results to `device` this store.

```html
<script setup>
  // import the store
  import { useDeviceStore } from "~/stores/device";

  // init the store
  const device = useDeviceStore();

  // get screen dpi from store
  const dpi = device.dpi;
</script>
```
