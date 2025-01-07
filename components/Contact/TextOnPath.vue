<template>
  <div class="d3-container" ref="svgContainer" @click="updatePath"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as d3 from "d3";
import { gsap } from "gsap";

const svgContainer = ref(null);
const text = ref("“We design, you business.”");
let svg, path, textPath, textElement, width, height, isTransitioning;
let typingTimeouts = [];
let currentOffset = 0; // Initial offset starts at 0%
let currentPoints = []; // Store the current path points

const padding = 24; // Vertical padding
const line = d3.line().curve(d3.curveBasis);

function fadeInText() {
  const fullText = text.value; // Get the full text value
  const totalDuration = 2; // Total typing duration in seconds
  const charDuration = totalDuration / fullText.length; // Time per character

  // Clear existing animations
  gsap.killTweensOf(textElement);

  // Clear the text content initially
  textElement.text("");

  // Create a GSAP timeline
  const tl = gsap.timeline();

  // Add characters one by one
  fullText.split("").forEach((char, index) => {
    tl.to(
      {},
      {
        duration: charDuration, // Delay for each character
        onUpdate: () => {
          // Update text to include characters up to the current index
          textElement.text(fullText.slice(0, index + 1));
        },
      },
      index * charDuration // Start time for each character
    );
  });
}

function updateDimensions() {
  const rect = svgContainer.value.getBoundingClientRect();
  width = rect.width;
  height = rect.height;

  if (svg) {
    svg.attr("width", width).attr("height", height);

    currentPoints = generatePath();
    const resizedPath = line(currentPoints);

    path.attr("d", resizedPath);
    textPath.attr("d", resizedPath);

    // Trigger the typing effect again
    fadeInText();
  }
}

function generatePath(numPoints = 3) {
  if (window.innerWidth > 800) numPoints = 7;

  const points = [];

  if (window.innerWidth < 800) {
    points.push([padding, padding]);
    for (let i = 1; i < numPoints - 1; i++) {
      const x = padding + Math.random() * (width - 2 * padding);
      const y = padding + Math.random() * (height - 2 * padding);
      points.push([x, y]);
    }
    points.push([width - padding, height - padding]);
  } else {
    points.push([padding, padding + Math.random() * (height - 2 * padding)]);
    for (let i = 1; i < numPoints - 1; i++) {
      const x = padding + Math.random() * (width - 2 * padding);
      const y = padding + Math.random() * (height - 2 * padding);
      points.push([x, y]);
    }
    points.push([
      width - padding,
      padding + Math.random() * (height - 2 * padding),
    ]);
  }

  points.sort((a, b) => a[0] - b[0]);
  return points;
}

function updatePath() {
  if (isTransitioning) return;

  // updateOffset();
  isTransitioning = true;
  currentPoints = generatePath();
  const newPath = line(currentPoints);

  svg
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .selectAll("path")
    .attr("d", newPath);

  let randomOffset = window.innerWidth < 800 ? 0 : Math.random() * 25 + 10;

  textElement
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attrTween("startOffset", () =>
      d3.interpolate(`${currentOffset}%`, `${randomOffset}%`)
    )
    .on("end", () => {
      currentOffset = randomOffset;
      isTransitioning = false;
    });
}

function initD3() {
  const rect = svgContainer.value.getBoundingClientRect();
  width = rect.width;
  height = rect.height;

  svg = d3
    .select(svgContainer.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  currentPoints = generatePath();
  const initialPath = line(currentPoints);

  textPath = svg
    .append("defs")
    .append("path")
    .attr("id", "textPath")
    .attr("d", initialPath);

  path = svg
    .append("path")
    .attr("d", initialPath)
    .attr("stroke", "currentColor")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  textElement = svg
    .append("text")
    .append("textPath")
    .attr("xlink:href", "#textPath")
    .attr("startOffset", `${currentOffset}%`)
    .attr("text-anchor", "start")
    .text("");

  // Trigger the typing effect
  fadeInText();
}

onMounted(() => {
  initD3();
  window.addEventListener("windowResized", updateDimensions);
});

onUnmounted(() => {
  window.removeEventListener("windowResized", updateDimensions);
});
</script>

<style lang="scss" scoped>
.d3-container {
  height: clamp(300px, 40vmax, 800px);
  width: 100%;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }

  :deep(path) {
    fill: none;
    stroke: transparent;
  }

  :deep(text) {
    font-family: serif;
    letter-spacing: -0.04em;
    fill: var(--foreground-primary);
    cursor: pointer;
    font-size: 40px;

    @media (min-height: 600px) {
      font-size: 44px;
    }

    @include tablet {
      font-size: clamp(54px, 8vw, 128px);
    }
  }
}
</style>
