<template>
  <a @click.prevent="handleNavClick" :href="to" :class="{ 'router-link-active': isActive }" v-bind="$attrs">
    <slot />
  </a>
</template>

<script lang="ts" setup>
const props = defineProps<{
  to: string;
  currentPath: string;
}>();

const { to, currentPath } = toRefs(props);

const emit = defineEmits(["link-click"]);

const isActive = computed(() => {
  return to.value === currentPath.value;
});

const handleNavClick = () => {
  emit("link-click", to.value);
};
</script>
