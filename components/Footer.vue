<template>
  <Grid v-if="data" element="footer" class="site-footer">
    <Space size="huger" />
    <Column v-if="data.links" span="12" span-tablet="6" span-laptop="2" class="social">
      <Text size="caption-2" class="title">{{ data.links.title }}</Text>
      <div class="content">
        <div v-for="link in data.links.content">
          <Text size="caption-2" class="content"
            >{{ link.cta }}<br />
            <a :href="link.url" target="_blank">{{ link.title }}</a
            ><br /><br
          /></Text>
        </div>
      </div>
    </Column>

    <Column
      v-if="data.privacy"
      span="12"
      span-tablet="6"
      start-tablet="7"
      span-laptop="2"
      start-laptop="auto"
      class="privacy"
    >
      <Text size="caption-2" class="title">{{ data.privacy.title }}</Text>
      <Text element="div" size="caption-2" class="content">
        <SanityContent
          :blocks="data.privacy.content"
          :serializers="customSerializers"
        />
      </Text>
    </Column>

    <Column
      v-if="data.colophon"
      span="12"
      span-tablet="6"
      start-tablet="7"
      span-laptop="2"
      start-laptop="auto"
      class="colophon"
    >
      <Text size="caption-2" class="title">{{ data.colophon.title }}</Text>
      <Text element="div" size="caption-2" class="content">
        <SanityContent
          :blocks="data.colophon.content"
          :serializers="customSerializers"
        />
      </Text>
    </Column>

    <Column
      v-if="data.thankYou"
      span="12"
      span-tablet="6"
      start-tablet="7"
      span-laptop="2"
      start-laptop="auto"
      class="thanks"
    >
      <Text size="caption-2" class="title">{{ data.thankYou.title }}</Text>
      <Text element="div" size="caption-2" class="content">
        <SanityContent
          :blocks="data.thankYou.content"
          :serializers="customSerializers"
        />
      </Text>
    </Column>

    <Column
      v-if="data.copyright"
      span="12"
      span-tablet="6"
      start-tablet="7"
      span-laptop="2"
      start-laptop="11"
      class="copyright"
    >
      <Text size="caption-2" class="title">Copyright</Text>
      <Text element="div" size="caption-2" class="content">
        &copy;2023-{{ date }}
      </Text>
    </Column>
  </Grid>
</template>

<script setup>
import { settingsFooter } from "~/queries/settingsFooter";
import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTheme } from "~/composables/useTheme";

const { resetTheme } = useTheme();

const footerRef = ref(null);

const { stop } = useIntersectionObserver(footerRef, ([entry]) => {
  if (entry.isIntersecting) {
    resetTheme();
  }
}, {
  threshold: 0,
  rootMargin: `0px 0px 0px 0px`,
})

const customSerializers = {
  marks: {
    link: BlockCopyLinkExternal,
  },
};

const { data, error, status, refresh } = await useSanityQuery(settingsFooter);

const date = new Date().getFullYear();

onBeforeUnmount(() => {
  stop();
})
</script>

<style lang="scss" scoped>
.site-footer {
  row-gap: var(--small);
  padding-top: var(--small);
  padding-bottom: var(--small);
}

.text-caption-2 {
  max-width: 40ch;
}

.title {
  color: var(--foreground-primary);
}

.content {
  color: var(--foreground-secondary);

  &:deep(a) {
    color: var(--foreground-primary);
  }
}

.column {
  display: grid;
  grid-template-columns: subgrid;
  padding-right: var(--smallest);

  &.social {
    @include tablet {
      .title {
        display: none;
      }
    }
  }

  .title {
    grid-column: 1 / 6;
  }
  .content {
    grid-column: 7 / 13;
  }

  @include tablet {
    display: block;
  }
}
</style>
