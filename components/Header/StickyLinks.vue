<template>
  <nav>
    <ul>
      <li v-for="link in links">
        <nuxt-link :to="link.slug === null ? '/' : link.slug">{{
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
  z-index: 998;
}

ul {
  display: flex;

  li {
    margin-right: 0.5em;
  }

  a {
    display: block;
    text-decoration: none;
    text-underline-offset: 0.15em;
    color: var(--foreground-tertiary);
    padding: var(--tinier) 0;
    will-change: color;
    transition: color var(--transition);

    &.router-link-exact-active {
      color: var(--foreground-primary);
    }

    &:hover {
      color: var(--foreground-primary);
    }
  }
}
</style>
