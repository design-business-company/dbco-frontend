<template>
  <Grid>
    <Column element="figure">
      <!-- Hidden element for screen readers -->
      <span id="accessibleTitle" class="sr-only">
        An interactive string of text that reads, "We design, you business".
        When clicked, the string of text animates to create a variety of
        different shapes.
      </span>

      <Observer :once="true" :onEnter="fadeInCharacters" class="text-on-path">
        <svg
          :viewBox="`0 0 ${svgBox.width} ${svgBox.height}`"
          aria-labelledby="accessibleTitle"
        >
          <path id="myPath" ref="path" />
          <text>
            <textPath
              href="#myPath"
              :startOffset="currentPaths[0].startOffset"
              text-anchor="start"
              ref="pathText"
              @click="morphToNextPath"
            >
              <tspan v-for="(char, i) in characters" :key="i">
                {{ char }}
              </tspan>
            </textPath>
          </text>
        </svg>
      </Observer>
    </Column>
  </Grid>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { gsap } from "gsap";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import { useDeviceStore } from "~/stores/device";

import {
  createSpiralPath,
  createPolygonPath,
  createSineWavePath,
  createCirclePath,
} from "@/assets/scripts/utils/createSvgShapes.js";

if (process.client) {
  gsap.registerPlugin(MorphSVGPlugin);
}

const device = useDeviceStore();
const svgBox = ref({ width: 800, height: 800 }); // Reactive SVG dimensions
const path = ref(null);
const pathText = ref(null);
const svgContainer = ref(null); // Reference for the SVG container
const characters = ref("“We design, you business.”".split(""));

// Paths for different screen sizes
const mobilePaths = [
  {
    pathData: createSineWavePath(-45, -40, 900, 250, 800),
    startOffset: "0%",
  },
  { pathData: createSpiralPath(400, 400, 3, 750), startOffset: "1%" },
  { pathData: createPolygonPath(400, 400, 4, 300), startOffset: "19%" },
  { pathData: createCirclePath(400, 100, 500), startOffset: "58%" },
  { pathData: createPolygonPath(400, 400, 3, 300), startOffset: "20%" },
  {
    pathData: createSineWavePath(0, 400, 400, 96 / 2, 800),
    startOffset: "22%",
  },
];

const laptopPaths = [
  { pathData: createSineWavePath(-75, 50, 700, 150, 1600), startOffset: "0%" },
  { pathData: createSpiralPath(500, 550, 1, 600), startOffset: "20%" },
  { pathData: createSpiralPath(600, 350, 4, 600), startOffset: "10%" },
  { pathData: createPolygonPath(600, 400, 3, 310), startOffset: "0%" },
  { pathData: createPolygonPath(600, 400, 4, 310), startOffset: "0%" },
  { pathData: createCirclePath(600, -200, 800), startOffset: "59%" },
  { pathData: createSpiralPath(600, 400, 3, 550), startOffset: "5%" },
  { pathData: createPolygonPath(600, 400, 8, 300), startOffset: "0%" },
  { pathData: createSineWavePath(-100, 400, 150, 40, 1650), startOffset: "0%" },
];

const currentPaths = computed(() =>
  svgBox.value.width === 800 ? mobilePaths : laptopPaths
);

let index = 0;

onMounted(() => {
  if (!process.client) return;

  updateSvgDimensions();

  const tspans = pathText.value.querySelectorAll("tspan");
  gsap.set(tspans, { opacity: 0 });

  if (path.value) {
    path.value.setAttribute("d", currentPaths.value[0]?.pathData || "");
  }

  if (pathText.value) {
    pathText.value.setAttribute(
      "startOffset",
      currentPaths.value[0]?.startOffset || "0%"
    );
  }
});

watch(
  () => device.winWidth,
  () => updateSvgDimensions()
);

function updateSvgDimensions() {
  const wasMobile = svgBox.value.width === 800;

  svgBox.value =
    device.winWidth <= 600
      ? { width: 800, height: 800 }
      : { width: 1200, height: 800 };

  const isMobile = svgBox.value.width === 800;

  if (wasMobile !== isMobile) {
    index = 0;
    path.value.setAttribute("d", currentPaths.value[0].pathData);
    pathText.value.setAttribute(
      "startOffset",
      currentPaths.value[0].startOffset || "0%"
    );
  }
}

function morphToNextPath() {
  index = (index + 1) % currentPaths.value.length;

  const { pathData, startOffset } = currentPaths.value[index];
  const tspans = pathText.value.querySelectorAll("tspan");

  const randomDuration = gsap.utils.random(1, 2);

  // Array to define fill options
  const fillOptions = [
    "var(--foreground-primary)",
    "#FE9D26", // yellow
    "#69152A", // plum
    "#72C3E3", // cyan
    "#37B74A", // green
    () => `hsl(${gsap.utils.random(0, 360)}, 85%, 60%)`,
  ];

  // Select the current fill style (cycle through the array)
  const currentFill = getRandomItem(fillOptions);

  // Morph the path
  gsap.to(path.value, {
    duration: randomDuration,
    morphSVG: { shape: pathData, shapeIndex: 0 },
    ease: "power4.out",
  });

  // Animate the startOffset of the text
  gsap.to(pathText.value, {
    duration: randomDuration / 2,
    attr: {
      startOffset: startOffset || "50%",
    },
    ease: "power4.out",
  });

  // Animate tspan fills with stagger
  gsap.to(tspans, {
    fill: () =>
      typeof currentFill === "function" ? currentFill() : currentFill,
    duration: 0.5,
    stagger: 0.01,
    ease: "power2.out",
    onComplete: () => {
      useTrackEvent("Click: 'You design, we business'");
    },
  });
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function fadeInCharacters() {
  const tspans = pathText.value.querySelectorAll("tspan");

  gsap.to(tspans, {
    opacity: 1,
    duration: 0.1,
    stagger: 0.05,
    ease: "power2.out",
  });
}
</script>

<style lang="scss" scoped>
.text-on-path {
  height: clamp(300px, 50vmax, 400px);

  @include tablet {
    height: clamp(300px, 40vmax, 800px);
  }

  :deep(svg) {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  :deep(path) {
    fill: none;
    stroke: transparent;
  }

  :deep(text) {
    cursor: pointer;
    font-family: "Times";
    fill: var(--foreground-primary);
    font-size: 114px;

    @include tablet {
      font-size: 144px;
    }
  }
}

@font-face {
  src: url("~/assets/fonts/DBC-TimesNow.otf");
  font-family: "Times";
}
</style>
