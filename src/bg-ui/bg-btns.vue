<template>
  <div class="bg-btns">
    <ul>
      <li
        v-for="btn in fullOptions"
        :class="{
          current: value === btn.value,
        }"
        :key="btn.value"
        @click="selectBtn(btn)"
      >
        {{ btn.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BgBtns",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    fullOptions() {
      return [
        ...this.options,
        {
          name: "全部",
          value: "",
        },
      ];
    },
  },
  methods: {
    selectBtn({ value }) {
      this.$emit("change", value);
    },
  },
};
</script>
