<template>
  <a class="bg-table-btn" :class="{ disabled: disabled }" @click="clickAction">
    <slot />
  </a>
</template>

<script>
export default {
  name: "BgTableBtn",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    click:{
      type:Function,
      default:()=>{}
    }
  },
  methods: {
    clickAction() {
      if (this.disabled) {
        return;
      }

      this.click()
    },
  },
};
</script>
