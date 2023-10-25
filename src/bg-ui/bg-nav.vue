<template>
  <div class="bg-nav" :style="{ width: width }">
    <!-- <div class="bg-nav-title">
      <h3 class="text-clip">{{ title }}</h3>
    </div> -->
    <div class="bg-nav-list bg-scroll">
      <NavList :list="list" :highlight-parent-rule="highlightParentRule" />
    </div>
  </div>
</template>

<script>
import NavList from "./bg-nav-list.vue";

export default {
  name: "BgNav",
  components: {
    NavList,
  },
  props: {
    title: {
      type: String,
      default: "功能列表",
    },
    width: {
      type: String,
      default: "184px",
    }, // 宽度
    list: {
      type: Array,
      required: true,
    }, // 导航列表 [ { name: "xxx", path: "xxx" } ]
    highlightParentRule: {
      type: Function,
    },
  },
};
</script>
