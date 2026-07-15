<template>
  <div class="spotlight" ref="spotlightRef">
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
          :title="title"
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
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import observe from "~/composables/Observer";

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
  if (!el?.children) return;

  Array.from(el.children).forEach((child) => {
    if (child) {
      gsap.set(child, {
        opacity: 0,
      });
    }
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

/*--------------------------------------------------------
  Attention tracking: accumulates the total time this
  spotlight is ≥35% visible across the whole page visit
  (clock pauses while it's out of view or the tab is
  hidden). As cumulative dwell crosses each milestone we
  fire an event immediately — Plausible can only count
  events, so per-project interest reads as a funnel:
  "Project view" (2s) → "Project dwell" 10s → 30s.
--------------------------------------------------------*/
const spotlightRef = ref(null);

const DWELL_MILESTONES = [
  { ms: 2000, event: "Project view", props: {} },
  { ms: 10000, event: "Project dwell", props: { milestone: "10s" } },
  { ms: 30000, event: "Project dwell", props: { milestone: "30s" } },
];

let accumulatedMs = 0;
let visibleSince = null;
let milestoneIndex = 0;
let milestoneTimer = null;
let elementInView = false;

const currentDwell = () =>
  accumulatedMs + (visibleSince !== null ? performance.now() - visibleSince : 0);

const scheduleNextMilestone = () => {
  clearTimeout(milestoneTimer);
  const next = DWELL_MILESTONES[milestoneIndex];
  if (!next || visibleSince === null) return;

  milestoneTimer = setTimeout(() => {
    useTrackEvent(next.event, {
      props: { project: props.title, ...next.props },
    });
    milestoneIndex += 1;
    scheduleNextMilestone();
  }, Math.max(0, next.ms - currentDwell()));
};

const startDwell = () => {
  if (visibleSince !== null) return;
  visibleSince = performance.now();
  scheduleNextMilestone();
};

const pauseDwell = () => {
  if (visibleSince === null) return;
  accumulatedMs += performance.now() - visibleSince;
  visibleSince = null;
  clearTimeout(milestoneTimer);
};

observe({
  element: spotlightRef,
  options: { threshold: 0.35 },
  onEnter: () => {
    elementInView = true;
    if (!document.hidden) startDwell();
  },
  onLeave: () => {
    elementInView = false;
    pauseDwell();
  },
});

const onVisibilityChange = () => {
  if (document.hidden) pauseDwell();
  else if (elementInView) startDwell();
};

onMounted(() => {
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  pauseDwell();
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
    color: var(--foreground-secondary);
  }

  &__description > p,
  &__credits {
    max-width: 50ch;
  }
}
</style>
