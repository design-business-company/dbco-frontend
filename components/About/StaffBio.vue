<template>
  <article class="staff-bio">
    <BlockMedia :media="images[0].media[0]" sizes="(max-width: 429px) 90vw, (max-width: 600px) 50vw, 30vw" class="staff-bio__image" />
    <div class="bio">
      <header>
        <Text element="h1" size="caption-2">{{ name }}</Text>
      </header>
      <BlockTextBody :blocks="bio.text" />
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
    default: "name",
  },
  role: {
    type: String,
    required: true,
    default: "role",
  },
  images: {
    type: Array,
    required: true,
    default: [],
  },
  bio: {
    type: Object,
    required: true,
    default: {},
  },
});
</script>

<style lang="scss" scoped>
.staff-bio {
  margin-bottom: var(--grid-gap);

  header {
    font-variation-settings: "wght" 650;
  }

  .bio {
    padding-top: var(--smallest);
    padding-bottom: var(--big);

    @include phablet {
      padding-top: 0;
    }

    @include tablet {
      padding-top: var(--tinier);
    }

    @include laptop {
      padding-top: var(--tiny);
    }

    > * {
      padding-right: var(--smallest);
      max-width: 45ch;
    }

    > *:first-child {
      margin-bottom: var(--tiniest);
    }

    > *:last-child {
      color: var(--foreground-secondary);
    }
  }

  @include phablet {
    display: flex;
    gap: var(--grid-gap);

    > * {
      width: 100%;

      &:first-child {
        order: 1;
      }
    }
  }

  @include tablet {
    display: flex;
    flex-direction: column;

    > * {
      &:first-child {
        order: 0;
      }
    }
  }

  @include desktop {
    .bio {
      display: grid;
      grid-template-columns: subgrid;
      grid-template-columns: 1fr 2fr;
      gap: var(--grid-gap);

      > *:first-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
