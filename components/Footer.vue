<template>
  <Grid v-if="data" element="footer" class="site-footer">
    <Column
      v-if="data.links"
      span="12"
      span-tablet="6"
      span-laptop="2"
      class="social"
    >
      <Text size="caption-2" class="title">{{ data.links.title }}</Text>
      <div class="content">
        <div v-for="link in data.links.content">
          <Text size="caption-2" class="content"
            ><span style="color: var(--foreground-secondary)">{{
              link.cta
            }}</span
            ><br />
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
      span="12"
      span-tablet="6"
      start-tablet="7"
      span-laptop="2"
      start-laptop="11"
      class="copyright"
    >
      <Text size="caption-2" class="title">Copyright</Text>
      <Text element="div" size="caption-2" class="content copyright">
        &copy;2023–{{ date }}
      </Text>
    </Column>
  </Grid>
</template>

<script setup>
import { settingsFooter } from "~/queries/settingsFooter";
import BlockCopyLinkExternal from "~/components/Block/CopyLinkExternal.vue";

const customSerializers = {
  marks: {
    link: ({ value }, { slots }) => {
      return h(
        BlockCopyLinkExternal,
        {
          ...value,
        },
        slots.default?.()
      );
    },
  },
};

const { data } = await useSanityQuery(settingsFooter);

const date = new Date().getFullYear();

onBeforeUnmount(() => {
  stop();
});
</script>

<style lang="scss" scoped>
.site-footer {
  row-gap: var(--small);
  padding-top: var(--biggest);
  padding-bottom: var(--biggest);
  margin-top: var(--biggest);

  @include tablet {
    padding-top: var(--big);
    padding-bottom: var(--big);
  }
}

.text-caption-2 {
  max-width: 40ch;
}

.title {
  color: var(--foreground-secondary);
}

.content {
  color: var(--foreground-primary);

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

.copyright {
  font-variant-numeric: tabular-nums;
}
</style>
