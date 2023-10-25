<template>
  <div class="comments_pagination">
    <div class="total_info">
      <span>{{ `共${total}个条目` }}</span>
    </div>
    <div class="page_size_action" v-if="pageSizes.length">
      <span>每页行数：</span>
      <el-select v-model="pageSize" @change="sizeChange">
        <el-option
          v-for="item in pageSizes"
          :label="item"
          :value="item"
          :key="item"
        ></el-option>
      </el-select>
    </div>
    <div class="page_action">
      <a :class="{ disabled: preDisabled }" @click.prevent="prePage">
        <el-icon><ArrowLeft /></el-icon>
      </a>
      <span>{{ `第${currentPage}页 / 共${totalPages}页` }}</span>
      <a :class="{ disabled: nextDisabled }" @click.prevent="nextPage">
        <el-icon><ArrowRight /></el-icon>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true,
    },
    pageSizes: {
      type: Array,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize) || 1;
    },
    preDisabled() {
      return this.currentPage === 1;
    },
    nextDisabled() {
      return this.currentPage === this.totalPages;
    },
  },
  methods: {
    sizeChange(value) {
      this.$emit("size-change", value);
    },
    prePage() {
      if (this.preDisabled) {
        return;
      }
      this.$emit("current-change", this.currentPage - 1);
    },
    nextPage() {
      if (this.nextDisabled) {
        return;
      }
      this.$emit("current-change", this.currentPage + 1);
    },
  },
};
</script>

<style scoped>
.comments_pagination {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  line-height: 25px;
  color: #333;
}
.total_info {
  flex-grow: 1;
}
.page_size_action {
  margin-left: 50px;
}
.page_size_action > .el-select {
  width: 70px;
}
.page_action {
  user-select: none;
  margin-left: 50px;
}
.page_action > a {
  cursor: pointer;
}
.page_action > a > i {
  font-weight: bold;
  color: #5588ff;
  vertical-align: -2px;
}
.page_action > a.disabled {
  cursor: not-allowed;
}
.page_action > a.disabled > i {
  color: #d6d8dc;
}
</style>

<style>
.page_size_action > .el-select .el-input__inner,
.page_size_action > .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #fff;
}
</style>
