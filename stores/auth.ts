import { defineStore } from 'pinia';

interface AuthPayloadInterface {
  slug: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {
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