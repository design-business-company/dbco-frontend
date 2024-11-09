<template>
  <Grid class="clients">
    <Column>
      <Observer :onEnter="onEnter" :onLeave="onLeave">
        <div class="swiper-container" ref="swiperContainer">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="client in data">
              <figure class="client">
                <div
                  class="client__logo"
                  v-html="client?.logo?.code"
                  role="img"
                  :aria-label="'Logo of ' + client.title"
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
@use "swiper/css";

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
}

.client {
  &__logo {
    background-color: rgba(black, 0.05);
    border-radius: var(--border-radius);
    overflow: hidden;
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
    fill: var(--foreground-primary);
  }
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import Swiper from "swiper";
import { Autoplay, Mousewheel, FreeMode, Keyboard } from "swiper/modules";
import gsap from "gsap";

const query = groq`*[_type=="client"]`;
const { data } = useSanityQuery(query);

const swiperContainer = ref(null);
const swiperInstance = ref(null);
const swiperHasFadedIntoView = ref(false);

const swiperInit = () => {
  swiperInstance.value = new Swiper(swiperContainer.value, {
    modules: [Autoplay, Mousewheel, FreeMode, Keyboard],
    speed: 400,
    freeMode: {
      enabled: true,
      sticky: true,
      momentumRatio: 0.9,
      momentumVelocityRatio: 0.8,
    },
    slidesPerView: 2,
    spaceBetween: 8,
    loop: true,
    autoplay: {
      delay: 1500,
      pauseOnMouseEnter: true,
    },
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      enabled: true,
      forceToAxis: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 8,
      },
      600: {
        slidesPerView: 3,
        spaceBetween: 9,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1512: {
        slidesPerView: 6,
        spaceBetween: 11,
      },
    },
  });
};

const onEnter = () => {
  // swiperInstance.value.resume();

  // console.log(swiperInstance.value.autoplay);
  swiperInstance.value.autoplay.start();

  const els = swiperContainer.value.querySelectorAll(".swiper-slide");

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
  swiperInstance.value.autoplay.stop();
};

const swiperDestroy = () => {
  swiperInstance.value.destroy();
};

onMounted(() => {
  swiperInit();
  onEnter();

  console.log();
});

onUnmounted(() => {
  swiperDestroy();
});
</script>
