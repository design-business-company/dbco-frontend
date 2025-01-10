# Composables

## `observe` Composable

The `observe` composable provides a reactive Vue interface for utilizing the Intersection Observer API, enabling component visibility tracking. This can be extremely useful for triggering actions when elements enter or leave the viewport, such as lazy loading images or triggering animations.

### Usage

```js
// First, import the composable into your component:
import observe from "~/composables/Observer";

// Define a ref for the element you wish to observe:
const elObserved = ref({});

// Initialize the observer by passing your element and callback functions for the visibility change events:
const { isIntersecting } = observe({
  element: elObserved,
  onEnter: () => console.log("Element is intersecting"),
  onLeave: () => console.log("Element is not intersecting"),
});
```

### API

Observe accepts an options object with the following properties:

- `element`: A Vue ref pointing to the HTMLElement you want to observe.
- `onEnter`: Function that is called when the observed element enters the viewport.
- `onLeave` (optional): Function that is called when the observed element leaves the viewport.
- `once` (optional): Boolean indicating whether the observer should stop observing after the first intersection.
- `options` (optional): An object containing options for the Intersection Observer such as root, rootMargin, and threshold.

## `Theme` Composable

The `Theme` composable is a powerful tool for dynamically managing and applying CSS themes across your Nuxt application. It leverages a Vuex store to keep track of theme changes and applies these changes directly to CSS variables, ensuring that your UI remains consistent and responsive to user preferences or system settings.

### Usage

```js
// Import the composable into your component
import { useTheme } from "~/composables/useTheme";

// Initialize the theme composable
const { setTheme, theme } = useTheme();

// You can set a new theme dynamically
setTheme({
  background: "#282c34",
  foreground: "#abb2bf",
  accent: "#e06c75",
});
```

This composable provides an intuitive and efficient way to manage themes by updating CSS variables based on the current theme object stored in the Vuex store.

### API

The Theme composable provides the following functionalities:

- `setTheme(newTheme: Partial<{ background, foreground, accent }>)`: Updates the theme by merging new properties with the existing theme values. This is useful for partial updates where only specific aspects of the theme need adjustment.

- `theme`: Access the current theme directly from the Vuex store, allowing you to reactively use theme properties anywhere in your application.

### Implementation Details

- Initial Theme Application: When the component mounts, the onBeforeMount lifecycle hook calls updateCssVariables to apply the initial theme settings based on the current state in the Vuex store.

- Reactivity to Changes: The composable watches the Vuex store for any changes to the theme. When changes occur, it automatically updates the CSS variables to reflect these changes across the entire application.

- Direct CSS Manipulation: By setting CSS properties directly on the document.documentElement, the composable ensures that theme changes are globally effective, impacting all components that use these variables.
