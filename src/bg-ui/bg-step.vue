<template>
  <div class="bg-step" v-show="active === step">
    <div class="step-content">
      <slot />
    </div>
    <div class="step-action bg-form">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: "BgStep",
  inject: {
    getActive: {
      type: Function,
      default: () => {
        return this.$parent.getActive;
      },
    },
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    step: {
      type: Number,
      required: true,
    },
    icon: {
      required: true,
    },
  },
  computed: {
    active() {
      return this.getActive();
    },
  },
};
</script>
