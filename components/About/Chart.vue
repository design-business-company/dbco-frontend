<template>
  <div class="chart" ref="svgContainer"></div>
</template>

<script setup>
import { useEventBus } from "~/composables/useEventBus";
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const svgContainer = ref(null);

// List of names to cycle through
const names = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Jane",
  "Kyle",
  "Laura",
  "Mason",
  "Nina",
  "Oscar",
  "Paula",
  "Quincy",
  "Rachel",
  "Steve",
  "Tina",
  "Uma",
  "Victor",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
];

let index = 0; // Current index in the names list

const { on } = useEventBus();
const pageHasMounted = ref(false);

on("page::mounted", () => (pageHasMounted.value = true));

watch(
  () => pageHasMounted.value,
  (newValue) => {
    if (newValue) {
      init();
    }
  }
);

const init = () => {
  const svg = d3
    .select(svgContainer.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      `0 0 ${svgContainer.value.clientWidth} ${svgContainer.value.clientHeight}`
    )
    .attr("preserveAspectRatio", "xMidYMid meet");

  let width = svgContainer.value.clientWidth;
  let height = svgContainer.value.clientHeight;
  let circleSize = 50;

  const nodes = []; // Active nodes
  const links = []; // Connections between nodes

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(50)) // Add link force
    .force("charge", d3.forceManyBody().strength(-30)) // Reduced repulsion for closer attraction
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.5)) // Increased central attraction strength
    .force("collision", d3.forceCollide().radius(circleSize))
    .force("bounds", () => {
      nodes.forEach((node) => {
        node.x = Math.max(circleSize, Math.min(width - circleSize, node.x));
        node.y = Math.max(circleSize, Math.min(height - circleSize, node.y));
      });
    })
    .on("tick", ticked);

  const linkGroup = svg.append("g").attr("class", "links");
  const nodeGroup = svg.append("g").attr("class", "nodes");

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
      .attr("r", circleSize / 2)
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

    // Add a link to a random existing node, if any
    if (nodes.length > 1) {
      const targetNode = nodes[Math.floor(Math.random() * (nodes.length - 1))];
      links.push({ source: newNode, target: targetNode });
    }

    // Update the simulation
    simulation.nodes(nodes);
    simulation.force("link").links(links); // Update links
    simulation.alpha(0.5).restart(); // Restart with lower alpha to stabilize the layout
  }

  const intervalId = setInterval(addNode, 100); // Add nodes at intervals

  window.addEventListener("resize", () => {
    width = svgContainer.value.clientWidth;
    height = svgContainer.value.clientHeight;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    simulation.force("center", d3.forceCenter(width / 2, height / 2));

    // Update node positions to remain within bounds
    simulation.force("bounds", () => {
      nodes.forEach((node) => {
        node.x = Math.max(circleSize, Math.min(width - circleSize, node.x));
        node.y = Math.max(circleSize, Math.min(height - circleSize, node.y));
      });
    });

    simulation.alpha(1).restart();
  });
};
</script>

<style lang="scss">
.chart {
  height: 50vh;
  width: 100%;

  circle {
    // fill: none;
    fill: white;
    filter: blur(8px);
  }

  text {
    font-size: clamp(14px, 1vw, 16px);
    color: blue;
    background: red;
  }
}
</style>
