import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  const slug = to.params.id as string;

  if (!authStore.routes.includes(slug)) {
    return;
  }

  const cookie = useCookie(`dbco-${slug}`);

  if (!cookie?.value) {
    authStore.authenticated = false;
    
    return navigateTo({
      path: '/password',
      query: {
        slug
      }
    });
  }

  if (cookie?.value) {
    authStore.authenticated = true;
  }
})