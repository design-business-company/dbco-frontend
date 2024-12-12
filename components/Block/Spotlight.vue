<template>
  <div class="spotlight">
    <BlockThemeSwitcher
      :theme="theme.theme"
      :background-primary="theme.backgroundPrimary"
      :foreground-primary="theme.foregroundPrimary"
      :accent-primary="theme.accentPrimary"
      :settings="theme.settings"
    >
      <Grid class="grid--full spotlight__content">
        <Space size="bigger" sizeTablet="big" />

        <Column>
          <BlockRule space-below="small" ref="rule" />
        </Column>

        <Column
          startMobile="1"
          spanMobile="12"
          spanLaptop="5"
          class="spotlight__heading"
        >
          <Text element="div" size="body-2" ref="name">
            <Observer :onEnter="onEnter" :onLeave="onLeave">
              <h2 class="spotlight__title">{{ title }}</h2>
              <span v-if="shortDescription" class="spotlight__separator">
                —
              </span>
              <span class="spotlight__short-description">
                <SanityContent
                  v-if="shortDescription"
                  :blocks="shortDescription.text"
                />
              </span>
            </Observer>
          </Text>
          <Observer
            class="spotlight__tags"
            ref="role"
            :onEnter="onEnter"
            :onLeave="onLeave"
          >
            <BlockTag v-for="tag in tags" :text="tag.title" :key="tag._key" />
          </Observer>
        </Column>

        <Column spanMobile="12" spanLaptop="6" startMobile="1" startLaptop="7">
          <Observer
            :onEnter="onEnter"
            :onLeave="onLeave"
            class="spotlight__details"
          >
            <Text
              element="div"
              size="caption-2"
              class="spotlight__description"
              ref="info"
            >
              <SanityContent
                v-if="description?.text"
                :blocks="description.text"
              />
            </Text>
            <Text
              element="div"
              size="caption-2"
              class="spotlight__credits"
              ref="cred"
            >
              <SanityContent v-if="credits?.text" :blocks="credits.text" />
            </Text>
          </Observer>
        </Column>

        <Space size="small" sizeTablet="big" />
      </Grid>

      <div class="spotlight__media">
        <BlockSpotlightMedia :items="media" v-if="media.length < 5" />
        <BlockSpotlightMediaCarousel
          :settings="settings"
          :items="media"
          v-else
        />
      </div>
      <Space size="bigger" sizeTablet="big" sizeLaptop="huger" />
    </BlockThemeSwitcher>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const name = ref(null);
const role = ref(null);
const rule = ref(null);
const info = ref(null);
const cred = ref(null);
const { createSplitText, clearSplitText } = useSplitText();

let textTitle;

onMounted(() => {
  // const els = getEls();
  textTitle = createSplitText(name.value.$el, "words");
});

// const getEls = () => {
//   return [
//     rule.value.$el,
//     name.value.$el,
//     ...role.value.children,
//     ...info.value.$el.children,
//     cred.value.$el,
//   ];
// };

const onEnter = (el) => {
  const els = el.children;

  Array.from(els).forEach((el) => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        delay: 0.2,
      }
    );
  });
};

const onLeave = (el) => {
  const els = el.children;

  Array.from(els).forEach((el) => {
    gsap.set(el, {
      opacity: 0,
    });
  });
};

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: Object,
    required: false,
  },
  description: {
    type: Object,
    required: true,
  },
  credits: {
    type: Object,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  media: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: false,
  },
  theme: {
    type: Object,
    required: false,
  },
});
</script>

<style lang="scss">
.spotlight {
  display: flex;
  flex-direction: column;
  // background-color: var(--background-primary);
  // color: var(--foreground-primary);

  &__content {
    padding-inline: var(--grid-margin);
    width: 100%;
    grid-template-rows: auto;
  }

  &__media {
    width: 100%;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    row-gap: var(--tiny);

    [class^="text-"] {
      max-width: 30ch;
    }

    p {
      display: inline;
    }
  }

  &__title {
    display: inline;
  }

  &__separator,
  &__short-description {
    color: inherit;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: var(--tinier);
    flex-wrap: wrap;
    margin-bottom: var(--smaller);
  }

  &__details {
    display: flex;
    flex-direction: column;
    row-gap: var(--smallest);

    @include tablet {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__description {
    display: flex;
    flex-direction: column;
    row-gap: var(--tiny);

    @include tablet {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column: auto / span 2;
      column-gap: var(--grid-gap);
    }

    & > p:only-child {
      grid-column-end: -1;
    }
  }

  &__details p {
    padding-right: var(--smallest);
  }

  &__credits {
    opacity: 0.6;
  }

  &__description > p,
  &__credits {
    max-width: 50ch;
  }
}
</style>
