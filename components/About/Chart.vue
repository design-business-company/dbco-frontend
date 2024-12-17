<template>
  <Observer :onEnter="init" once>
    <div
      class="chart"
      ref="svgContainer"
      style="width: 100%; overflow: hidden"
    ></div>
  </Observer>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as d3 from "d3";

const query = groq`*[_type=="peopleCollaborator"]`;
const { data } = await useSanityQuery(query);

const svgContainer = ref(null);

// List of names to cycle through
const names = data.value.map((info) => info.name);

let index = 0; // Current index in the names list
let intervalId = null; // To store interval reference

let svg,
  width,
  height,
  nodes,
  links,
  simulation,
  linkGroup,
  nodeGroup,
  circleWidth;

function init() {
  svg = d3
    .select(svgContainer.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      `0 0 ${svgContainer.value.clientWidth} ${svgContainer.value.clientHeight}`
    )
    .attr("preserveAspectRatio", "xMidYMid meet");

  width = svgContainer.value.clientWidth;
  height = svgContainer.value.clientHeight;
  circleWidth = Math.min(60, window.innerWidth / 4);

  nodes = []; // Active nodes
  links = []; // Connections between nodes

  simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(circleWidth * 2)) // Add link force
    .force("charge", d3.forceManyBody().strength(-(circleWidth * 5))) // Reduced repulsion for closer attraction
    .force("center", d3.forceCenter(width / 2, height / 2).strength(1)) // Increased central attraction strength
    .force("collision", d3.forceCollide().radius(circleWidth))
    .force("bounds", () => {
      nodes.forEach((node) => {
        node.x = Math.max(
          circleWidth * 1.5,
          Math.min(width - circleWidth * 1.5, node.x)
        );
        node.y = Math.max(circleWidth, Math.min(height - circleWidth, node.y));
      });
    })
    .on("tick", ticked);

  linkGroup = svg.append("g").attr("class", "links");
  nodeGroup = svg.append("g").attr("class", "nodes");

  intervalId = setInterval(addNode, 100); // Add nodes at intervals

  window.addEventListener("resize", handleResize);
}

function teardown() {
  if (intervalId) clearInterval(intervalId);

  d3.select(svgContainer.value).select("svg").remove();

  window.removeEventListener("resize", handleResize);
}

function handleResize() {
  width = svgContainer.value.clientWidth;
  height = svgContainer.value.clientHeight;

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  simulation.force("center", d3.forceCenter(width / 2, height / 2));

  simulation.force("bounds", () => {
    nodes.forEach((node) => {
      node.x = Math.max(
        circleWidth * 1.5,
        Math.min(width - circleWidth * 1.5, node.x)
      );
      node.y = Math.max(circleWidth, Math.min(height - circleWidth, node.y));
    });
  });

  simulation.alpha(1).restart();
}

function ticked() {
  const linkElements = linkGroup.selectAll("line").data(links);

  linkElements
    .enter()
    .append("line")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .merge(linkElements)
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  linkElements.exit().remove();

  const circles = nodeGroup.selectAll("circle").data(nodes, (d) => d.id);

  circles
    .enter()
    .append("circle")
    .attr("r", circleWidth / 2)
    .merge(circles)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  circles.exit().remove();

  const labels = nodeGroup.selectAll("text").data(nodes, (d) => d.id);

  labels
    .enter()
    .append("text")
    .text((d) => d.name)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .merge(labels)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y + 3);

  labels.exit().remove();
}

function addNode() {
  if (index >= names.length) {
    clearInterval(intervalId); // Stop the interval when all names are added
    return;
  }

  const name = names[index % names.length];
  index++;

  const newNode = { id: Date.now(), name, x: width / 2, y: height / 2 };
  nodes.push(newNode);

  if (nodes.length > 1) {
    const targetNode = nodes[Math.floor(Math.random() * (nodes.length - 1))];
    links.push({ source: newNode, target: targetNode });
  }

  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(0.5).restart();
}

onUnmounted(teardown);
</script>

<style lang="scss">
.chart {
  margin-top: var(--big);
  margin-bottom: var(--big);
  height: clamp(400px, 100vmax, 800px);
  width: 100%;

  line {
    stroke: var(--background-secondary);
    transition: stroke var(--transition);
  }

  circle {
    fill: var(--background-primary);
    transition: fill var(--transition);
    filter: blur(8px);
  }

  text {
    font-size: clamp(12px, 1vw, 16px);
    fill: var(--foreground-primary);
    filter: drop-shadow(0 0 0.3em var(--background-primary));
    transition: fill var(--transition), filter var(--transition);
  }
}
</style>
