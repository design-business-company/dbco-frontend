<template>
  <nav>
    <Text element="ul" size="caption-1">
      <li><NuxtLink to="/">Index</NuxtLink></li>
      <li><NuxtLink to="/about">About</NuxtLink></li>
      <li><NuxtLink to="/contact">Contact</NuxtLink></li>
      <li><NuxtLink to="/three">Three</NuxtLink></li>
      <li><NuxtLink to="/viewport">Viewport</NuxtLink></li>
    </Text>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: relative;
}

ul {
  display: flex;

  li {
    display: block;
    margin-right: 0.4em;
  }

  a {
    display: block;
    text-decoration: none;
    text-underline-offset: 0.15em;
    color: var(--foreground-tertiary);

    &.router-link-exact-active {
      color: var(--foreground-primary);
      text-decoration: underline;
      text-decoration-color: var(--accent-primary);
    }

    &:hover {
      color: var(--foreground-primary);
      text-decoration: underline;
    }
  }
}
</style>
