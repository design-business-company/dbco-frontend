/**
 * When Nuxt renders the error page (/__nuxt_error), it builds payload.error
 * from the request's query params. h3's getQuery() returns a null-prototype
 * object, and @pinia/nuxt's payload reducer calls obj.hasOwnProperty() on
 * every payload object — so serializing the error payload throws
 * "obj.hasOwnProperty is not a function", the error page render dies, and
 * Nuxt serves its built-in fallback 500 instead of error.vue (this also
 * turned every 404 into a 500). Re-creating the error object with a normal
 * prototype before payload serialization fixes it. (pinia 2.3.1)
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:rendered", () => {
    const error = nuxtApp.payload.error as Record<string, unknown> | undefined;

    if (error && typeof error.hasOwnProperty !== "function") {
      nuxtApp.payload.error = {
        ...error,
      } as unknown as typeof nuxtApp.payload.error;
    }
  });
});
