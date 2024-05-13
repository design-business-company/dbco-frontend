<template>
  <swiper
    :slides-per-view="3"
    :space-between="50"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide>Slide 1</swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
    <swiper-slide>Slide 4</swiper-slide>
    <swiper-slide>Slide 5</swiper-slide>
    <swiper-slide>Slide 6</swiper-slide>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

// Swiper instances as refs to access Swiper's instance methods if needed
const swiperInstance = ref(null);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper; // Storing swiper instance if needed for further manipulation
};

const onSlideChange = () => {};
</script>

<style lang="css">
@import "swiper/css";
</style>
