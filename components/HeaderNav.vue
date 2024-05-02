<template>
  <nav>
    <ul>
      <li><NuxtLink to="/">Index</NuxtLink></li>
      <li><NuxtLink to="/about">About</NuxtLink></li>
      <li><NuxtLink to="/contact">Contact</NuxtLink></li>
      <li><NuxtLink to="/three">Three</NuxtLink></li>
      <li><NuxtLink to="/viewport">Viewport</NuxtLink></li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: relative;
  margin-bottom: 2rem;
  z-index: 999;
}

ul {
  display: flex;
  padding-top: calc(var(--unit-small) + var(--unit-smaller));
  padding-left: var(--unit-big);

  li {
    display: block;
    margin-right: 0.4em;
  }

  a {
    display: block;
    text-decoration: none;
    text-underline-offset: 0.15em;

    &.router-link-exact-active {
      color: var(--color-foreground);
      text-decoration: underline;
      text-decoration-color: var(--color-interactive);
    }

    &:hover {
      color: var(--color-foreground);
      text-decoration: underline;
    }
  }
}
</style>
