<template>
  <Grid class="clients grid--full">
    <Column>
      <Observer :onEnter="onEnter" :onLeave="onExit">
        <div
          class="clients__container"
          ref="emblaRef"
          tabindex="0"
          @focus="handleFocus"
          @blur="handleBlur"
        >
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

<style lang="scss" scoped>
.clients {
  cursor: grab;
  margin-top: var(--bigger);
  margin-bottom: var(--bigger);

  @include tablet {
    margin-top: var(--biggest);
    margin-bottom: var(--biggest);
  }

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
    padding-inline: var(--grid-margin);
    outline: none;
    user-select: none;
  }

  &__wrapper {
    display: flex;
  }

  &__slide {
    --client-columns: 2.25;
    flex: 0 0
      calc(
        calc(100vw - calc(var(--grid-margin) * var(--client-columns))) /
          var(--client-columns)
      );
    margin-right: var(--grid-gap);

    @include tablet {
      --client-columns: 3;
    }
    @include laptop {
      --client-columns: 4;
    }
    @include desktop {
      --client-columns: 5;
    }
  }
}

.client {
  &__logo {
    background-color: var(--background-tertiary);
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

:deep(svg) {
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
import { onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import { gsap } from "gsap";

const query = groq`*[_type=="client"]`;
const { data } = useSanityQuery(query);

const autoScrollInstance = AutoScroll({
  speed: 0.55,
  startDelay: 0,
  stopOnInteraction: false,
  stopOnMouseEnter: true,
});

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    loop: true,
    skipSnaps: true,
    align: "start",
    startIndex: 1,
    containScroll: false,
    inViewThreshold: 0.01,
  },
  [autoScrollInstance]
);

const componentHasFadedIntoView = ref(false);

const onEnter = (node) => {
  if (!node) return;

  gsap.fromTo(
    node,
    {
      opacity: 0.2,
    },
    {
      opacity: 1,
    }
  );

  if (autoScrollInstance && emblaApi.value) {
    autoScrollInstance.play(); // Start autoscrolling
  }

  const els = emblaRef.value?.querySelectorAll(".clients__slide");
  if (!els?.length) return;

  if (!componentHasFadedIntoView.value) {
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
    componentHasFadedIntoView.value = true;
  }
};

const onExit = (node) => {
  if (!node) return;

  gsap.set(node, {
    opacity: 0.2,
  });

  if (autoScrollInstance && emblaApi.value) {
    autoScrollInstance.stop(); // Stop autoscrolling
  }
};

const isFocused = ref(false); // Track if this carousel is focused

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

onKeyStroke("ArrowRight", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollNext();
});

onKeyStroke("ArrowLeft", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollPrev();
});

onUnmounted(() => {
  if (autoScrollInstance) {
    autoScrollInstance.stop();
  }
  if (emblaApi.value) {
    emblaApi.value.destroy();
  }
});
</script>
