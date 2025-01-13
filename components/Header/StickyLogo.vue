<template>
  <h1>
    <span class="name-full"
      ><nuxt-link to="/">Design Business Company</nuxt-link></span
    >
    <abbr class="name-abbr" aria-label="Design Business Company"
      ><nuxt-link to="/">DBCo</nuxt-link></abbr
    >
  </h1>
</template>

<style lang="scss" scoped>
h1 {
  cursor: pointer;
  overflow: visible;
  white-space: nowrap;
  position: relative;
  padding: var(--tinier) 0;

  .name-full {
    display: none;

    @media (min-width: 450px) {
      display: block;
    }
  }

  .name-abbr {
    display: block;

    @media (min-width: 450px) {
      display: none;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition);

    &:hover {
      color: var(--foreground-secondary);
      transition: color 150ms var(--transition-function);
    }
  }
}
</style>
