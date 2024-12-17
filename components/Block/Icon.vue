<template>
  <div v-if="icon !== 'none'">
    <svg
      v-if="icon === 'clipboard'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_260_213)">
        <path
          d="M13.3333 3.33301H14.9999C15.4419 3.33301 15.8659 3.5086 16.1784 3.82116C16.491 4.13372 16.6666 4.55765 16.6666 4.99967V16.6663C16.6666 17.1084 16.491 17.5323 16.1784 17.8449C15.8659 18.1574 15.4419 18.333 14.9999 18.333H4.99992C4.55789 18.333 4.13397 18.1574 3.82141 17.8449C3.50885 17.5323 3.33325 17.1084 3.33325 16.6663V4.99967C3.33325 4.55765 3.50885 4.13372 3.82141 3.82116C4.13397 3.5086 4.55789 3.33301 4.99992 3.33301H6.66659"
          stroke="#0F0E0E"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.5001 1.66699H7.50008C7.03984 1.66699 6.66675 2.04009 6.66675 2.50033V4.16699C6.66675 4.62723 7.03984 5.00033 7.50008 5.00033H12.5001C12.9603 5.00033 13.3334 4.62723 13.3334 4.16699V2.50033C13.3334 2.04009 12.9603 1.66699 12.5001 1.66699Z"
          stroke="#0F0E0E"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_260_213">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <svg
      v-else-if="icon === 'plus'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_260_217)">
        <path
          d="M10 4.16699V15.8337"
          stroke="#0F0E0E"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.1665 10H15.8332"
          stroke="#0F0E0E"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_260_217">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <svg
      v-else-if="icon === 'error'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.57465 3.21635L1.51632 14.9997C1.37079 15.2517 1.29379 15.5374 1.29298 15.8284C1.29216 16.1195 1.36756 16.4056 1.51167 16.6585C1.65579 16.9113 1.86359 17.122 2.11441 17.2696C2.36523 17.4171 2.65032 17.4965 2.94132 17.4997H17.058C17.349 17.4965 17.6341 17.4171 17.8849 17.2696C18.1357 17.122 18.3435 16.9113 18.4876 16.6585C18.6317 16.4056 18.7071 16.1195 18.7063 15.8284C18.7055 15.5374 18.6285 15.2517 18.483 14.9997L11.4247 3.21635C11.2761 2.97144 11.0669 2.76895 10.8173 2.62842C10.5677 2.48789 10.2861 2.41406 9.99965 2.41406C9.71321 2.41406 9.43159 2.48789 9.18199 2.62842C8.93238 2.76895 8.72321 2.97144 8.57465 3.21635Z"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 7.5V10.8333"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 14.167H10.0083"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-else-if="icon === 'check'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M18.3334 9.23355V10.0002C18.3324 11.7972 17.7505 13.5458 16.6745 14.9851C15.5986 16.4244 14.0862 17.4773 12.3629 17.9868C10.6396 18.4963 8.7978 18.4351 7.11214 17.8124C5.42648 17.1896 3.98729 16.0386 3.00922 14.5311C2.03114 13.0236 1.56657 11.2403 1.68481 9.44714C1.80305 7.65402 2.49775 5.94715 3.66531 4.58111C4.83288 3.21506 6.41074 2.26303 8.16357 1.867C9.91641 1.47097 11.7503 1.65216 13.3918 2.38355"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18.3333 3.33301L10 11.6747L7.5 9.17467"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-else-if="icon === 'arrowRight'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4.1665 10H15.8332"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 4.16699L15.8333 10.0003L10 15.8337"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Default SVG if no matching prop is provided -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.57465 3.21635L1.51632 14.9997C1.37079 15.2517 1.29379 15.5374 1.29298 15.8284C1.29216 16.1195 1.36756 16.4056 1.51167 16.6585C1.65579 16.9113 1.86359 17.122 2.11441 17.2696C2.36523 17.4171 2.65032 17.4965 2.94132 17.4997H17.058C17.349 17.4965 17.6341 17.4171 17.8849 17.2696C18.1357 17.122 18.3435 16.9113 18.4876 16.6585C18.6317 16.4056 18.7071 16.1195 18.7063 15.8284C18.7055 15.5374 18.6285 15.2517 18.483 14.9997L11.4247 3.21635C11.2761 2.97144 11.0669 2.76895 10.8173 2.62842C10.5677 2.48789 10.2861 2.41406 9.99965 2.41406C9.71321 2.41406 9.43159 2.48789 9.18199 2.62842C8.93238 2.76895 8.72321 2.97144 8.57465 3.21635Z"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 7.5V10.8333"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 14.167H10.0083"
        stroke="#0F0E0E"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>
