<template>
  <div
    ref="bg_switch"
    class="bg-switch"
    :class="{ disabled: disabled }"
    :style="now_style"
    @click="switch_data"
  >
    <span class="label" :style="now_label_style">
      {{ labels[now_index] }}
    </span>
    <span class="circle" :style="now_circle_style" ref="circle">
      <!-- circle -->
    </span>
  </div>
</template>

<script>
export default {
  name: "BgSwitch",
  props: {
    modelValue: {
      type: [Boolean, Number, String],
      default: 0,
    },
    labels: {
      type: Array,
      default: () => ["停用", "启用"],
    },
    values: {
      type: Array,
      default: () => [0, 1],
    },
    colors: {
      type: Array,
      default: () => ["#c1c7d7", "#275a9d"],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      gap: 0,
      box_height: 0,
      circle_height: 0,
    };
  },
  computed: {
    now_index() {
      if (this.values[0] == this.modelValue) {
        return 0;
      } else {
        return 1;
      }
    },
    now_style() {
      return {
        color: this.colors[this.now_index],
        borderColor: this.colors[this.now_index],
      };
    },
    now_label_style() {
      return this.now_index == 0
        ? { left: this.circle_height + this.gap + 5 + "px" }
        : { left: "10px" };
    },
    now_circle_style() {
      return this.now_index == 0
        ? {
            left: this.gap + "px",
            backgroundColor: this.colors[this.now_index],
          }
        : {
            right: this.gap + "px",
            backgroundColor: this.colors[this.now_index],
          };
    },
  },
  methods: {
    switch_data() {
      if (this.disabled) {
        return;
      }

      if (this.values[0] == this.modelValue) {
        this.$emit("update:modelValue", this.values[1]);
      } else {
        this.$emit("update:modelValue", this.values[0]);
      }
    },
  },
  mounted() {
    this.box_height = this.$refs.bg_switch.offsetHeight;
    this.circle_height = this.$refs.circle.offsetHeight;
    this.gap = (this.box_height - this.circle_height - 4) / 2;
  },
};
</script>
