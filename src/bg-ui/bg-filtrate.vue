<template>
  <div class="bg-filtrate">
    <span class="bg-filtrate-text">{{ name }}：</span>
    <ul class="bg-filtrate-list">
      <li
        v-for="(item, index) in fullOptions"
        :class="{ current: selection.indexOf(item.value) > -1 }"
        :key="'li_' + index"
        @click="selectAction(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BgFiltrate",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    optionName: {
      type: String,
      default: "name",
    },
    optionValue: {
      type: String,
      default: "value",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fullOptions() {
      return [
        {
          name: "全部",
          value: "",
        },
        ...this.options.map((item) => {
          return {
            name: item[this.optionName],
            value: item[this.optionValue] + "",
          };
        }),
      ];
    },
    selection() {
      let value = this.value + "";

      return value.split(",");
    },
  },
  methods: {
    selectAction({ value, name }) {
      if (value && this.multiple) {
        let selection = [...this.selection].filter((v) => v !== "");
        let index = selection.findIndex((v) => v === value);

        if (index > -1) {
          selection.splice(index, 1);
        } else {
          selection.push(value);
        }

        this.$emit("change", selection.join(","));
      } else {
        this.$emit("change", value, name);
      }
    },
  },
};
</script>