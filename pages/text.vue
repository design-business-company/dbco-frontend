<template>
  <div>
    <Grid>
      <Space size="huge" />
    </Grid>

    <Grid>
      <Column><Text size="micro" indent>Left, Indented</Text></Column>
      <Space size="tiny" />
      <Column span-tablet="9" span-laptop="6">
        <Text indent size="body-1"
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi.</Text
        ><Text indent
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat? Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Atque impedit reprehenderit ut veniam
          voluptatem nobis eligendi. Pariatur, eligendi quae quas sunt quis
          quibusdam totam perspiciatis provident consectetur nihil? Cupiditate,
          fugiat?</Text
        ><Text indent size="caption-1"
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat? Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Atque impedit reprehenderit ut veniam
          voluptatem nobis eligendi. Pariatur, eligendi quae quas sunt quis
          quibusdam totam perspiciatis provident consectetur nihil? Cupiditate,
          fugiat?</Text
        ><Text indent size="caption-1"
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat? Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Atque impedit reprehenderit ut veniam
          voluptatem nobis eligendi. Pariatur, eligendi quae quas sunt quis
          quibusdam totam perspiciatis provident consectetur nihil? Cupiditate,
          fugiat?</Text
        ></Column
      >
    </Grid>

    <Grid>
      <Space size="huge" />
      <Column span-tablet="9" span-laptop="6" start-laptop="4"
        ><Text size="micro">Center</Text></Column
      >
      <Space size="tiny" />
      <Column span-tablet="9" span-laptop="6" start-laptop="4">
        <Text element="div">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
            impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
            eligendi quae quas sunt quis quibusdam totam perspiciatis provident
            consectetur nihil? Cupiditate, fugiat?
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
            impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
            impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
            impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
            eligendi quae quas sunt quis quibusdam totam perspiciatis provident
            consectetur nihil? Cupiditate, fugiat?
          </p>
        </Text>
      </Column>
    </Grid>

    <Grid>
      <Space size="huge" />
      <Column start-laptop="7"><Text size="micro">Right</Text></Column>
      <Space size="tiny" />
      <Column span-tablet="9" span-laptop="6" start-laptop="7">
        <Text
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat?</Text
        ><Text
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat?</Text
        ><Text
          >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque
          impedit reprehenderit ut veniam voluptatem nobis eligendi. Pariatur,
          eligendi quae quas sunt quis quibusdam totam perspiciatis provident
          consectetur nihil? Cupiditate, fugiat?</Text
        ></Column
      >
    </Grid>

    <Grid><Space size="huge" /></Grid>
  </div>
</template>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
const { setPageTheme } = useTheme();

onBeforeMount(() => {
  setPageTheme({
    background: "#000000",
    foreground: "#cccccc",
    accent: "#0000ff",
  });
});

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "Text" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
