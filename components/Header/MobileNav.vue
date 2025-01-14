<template>
  <transition @leave="onLeave" @enter="onEnter">
    <div v-if="app.mobileNavIsVisible" class="mobile-nav" ref="mobileNavRef">
      <ul ref="navItems" class="text-headline-3 mobile-nav__primary">
        <li><NuxtLink to="/">Work</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/contact">Contact</NuxtLink></li>
      </ul>
      <Grid ref="socialItems" style="padding: 0">
        <Column>
          <BlockRule space-above="tiny" space-below="tiny" />
        </Column>
        <Column span="6">
          <Text size="caption-1">Social</Text>
        </Column>
        <Column span="6" element="ul">
          <li v-for="link in data.links.content">
            <Text size="caption-1" class="content"
              >{{ link.cta }}<br />
              <a :href="link.url" target="_blank" style="color: inherit">{{
                link.title
              }}</a
              ><br /><br
            /></Text>
          </li>
        </Column>
        <Column>
          <BlockRule space-above="big" space-below="tiny" />
        </Column>
        <Column span="6">
          <Text size="caption-1">Copyright</Text>
        </Column>
        <Column span="6" element="ul">
          <Text size="caption-1">2023-{{ new Date().getFullYear() }}</Text>
        </Column>
        <Space size="huge" />
      </Grid>
    </div>
  </transition>
</template>

<script setup>
import { gsap } from "gsap";
import { useAppStore } from "~/stores/app";
import { useDeviceStore } from "~/stores/device";
import { settingsFooter } from "~/queries/settingsFooter";

const app = useAppStore();
const navItems = ref(null);
const socialItems = ref(null);
const mobileNavRef = ref(null);
const timeline = gsap.timeline();

const { data, error, status, refresh } = await useSanityQuery(settingsFooter);

function onEnter(el, done) {
  timeline.eventCallback("onComplete", done);

  timeline
    .fromTo(el, { opacity: 0 }, { ease: "expo.out", duration: 0.4, opacity: 1 })
    .fromTo(
      navItems.value.children,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.3,
        ease: "Power2.easeOut",
      },
      "-=0.25"
    )
    .fromTo(
      socialItems.value.$el,
      { opacity: 0, y: 40 },
      { ease: "Power2.easeOut", duration: 0.3, opacity: 1, y: 0 },
      "-=0.125"
    );
}
function onLeave(el, done) {
  timeline.eventCallback("onComplete", done);

  timeline.to(el, { ease: "Power2.easeOut", duration: 0.4, opacity: 0 });
}
</script>

<style lang="scss" scoped>
.mobile-nav {
  // position: fixed;
  // top: 40px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: var(--background-primary);
  padding: 0 var(--grid-margin);
  height: calc(100lvh - 40px);

  &::-webkit-scrollbar {
    display: none;
  }

  @include tablet {
    display: none;
  }

  @media (min-height: 800px) {
    .mobile-nav__primary li:has(.router-link-active) a {
      aspect-ratio: 1/1;
      padding-top: 0;
      padding-bottom: 0;
      animation: flip 20s infinite;
      max-height: none;
    }
  }

  @media (min-height: 900px) {
    // height: auto;
    border-radius: 0 0 var(--small) var(--small);
  }
}

.mobile-nav__primary {
  margin: 0;
  padding-top: var(--small);
  padding-bottom: var(--small);
  display: flex;
  flex-direction: column;
  min-height: 300px;
  gap: $grid-gap;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &:has(.router-link-active) {
      a {
        padding-top: 20vh;
        padding-bottom: 20vh;
        background-color: var(--foreground-primary);
        color: var(--background-primary);
        border-radius: 100vw;
        width: 100%;
      }
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    background-color: var(--background-tertiary);
    width: 100%;
    height: 100%;
    min-height: 58px;
    max-height: 144px;
    border-radius: var(--tinier);

    display: flex;
    justify-content: center;
    align-items: center;
    transition: color var(--transition-fast),
      background-color var(--transition-fast), border-radius var(--transition),
      padding var(--transition);
  }
}

@keyframes flip {
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
}
</style>
