import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const { authenticated } = storeToRefs(authStore);

  const slug = to.params.id as string;

  const cookie = useCookie(`dbco-${slug}`);

  if (!cookie?.value) {
    authenticated.value = false;
    
    return navigateTo({
      path: '/password',
      query: {
        slug
      }
    });
  }

  if (cookie?.value) {
    authenticated.value = true;
  }
})