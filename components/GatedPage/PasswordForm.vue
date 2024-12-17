<template>
  <form class="password-form" @submit.prevent="submit">
    <Text element="h2" size="body-1" class="password-form__title">
      Enter password
    </Text>

    <div class="password-form__input">
      <Input
        :type="passwordVisible ? 'text' : 'password'"
        @update:modelValue="updatePassword"
        placeholder="Password"
        :invalid="error"
        :valid="success"
      >
        <template #icon>
          <button
            type="button"
            class="password-form__visibility-toggle"
            @click.prevent="togglePasswordVisibility"
            :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
          >
            <Icon :name="passwordVisible ? 'EyeHidden' : 'EyeVisible'" />
          </button>
        </template>
      </Input>
      <Button icon="arrowRight" as="button" type="submit" :disabled="loading">
        {{ loading ? "Submitting" : "Submit" }}
      </Button>
    </div>

    <div class="password-form__messages">
      <Text v-if="error" size="caption-2" class="password-form__error">{{
        error
      }}</Text>
      <Text v-if="success" size="caption-2" class="password-form__success"
        >Success! Redirecting...</Text
      >
    </div>
  </form>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const password = ref("");
const passwordVisible = ref(false);
const error = ref(null);
const success = ref(false);

const props = defineProps({
  slug: String,
});

const updatePassword = (value) => {
  error.value = null;
  password.value = value;
};

const { slug } = toRefs(props);

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const submit = async () => {
  loading.value = true;
  success.value = false;
  error.value = null;

  const result = await authStore.authenticateUser({
    slug: props.slug,
    password: password.value,
  });

  loading.value = false;

  if (!result || !result.ok) {
    error.value = result?.message || "Invalid password";
  }

  if (result?.ok) {
    success.value = true;

    navigateTo(`/${props.slug}`);
  }

  return;
};
</script>

<style lang="scss" scoped>
.password-form {
  width: 100%;
  position: relative;

  &__input {
    width: 100%;
    display: flex;
    gap: var(--tinier);
    margin-top: var(--smallest);

    input {
      flex: 1;
    }
  }

  &__visibility-toggle {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition);

    color: var(--gray-500);

    &:hover,
    &:active {
      color: var(--gray-950);
    }
  }

  &__error {
    color: var(--accent-error);
  }

  &__success {
    color: var(--accent-valid);
  }

  &__messages {
    position: absolute;
    top: calc(100% + var(--tiny));
    left: 0;
    width: 100%;
  }
}
</style>
