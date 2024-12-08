<template>
  <span class="link">
    <NuxtLink :to="resolveLink($attrs)" class="link">
      <slot />
    </NuxtLink>
  </span>
</template>

<script setup>
defineOptions({
  inheritAttrs: true,
});

// Map specific references to routes
const routeMap = {
  home: "/",
  about: "/about",
  contact: "/contact",
};

// Resolve the link
const resolveLink = (attrs) => {
  const ref = attrs.reference?._ref;
  return routeMap[ref] || attrs.slug || attrs.value.slug || "/"; // Fallback to slug or homepage
};
</script>

<style scoped>
.link {
  display: inline-block;
}
</style>
