<template>
  <h1>
    <span @mouseover="() => shuffle(line[0])">{{ line[0].val }}</span>
    <span @mouseover="() => shuffle(line[1])">{{ line[1].val }}</span>
    <span @mouseover="() => shuffle(line[2])">{{ line[2].val }}</span>
  </h1>
</template>

<style>
span {
  display: flex;
  cursor: crosshair;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const shuffleDuration = 100;
const resetDuration = 3000;

const line = ref([
  {
    name: "Design",
    val: "Design",
    animating: false,
    resetTimer: null,
    options: [
      "Damn Good",
      "Democratic",
      "Dazzling",
      "Delightful",
      "Dynamic",
      "Dreamy",
      "Daring",
      "Decorative",
      "Dramatic",
      "Danceable",
      "Distinct",
      "Divine",
      "Decadent",
      "Desirable",
      "Dainty",
      "Delicate",
      "Detailed",
      "Distinguished",
      "Dazzle",
      "Doodle",
      "Da Vinci",
      "Devotion",
    ],
  },
  {
    name: "Business",
    val: "Business",
    animating: false,
    resetTimer: null,
    options: [
      "Beautiful",
      "Brilliant",
      "Bold",
      "Breathtaking",
      "Business-savvy",
      "Balanced",
      "Business-minded",
      "Beauteous",
      "Bespoke",
      "Blissful",
      "Breakthrough",
      "Benevolent",
      "Businesslike",
    ],
  },
  {
    name: "Company",
    val: "Company",
    animating: false,
    resetTimer: null,
    options: [
      "Collective",
      "Conglomerate",
      "Characters",
      "Conspiracy",
      "Cult",
      "Community",
      "Cohort",
      "Citizens",
      "Coalition",
      "Crew",
      "Clan",
      "Collaborators",
      "Camaraderie",
      "Comrades",
      "Congregation",
      "Chorus",
      "Coterie",
      "Clique",
      "Companions",
      "Council",
      "Convoy",
      "Comradeship",
      "Cell",
      "Co-op",
      "Chamber",
    ],
  },
]);

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // ES6 destructuring swap
  }
}

const timers = ref([]);

function shuffle(obj) {
  if (obj.animating) return;

  clearTimeout(obj.resetTimer);
  obj.animating = true;
  let timesRun = 0;

  const interval = setInterval(() => {
    timesRun += 1;
    shuffleArray(obj.options);
    obj.val = obj.options[0];

    if (timesRun >= 8) {
      clearInterval(interval);
      obj.animating = false;

      obj.resetTimer = setTimeout(() => {
        obj.val = obj.name;
      }, resetDuration);
      timers.value.push(obj.resetTimer); // Store timer for cleanup
    }
  }, shuffleDuration);

  timers.value.push(interval); // Store interval for cleanup
}

onMounted(() => {
  shuffleArray(line.value[0].options);
});

onUnmounted(() => {
  // Clear all intervals and timeouts when component unmounts
  timers.value.forEach((timer) => clearTimeout(timer));
  timers.value = []; // Optionally reset the timers array
});

// function reset() {
//   line.forEach((line) => (line.val = line.name));
// }
// function shuffleAll() {
//   line.forEach((line) => shuffle(line));
// }
</script>
