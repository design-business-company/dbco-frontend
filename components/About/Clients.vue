<template>
  <Grid class="clients grid--full">
    <Column>
      <Observer :onEnter="onEnter" :onLeave="onLeave">
        <div class="clients__container" ref="emblaRef">
          <div class="clients__wrapper">
            <div class="clients__slide" v-for="client in data">
              <figure class="client">
                <div
                  class="client__logo"
                  v-html="client?.logo?.code"
                  role="img"
                  :aria-label="client.title + ' Logo'"
                ></div>
                <figcaption class="client__name">
                  <Text size="micro">{{ client.title }}</Text>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Observer>
    </Column>
  </Grid>
</template>

<style lang="scss">
.clients {
  cursor: grab;

  &:hover {
    .client__name {
      opacity: 0.2;
      transform: translate3d(0, 0, 0);
    }
  }

  &:active {
    cursor: grabbing;
  }

  &__container {
    width: 100%;
    overflow: hidden;
    padding-inline: $grid-margin;
  }

  &__wrapper {
    display: flex;
  }

  &__slide {
    --client-columns: 6;
    flex: 0 0 calc(calc(100vw - calc(var(--grid-margin) * var(--client-columns))) / var(--client-columns));
    margin-right: var(--tiny);
  }
}

.client {
  &__logo {
    background-color: var(--background-secondary);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: background-color var(--transition);
  }

  &__name {
    transition: opacity 300ms ease-out, transform 200ms ease-out;
    opacity: 0;
    margin-top: var(--tiniest);
    transform: translate3d(0, 10%, 0) scale(0.95);
    transform-origin: 0 100%;
    pointer-events: none;
  }

  &:hover .client__name {
    opacity: 1;
  }
}

svg {
  display: flex;
  width: 100%;
  height: auto;

  path {
    transition: fill var(--transition);
    fill: var(--foreground-primary);
  }
}
</style>

<script setup>
import emblaCarouselVue from "embla-carousel-vue";
import AutoScroll from "embla-carousel-auto-scroll";

import { onMounted, ref } from "vue";
import gsap from "gsap";

const query = groq`*[_type=="client"]`;
const { data } = useSanityQuery(query);

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  skipSnaps: true,
  align: "start",
  startIndex: 1,
  containScroll: false,
  inViewThreshold: 0.01,
}, [
  AutoScroll({
    speed: 0.55,
    startDelay: 0,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })
]);

const swiperInstance = ref(null);
const swiperHasFadedIntoView = ref(false);

const onEnter = () => {
  // swiperInstance.value.resume();

  // console.log(swiperInstance.value.autoplay);
  // swiperInstance.value.autoplay.start();

  const els = emblaRef.value.querySelectorAll(".clients__slide");

  if (!swiperHasFadedIntoView.value) {
    gsap.fromTo(
      els,
      {
        opacity: 0,
      },
      {
        stagger: 0.1,
        opacity: 1,
        delay: 0.5,
      }
    );
    swiperHasFadedIntoView.value = true;
  }
};

const onLeave = () => {
  // swiperInstance.value.pause();
  // swiperInstance.value.autoplay.stop();
};

const destroy = () => {
  // swiperInstance.value.destroy();
};

onMounted(() => {
  onEnter();

  console.log();
});

onUnmounted(() => {
  destroy();
});
</script>
