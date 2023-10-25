<template>
  <div class="bg-layout-card" :style="style">
    <div class="card-title">
      <h3 class="title-text text-clip">{{ title }}</h3>
      <ul class="filter-list" v-if="btns.length > 0">
        <li
          v-for="(item, index) in btns"
          :key="item"
          :class="{ current: index === btn }"
          @click="$emit('update:btn', index)"
        >
          {{ item }}
        </li>
      </ul>
      <div
        class="download-btn"
        @click="downloadAction"
        v-loading="downloading"
        element-loading-spinner="el-icon-loading"
        v-if="download"
      >
        <img src="@/assets/imgs/btn_daochu.png" />
      </div>
    </div>
    <div class="card-content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "BgLayoutCard",
  props: {
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "25%",
    },
    height: {
      type: String,
      default: "278px",
    },
    btn: {
      type: Number,
      default: 0,
    },
    btns: {
      type: Array,
      default: () => [],
    },
    download: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      return {
        width: `calc(${this.width} - 20px)`,
        height: this.height,
      };
    },
  },
  data() {
    return {
      downloading: false,
    };
  },
  methods: {
    getScrollTop() {
      let scrollTop = 0;

      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }

      return scrollTop;
    },
    downloadAction() {
      if (this.downloading) {
        return;
      }

      let content = this.$refs.content;
      let { top, left } = content.getBoundingClientRect();
      let scrollTop = this.getScrollTop();

      this.downloading = true;

      html2canvas(content, { x: left, y: top + scrollTop }).then((canvas) => {
        let imgUrl = canvas.toDataURL("image/png");
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件

        this.$nextTick(() => {
          a.download = this.title; // 设置图片名称
          a.href = imgUrl; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件

          this.downloading = false;
        });
      });
    },
  },
};
</script>
