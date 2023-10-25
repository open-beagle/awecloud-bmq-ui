<template>
  <div class="bg-filter" v-if="options.length > 0">
    <span>{{ name }}：</span>

    <ul>
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
  name: "BgFilter",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    isCalc:{
      type:Boolean,
      default:false,
    },
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
            sub_cate: item.sub_cate ? item.sub_cate : "",
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
    selectAction({ value, name, sub_cate }) {
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
        this.$emit("change", value, name, sub_cate ? sub_cate : "");
      }
    },
  },
};
</script>
