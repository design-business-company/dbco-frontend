<template>
  <nav>
    <ul>
      <li v-for="link in links">
        <nuxt-link :to="link.slug === null ? '/' : `/${link.slug}`">{{
          link.title
        }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  links: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
nav {
  position: relative;
}

ul {
  a {
    display: block;
    text-decoration: none;
    text-underline-offset: 0.15em;
    transition: color var(--transition);

    color: color-mix(
      in srgb,
      var(--foreground-primary) 40%,
      var(--background-primary) 60%
    );

    &.router-link-exact-active {
      color: var(--foreground-primary);
    }

    &:hover {
      color: var(--foreground-primary);
    }
  }
}
</style>
