<template>
  <component
    v-bind="$attrs"
    class="button"
    :class="[
      `button--${size}`,
      `button--${style}`,
      { 'button--icon': icon !== 'none' },
      {
        'button--icon-only': iconOnly,
      },
    ]"
    :is="tag"
    :to="to"
  >
    <Text
      class="button__wrap"
      :size="size === 'small' ? 'caption-2' : 'caption-1'"
    >
      <span
        v-if="$slots.default"
        :class="{
          'sr-only': iconOnly,
        }"
      >
        <slot></slot>
      </span>
      <Icon class="button__icon" v-if="icon !== 'none'" :name="icon" />
    </Text>
  </component>
</template>

<script setup lang="ts">
import { type NuxtLinkProps } from "#app";

import Icon from "./Icon.vue";
import { NuxtLink } from "#components";

const tag = computed(() => {
  if (props.as === "link") {
    return NuxtLink;
  }
  return "button";
});

interface ButtonBaseProps {
  size?: "small" | "default";
  icon?: InstanceType<typeof Icon>["name"];
  iconOnly?: boolean;
  style?: string;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as: "button";
}

interface ButtonAsLinkProps extends ButtonBaseProps, NuxtLinkProps {
  as: "link";
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const props = withDefaults(defineProps<ButtonProps>(), {
  size: "default",
  as: "button",
  style: "primary",
});

const { size, icon, iconOnly } = toRefs(props);
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--tiniest);
  cursor: pointer;
  text-decoration: none;
  transition: background-color var(--transition), color var(--transition);

  &:hover {
    transition-duration: 200ms;
  }

  &--primary {
    background: var(--foreground-primary);
    background: var(--foreground-primary);
    color: var(--background-primary);

    &:hover {
      background: var(--foreground-secondary);
    }
  }

  &--secondary {
    background: var(--background-tertiary);
    color: var(--foreground-primary);

    &:hover {
      background: var(--background-secondary);
    }
  }

  &--icon {
    &:hover {
      .button__icon {
        translate: 0.2em 0 0;
      }
    }
  }

  &__wrap {
    display: flex;
    gap: var(--tiniest);
    align-items: center;
    margin-top: 0 !important;
    text-indent: 0;
  }

  &__icon {
    transition: translate var(--transition);
    transition-duration: 200ms;
    width: 1em;
    height: 1em;
  }

  &--small {
    padding: var(--tinier) var(--tiny);
  }

  &--default {
    border-radius: var(--tiniest);
    padding: var(--tiny) var(--smallest);
  }

  .sr-only {
    @include sr-only;
  }

  &--icon-only {
    padding-inline: 0;

    &.button--small {
      .button__icon {
        --icon-size: var(--smallest);
      }
    }

    &.button--default {
      .button__icon {
        --icon-size: 20px;
      }
    }
  }
}
</style>
