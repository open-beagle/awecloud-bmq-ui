<template>
  <div class="bg-sort">
    <a
      v-for="(item, index) in types"
      :key="'name_' + index"
      :class="{ current: item.value === value }"
      @click="selectAction(item)"
    >
      {{ item.name }}
    </a>
  </div>
</template>

<script>
export default {
  name: "BgSort",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    types: {
      type: Array,
      default: () => [
        {
          name: "综合排序",
          value: 0,
        },
        {
          name: "最近更新",
          value: 1,
        },
        {
          name: "最高人气",
          value: 2,
        },
        {
          name: "最好评价",
          value: 3,
        },
      ],
    },
  },
  methods: {
    selectAction({ value }) {
      this.$emit("change", value);
    },
  },
};
</script>