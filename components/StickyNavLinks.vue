<template>
  <nav>
    <ul>
      <li><NuxtLink to="/">Work</NuxtLink></li>
      <li><NuxtLink to="/about">About</NuxtLink></li>
      <li><NuxtLink to="/contact">Contact</NuxtLink></li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: relative;
  z-index: 999;
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

    &.router-link-exact-active {
      color: var(--foreground-primary);
      text-decoration-color: var(--accent-primary);
    }

    &:hover {
      color: var(--foreground-primary);
      text-decoration: underline;
    }
  }
}
</style>
