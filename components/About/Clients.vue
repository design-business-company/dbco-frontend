<template>
  <Grid style="overflow: visible">
    <Column style="overflow: visible">
      <Observer :on-enter="onEnter" once="true">
        <swiper
          class="clients"
          :speed="500"
          :slides-per-view="slidesPerView"
          :space-between="8"
          :loop="true"
          :grabCursor="true"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :keyboard="{
            enabled: true,
          }"
          :mousewheel="true"
        >
          <swiper-slide v-for="client in data">
            <figure class="client">
              <div
                class="logo"
                v-html="client?.logo?.code"
                role="img"
                aria-label="Logo of {{ client.title }}"
              ></div>
              <figcaption>
                <Text size="micro" element="h2" class="name">{{
                  client.title
                }}</Text>
              </figcaption>
            </figure>
          </swiper-slide>
        </swiper>
      </Observer>
    </Column>
  </Grid>
</template>

<style lang="scss" scoped>
@import "swiper/css";

.swiper {
  overflow: visible;
}

.swiper-wrapper:hover .name {
  opacity: 0.2;
  transform: translate3d(0, 0, 0);
}

.client {
  .logo {
    background-color: rgba(black, 0.05);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .name {
    transition: opacity 300ms ease-out, transform 200ms ease-out;
    opacity: 0;
    margin-top: var(--tiniest);
    transform: translate3d(0, 10%, 0) scale(0.95);
    transform-origin: 0 100%;
    pointer-events: none;
  }

  &:hover .name {
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
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore from "swiper";
import { Keyboard, Mousewheel, Autoplay } from "swiper/modules";
import gsap from "gsap";

import { ref, onMounted, onUnmounted } from "vue";

const slidesPerView = ref(3); // Default value

const updateSlidesPerView = () => {
  const width = window.innerWidth;
  if (width <= 360) slidesPerView.value = 1;
  else if (width <= 600) slidesPerView.value = 2;
  else if (width <= 1024) slidesPerView.value = 3;
  else if (width <= 1512) slidesPerView.value = 4;
  else if (width <= 1920) slidesPerView.value = 6;
  else slidesPerView.value = 8;
};

onMounted(() => {
  window.addEventListener("resize", updateSlidesPerView);
  updateSlidesPerView(); // Initialize on mount
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSlidesPerView);
});

// Importing the additional Swiper modules
SwiperCore.use([Keyboard, Mousewheel, Autoplay]);

const query = groq`*[]`;
const { data } = useSanityQuery(query);

// Swiper instances as refs to access Swiper's instance methods if needed
const swiperInstance = ref(null);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper; // Storing swiper instance if needed for further manipulation
  console.log(swiper);
};

const onSlideChange = () => {
  console.log("slide change");
};

function onEnter(el) {
  nextTick(() => {
    // Ensure the Swiper is initialized and the DOM is updated
    gsap.from(".swiper-slide", {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        // Animation complete actions
      },
    });
  });
}
</script>
