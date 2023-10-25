<template>
  <div class="bg-list bg-form">
    <!-- 面包屑 -->
    <div class="bg-breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <!-- 头部 -->
    <div class="bg-list-header" v-if="$slots.header">
      <slot name="header" />
    </div>

    <!-- 筛选条件 -->
    <div class="bg-list-filter" v-if="$slots.filters">
      <div class="fiter-header" v-if="!inlineFilters">
        <span v-if="noMoreFilters">
          <!--  -->
        </span>
        <template v-else>
          <el-button @click="$emit('update:visible', !visible)" v-if="visible">
            <span>收起</span>
            <i class="el-icon-caret-top el-icon--right"></i>
          </el-button>
          <el-button @click="$emit('update:visible', !visible)" v-else>
            <span>更多选项</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
        </template>
        <div class="filter-header-right">
          <slot name="filter" />
        </div>
      </div>
      <div
        class="filter-content"
        :class="{ 'inline-filters': inlineFilters, 'show-more': visible }"
      >
        <div class="filter-list">
          <slot name="filters" />
        </div>
        <div class="filter-action" v-if="inlineFilters">
          <div class="filters-right" v-if="$slots['filters-right']">
            <slot name="filters-right" />
          </div>
          <el-button type="primary2" @click="$emit('search-action')">
            查询
          </el-button>
          <el-button type="default2" @click="$emit('search-reset')">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 其他信息 -->
    <div class="bg-list-top" v-if="$slots.top">
      <slot name="top" />
    </div>

    <!-- 列表 -->
    <div class="bg-list-main" :class="{ 'has-action': !!$slots.action }">
      <div class="main-action" v-if="$slots.action">
        <slot name="action" />
      </div>
      <div class="main-table">
        <slot name="table" />
      </div>
      <div class="main-pagination">
        <slot name="pagination" />
      </div>
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  name: "BgList",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    noMoreFilters: {
      type: Boolean,
      default: false,
    },
    inlineFilters: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
