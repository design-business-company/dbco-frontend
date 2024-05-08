<template>
  <div>
    <button @click="debugActive = !debugActive">🐛</button>
    <client-only>
      <table v-show="debugActive">
        <tbody>
          <tr v-for="(value, index) in deviceProperties" :key="index">
            <td>{{ value[0] }}</td>
            <td
              :class="[
                { 'is-true': value[1] === true },
                { 'is-false': value[1] === false },
              ]"
            >
              {{ value[1] }}
            </td>
          </tr>
        </tbody>
      </table>
    </client-only>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDeviceStore } from "~/stores/device";

const debugActive = ref(false);
const deviceStore = useDeviceStore();

// Maps the device state to an array of [key, value] pairs,
// Excluding the properties that are not part of the state or you don't want to display.
const deviceProperties = computed(() => {
  // Use Object.keys, Object.values, or Object.entries on deviceStore.$state if it's available
  // to get the reactive state's own properties, filtering out the ones you don't want to display.
  const state = deviceStore.$state || deviceStore;
  return Object.entries(state).filter(([key]) => {
    // Filter out the properties you do not want to include
    return !["unwantedProperty1", "unwantedProperty2"].includes(key);
  });
});
</script>

<style scoped>
button {
  font-size: inherit;
  appearance: none;
  background-color: transparent;
  display: block;
  color: var(--foreground-primary);
  text-decoration: none;
  border-radius: 100vw;
  cursor: pointer;
  border: 0;

  position: fixed;
  top: var(--small);
  right: var(--big);
  z-index: 999;
}

table {
  font-size: 0.8rem;
  font-family: monospace;
  border: 2px solid var(--background-primary);
  position: fixed;
  z-index: 999;
  top: var(--bigger);
  right: 0;
}

tr {
  border-bottom: 2px solid var(--background-primary);
}

td {
  padding: 1px 2px;
}

td:first-child {
  background: var(--background-secondary);
}

td:last-child {
  background: blue;
}

td.is-false {
  background: red;
}

td.is-true {
  background: green;
}

@media (prefers-color-scheme: light) {
  td {
    color: var(--background-primary);
  }
}
</style>
