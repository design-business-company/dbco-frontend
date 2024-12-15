import { defineStore } from 'pinia';
import { gatedPagesQuery } from '~/queries/pages/page';

interface AuthPayloadInterface {
  slug: string;
  password: string;
}

interface AuthState {
  routes: string[];
  authenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    routes: [],
    authenticated: false,
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
      const env = process.env.NODE_ENV;
      this.loading = true;

      const baseUrl = env === 'development' ? 'http://localhost:3000' : 'https://dbco.online';

      try {
        const { data, error }: any = await useFetch(`${baseUrl}/api/authenticate?slug=${slug}&password=${password}`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: {
            slug,
            password,
          },
        });

        this.loading = false;

        if (error?.value) {
          return {
            ok: false,
            message: error.value?.data?.statusMessage
          }
        }

        if (data?.value) {
          this.authenticated = true;

          return {
            ok: true,
            ...data?.value,
          }
        }

        return {
          ok: false,
          error: 'Something went wrong',
        }
      } catch (error) {
        console.error(error)
        this.loading = false;

        return {
          ok: false,
          error: 'Something went wrong',
        }
      }
    },
    logUserOut() {
      const token = useCookie('token');
      this.authenticated = false;
      token.value = null;
    },
  },
});