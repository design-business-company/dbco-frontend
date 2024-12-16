<template>
  <component
    v-bind="$attrs"
    class="button"
    :class="[
      `button--${size}`,
      {
        'button--icon-only': iconOnly
      }
    ]"
    :is="tag"
  >
    <Icon class="button__icon" v-if="icon && iconPosition === 'start'" :name="icon" />
    <span
      v-if="$slots.default"
      :class="{
        'text-caption-1': size === 'large',
        'text-micro': size === 'small',
        'sr-only': iconOnly
      }"
    >
      <slot></slot>
    </span>
    <Icon class="button__icon" v-if="icon && iconPosition === 'end'" :name="icon" />
  </component>
</template>

<script setup lang="ts">
import { type NuxtLinkProps } from '#app'

import Icon from './Icon.vue'
import { NuxtLink } from '#components'

const tag = computed(() => {
  if (props.as === 'link') {
    return NuxtLink
  }
  return 'button'
})

interface ButtonBaseProps {
  size?: 'small' | 'large'
  iconPosition?: 'start' | 'end'
  icon?: InstanceType<typeof Icon>['name']
  iconOnly?: boolean
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as: 'button'
}

interface ButtonAsLinkProps extends ButtonBaseProps, NuxtLinkProps {
  as: 'link'
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'large',
  iconPosition: 'end',
  as: 'button',
})

const { size, iconPosition, icon, iconOnly } = toRefs(props)
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--gray-950);
  color: var(--indigo-50);
  cursor: pointer;

  &__icon {
    width: var(--icon-size);
    height: var(--icon-size);
  }

  &--small {
    gap: var(--tiniest);
    height: 24px;
    padding-inline: var(--tinier);
    border-radius: var(--tiniest);

    .button__icon {
      --icon-size: var(--tiny);
    }
  }

  &--large {
    height: 44px;
    gap: var(--tinier);
    padding-inline: var(--smallest);
    border-radius: var(--tinier);

    .button__icon {
      --icon-size: var(--smallest);
    }
  }

  .sr-only {
    @include sr-only;
  }

  &--icon-only {
    padding-inline: 0;
    
    &.button--small {
      width: 24px;
      .button__icon {
        --icon-size: var(--smallest);
      }
    }

    &.button--large {
      width: 44px;
      .button__icon {
        --icon-size: 20px;
      }
    }
  }
}
</style>
