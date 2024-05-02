<!--------------------------------------
  Usage
  --------------------------------------

  <Observer
    :onEnter="onEnter"
    :onLeave="onLeave"
    :options="{ threshold: 0.0 }"
    :once="false"
    v-slot="{ isIntersecting }"
  >
    <div>Content to observe</div>
  </Observer>

 --------------------------------------->

<template>
  <div ref="observerElement">
    <slot :isIntersecting="isIntersecting"></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import observe from "~/composables/Observer";

const props = defineProps({
  onEnter: Function,
  onLeave: Function,
  options: {
    type: Object,
    default: () => ({}),
  },
  once: {
    type: Boolean,
    default: false,
  },
});

const observerElement = ref(null);
const emit = defineEmits(["update:isIntersecting"]);

const { isIntersecting } = observe({
  element: observerElement,
  onEnter: () => {
    props.onEnter?.(observerElement.value);
    emit("update:isIntersecting", true);
  },
  onLeave: () => {
    props.onLeave?.(observerElement.value);
    emit("update:isIntersecting", false);
  },
  options: props.options,
  once: props.once,
});

onMounted(() => {
  watch(isIntersecting, (newValue) => {
    emit("update:isIntersecting", newValue);
  });
});
</script>
