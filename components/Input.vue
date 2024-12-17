<template>
  <Text
    size="caption-1"
    class="input"
    :class="{ 'input--invalid': props.invalid, 'input--valid': props.valid }"
  >
    <input class="input__field" v-bind="$attrs" @input="updateValue" />
    <div class="input__icon" v-if="$slots.icon">
      <slot name="icon" />
    </div>
  </Text>
</template>

<script setup lang="ts">
const props = defineProps<{
  invalid?: boolean;
  valid?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  position: relative;

  &__field {
    width: 100%;
    border: 1px solid var(--gray-150);
    border-radius: var(--tiniest);
    padding: var(--tiny) var(--smallest);
    color: var(--foreground-primary);
    transition: border-color var(--transition);
    font-size: inherit;
    line-height: inherit;

    &:focus {
      outline: none;
      border-color: var(--indigo-700);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    right: var(--smallest);
    transform: translateY(-50%);

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &--invalid {
    .input__field {
      border-color: var(--accent-error);

      &:focus {
        border-color: var(--red-700);
      }
    }
  }

  &--valid {
    .input__field {
      border-color: var(--accent-valid);

      &:focus {
        border-color: var(--green-700);
      }
    }
  }
}
</style>
