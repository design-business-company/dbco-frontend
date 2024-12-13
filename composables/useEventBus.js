import { reactive } from "vue";

const eventBus = reactive({});

export function useEventBus() {
  function emit(event, payload) {
    if (!eventBus[event]) return;
    eventBus[event].forEach((callback) => callback(payload));
  }

  function on(event, callback) {
    if (!eventBus[event]) eventBus[event] = [];
    eventBus[event].push(callback);
  }

  function off(event, callback) {
    if (!eventBus[event]) return;
    eventBus[event] = eventBus[event].filter((cb) => cb !== callback);
  }

  return { emit, on, off };
}
