<template>
  <div ref="container" class="show_more_filter" :style="showMore?{height:'auto'}:{}">
    <slot></slot>

    <a
      v-if="showBtn"
      class="show_more_btn"
      :style="{
        left: btnLeft,
      }"
      @click="toggle"
    >
      更多检索
      <el-icon class="e-icon" v-if="showMore"><CaretTop /></el-icon>
      <el-icon class="e-icon" v-else><CaretBottom /></el-icon>
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBtn: false,
      showMore: false,
      btnLeft: 0,
    };
  },
  mounted() {
    setTimeout(() => {
      this.resize();
    }, 500);
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        let container = this.$refs.container;

        if (!container) return;

        let containerWidth = container.getBoundingClientRect().width - 80;
        let filters = container.querySelectorAll(".filter_item");
        let totalWidth = 0;
        let wrapFlag = false;

        this.showBtn = false;

        filters.forEach((filter, index) => {
          filter.style.display = "inline-block";

          let filterWidth =
            Math.ceil(filter.getBoundingClientRect().width) + 15;

          totalWidth += filterWidth;

          if (totalWidth > containerWidth) {
            this.showBtn = true;

            if (!wrapFlag) {
              this.btnLeft = totalWidth - filterWidth + 5 + "px";
              wrapFlag = true;
            }

            // filter.style.display = this.showMore ? "inline-block" : "none";
          } else {
            // filter.style.display = "inline-block";
          }
        });
      });
    },
    toggle() {
      this.showMore = !this.showMore;
      this.resize();
    },
  },
};
</script>

<style scoped>
.show_more_filter {
  position: relative;
  padding-right: 80px;
  overflow: hidden;
  height: 55px;
}
.show_more_btn {
  position: absolute;
  top: 25px;
  font-size: 14px;
  line-height: 20px;
  color: #8890a7;
  cursor: pointer;
  user-select: none;
}
.e-icon{
  vertical-align: -1px;
}
</style>
