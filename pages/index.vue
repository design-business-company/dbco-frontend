<template>
  <Grid v-if="data">
    <Column>
      <button @click="shuffleColors">
        <Text>Shuffle Color</Text>
      </button>
    </Column>
    <Column
      v-for="color in backgroundColors"
      class="swatch"
      span="4"
      :style="{
        backgroundColor: `var(--${color})`,
      }"
    >
      <Text size="micro">{{ color }}</Text>
    </Column>

    <Column
      v-for="color in backgroundColors"
      class="swatch"
      span="4"
      :style="{
        backgroundColor: `var(--${color})`,
      }"
    >
      <Text
        size="body-1"
        v-for="color in foregroundColors"
        :style="{
          color: `var(--${color})`,
        }"
        >Aa</Text
      >
    </Column>
  </Grid>
</template>

<style lang="scss">
@import "@/assets/styles/mixins.scss";

.swatch {
  aspect-ratio: 1 / 1;
  transition: background-color var(--transition);

  .text-body-1 {
    transition: color var(--transition);
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
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
const { setTheme } = useTheme();

const backgroundColors = [
  "background-primary",
  "background-secondary",
  "background-tertiary",
];

const foregroundColors = [
  "foreground-primary",
  "foreground-secondary",
  "foreground-tertiary",
  "accent-primary",
];

setTheme({
  background: "#fff",
  foreground: "#0000ff",
  accent: "#ff0000",
});

function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (decimal equivalent of 'ffffff')
  const randomNumber = Math.floor(Math.random() * 16777216);
  // Convert the number to a hexadecimal string and pad with leading zeros if necessary
  const hexColor = "#" + randomNumber.toString(16).padStart(6, "0");
  return hexColor;
}

function getContrastYIQ(hexcolor) {
  // Calculate the contrast of a color
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "dark" : "light";
}

function getRandomSaturatedColor() {
  // Generate a random saturated color
  const letters = "89ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

const shuffleColors = () => {
  let backgroundColor, foregroundColor;

  do {
    backgroundColor = getRandomHexColor();
    foregroundColor = getRandomHexColor();
  } while (getContrastYIQ(backgroundColor) === getContrastYIQ(foregroundColor));

  const accentColor = getRandomSaturatedColor();

  setTheme({
    background: backgroundColor,
    foreground: foregroundColor,
    accent: accentColor,
  });
};

const query = groq`*[_type=="homepage"]`;
const { data } = useSanityQuery(query);

// Run common mount/unmount scripts. Setup SEO, etc.
PageSetup({
  seoMeta: { title: "Index" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
