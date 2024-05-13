<style lang="scss" scoped>
.wrapper {
  width: 100%;
  overflow: hidden;
}

.intro {
  p {
    text-indent: var(--bigger);
  }
}
</style>

<template>
  <Grid class="wrapper">
    <Space size="huge" />
    <Column class="intro" tablet-span="10" laptop-span="6" laptop-start="7">
      <Text size="body-1">
        <p>
          We realize that naming a design company “Design Business Company” is
          like naming a dog, “dog”. Or a cat, “jerk”. It makes good sense and
          also makes us chuckle, so here we are. Anyhow, welcome. We’re glad
          you’re here.
        </p>
        <p>
          We’re a creative studio that designs brand identities, websites, apps,
          typefaces, and much more. We do this sort of thing for clients of all
          shapes and sizes—from startups to Fortune 500s, musicians to tech
          giants. tenetur recusandae distinctio?
        </p>
        <!-- <Space size="b" /> -->
      </Text>
    </Column>
    <Space size="bigger" />

    <Column class="intro">
      <AboutClients />
    </Column>
    <Space size="bigger" />
    <Column class="intro" tablet-span="9" laptop-span="6" laptop-start="7">
      <Text size="body-2">
        <p>
          We realize that naming a design company “Design Business Company” is
          like naming a dog, “dog”. Or a cat, “jerk”. It makes good sense and
          also makes us chuckle, so here we are. Anyhow, welcome. We’re glad
          you’re here.
        </p>
        <p>
          We’re a creative studio that designs brand identities, websites, apps,
          typefaces, and much more. We do this sort of thing for clients of all
          shapes and sizes—from startups to Fortune 500s, musicians to tech
          giants. tenetur recusandae distinctio?
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          assumenda quis odit similique. Delectus necessitatibus magni
          reprehenderit repellat in perspiciatis? Exercitationem ipsum optio
          natus doloribus unde aliquid distinctio rerum numquam.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          assumenda quis odit similique. Delectus necessitatibus magni
          reprehenderit repellat in perspiciatis? Exercitationem ipsum optio
          natus doloribus unde aliquid distinctio rerum numquam.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          assumenda quis odit similique. Delectus necessitatibus magni
          reprehenderit repellat in perspiciatis? Exercitationem ipsum optio
          natus doloribus unde aliquid distinctio rerum numquam.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          assumenda quis odit similique. Delectus necessitatibus magni
          reprehenderit repellat in perspiciatis? Exercitationem ipsum optio
          natus doloribus unde aliquid distinctio rerum numquam.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          assumenda quis odit similique. Delectus necessitatibus magni
          reprehenderit repellat in perspiciatis? Exercitationem ipsum optio
          natus doloribus unde aliquid distinctio rerum numquam.
        </p>
        <!-- <Space size="b" /> -->
      </Text>
    </Column>
  </Grid>
</template>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { Theme } from "~/composables/Theme";
const { setTheme } = Theme();

setTheme({
  background: "#ffffff",
  foreground: "#000000",
  accent: "#ff0000",
});

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "About" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});

const query = groq`*[_type=="clients"]`;
const { data } = useSanityQuery(query);
</script>
