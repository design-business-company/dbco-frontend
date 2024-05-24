<template>
  <nav>
    <ul>
      <li><NuxtLink to="/">Work</NuxtLink></li>
      <li><NuxtLink to="/about">About</NuxtLink></li>
      <li><NuxtLink to="/contact">Contact</NuxtLink></li>
      <li><NuxtLink to="/test">Slug</NuxtLink></li>
    </ul>
  </nav>
</template>

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
