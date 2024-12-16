import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  const slug = to.params.id as string;

  if (!authStore.routes.includes(slug)) {
    return;
  }

  if (!authStore.authenticated) {
    return navigateTo({
      path: '/password',
      query: {
        slug
      }
    });
  } else {
    authStore.authenticated = false;
  }
})