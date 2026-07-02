import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const { public: { bypassPasswordGate } } = useRuntimeConfig();

  if (bypassPasswordGate) {
    return;
  }

  const authStore = useAuthStore();

  const slug = to.params.id as string;

  if (!authStore.routes.includes(slug)) {
    return;
  }

  if (!authStore.authenticatedRoutes.includes(slug)) {
    return navigateTo({
      path: '/password',
      query: {
        slug
      }
    });
  }
})