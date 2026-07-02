import { defineStore } from 'pinia';
import { gatedPagesQuery } from '~/queries/pages/page';

interface AuthPayloadInterface {
  slug: string;
  password: string;
}

interface AuthState {
  routes: string[];
  authenticatedRoutes: string[];
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    routes: [],
    authenticatedRoutes: [],
    loading: false,
  }),
  actions: {
    async fetchGatedPageRoutes() {
      const { data } = await useSanityQuery(gatedPagesQuery);

      if (data.value && Array.isArray(data.value)) {
        const routes = data.value.map((page: any) => page.slug) as string[];
        this.routes = routes;
      }
    },
    async authenticateUser({ slug, password }: AuthPayloadInterface) {
      this.loading = true;

      try {
        const data = await $fetch('/api/authenticate', {
          method: 'post',
          body: {
            slug,
            password,
          },
        });

        this.loading = false;

        if (!this.authenticatedRoutes.includes(slug)) {
          this.authenticatedRoutes.push(slug);
        }

        return {
          ok: true,
          ...data,
        }
      } catch (error: any) {
        this.loading = false;

        return {
          ok: false,
          message: error?.data?.statusMessage || 'Something went wrong',
        }
      }
    },
    logUserOut() {
      const token = useCookie('token');
      this.authenticatedRoutes = [];
      token.value = null;
    },
  },
});