<template>
  <div class="bg-tab" v-show="showTab">
    <div class="tab-title" v-if="!isTabs">
      <h3>{{ label }}</h3>
    </div>
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "BgTab",
  inject: {
    getActiveName: {
      type: Function,
      default: () => {
        return this.$parent.activeName;
      },
    },
    getIsTabs: {
      type: Function,
      default: () => {
        return false;
      },
    },
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    activeName() {
      return this.getActiveName();
    },
    isTabs() {
      return this.getIsTabs();
    },
    showTab() {
      if (this.isTabs) {
        if (this.activeName === this.name) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
};
</script>
