<template>
  <div class="bg-info">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="'li_' + index"
        :style="{
          width: item.full ? `100%` : `calc(100% / ${col})`,
        }"
      >
        <span>
          {{ item.name }}
        </span>
        <span>
          <span>{{ item.value }}</span>
          <a
            class="copy-btn"
            @click="copyText(item.value, $event)"
            v-if="item.copy"
          >
            复制
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import Clipboard from "clipboard";

export default {
  name: "BgInfo",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    col: {
      type: Number,
      default: 2,
    },
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: "复制成功",
        duration: 1500,
      });
    },
    clipboardError() {
      this.$message({
        message: "浏览器不支持自动复制",
        type: "warning",
      });
    },
    copyText(text, e) {
      const clipboard = new Clipboard(e.target, {
        text: () => text,
      });

      clipboard.on("success", () => {
        this.clipboardSuccess();
        // 释放内存
        clipboard.destroy();
      });

      clipboard.on("error", () => {
        // 不支持复制
        this.clipboardError();
        // 释放内存
        clipboard.destroy();
      });
      
      // 解决第一次点击不生效的问题，如果没有，第一次点击会不生效
      clipboard.onClick(e);
    },
  },
};
</script>
