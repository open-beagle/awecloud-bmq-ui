<template>
  <div class="bg-filtrate">
    <span class="bg-filtrate-text">{{ name }}：</span>
    <div class="bg-filtrate-list">
      <el-date-picker
        v-model="value"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="change">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "BgFilterDate",
  model: {
    prop: "time",
    event: "change",
  },
  props: {
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      value: ""
    }
  },
  computed: {
  
  },
  methods: {
    change(event) {
       this.$emit("change", event);
    },
  },
};
</script>