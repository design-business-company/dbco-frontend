<template>
  <h1>
    <span class="name-full">Design Business Company</span>
    <abbr class="name-abbr" aria-label="Design Business Company">DBCo</abbr>
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

    @media (min-width: 450) {
      display: block;
    }
  }

  .name-abbr {
    display: block;

    @media (min-width: 450) {
      display: none;
    }
  }
}
</style>
