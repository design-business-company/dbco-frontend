<template>
  <div>
    <div v-for="n in 100">
      <Observer :onEnter="onEnter" :onLeave="onLeave">
        <div
          class="child"
          style="
            font-size: 5vw;
            font-variant-numeric: tabular-nums;
            letter-spacing: -0.05em;
          "
        >
          {{ n }}
        </div>
      </Observer>
    </div>
  </div>
</template>

<script setup>
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import gsap from "gsap";

definePageMeta({
  pageTransition: pageTransitionDefault(),
});

// observer
const onEnter = (el) => {
  const child = el.querySelector(".child");

  gsap.to(child, {
    ease: "expo.out",
    duration: 2,
    opacity: 1,
    rotate: 0,
  });
};

const onLeave = (el) => {
  const child = el.querySelector(".child");

  gsap.to(child, {
    ease: "expo.out",
    duration: 2,
    rotate: 360,
  });
};
</script>
