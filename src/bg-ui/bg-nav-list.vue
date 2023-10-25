<template>
  <ul class="nav-list">
    <li v-for="(item, index) in list" :key="'nav_' + index">
      <template v-if="item.children && item.children.length">
        <div
          class="nav-item nav-more text-clip"
          :class="{ current: isCurrent(item.path) }"
          @click="showMoreAction(index)"
        >
          <span :style="{ paddingLeft: `${deep}em` }">{{ item.name }}</span>
          &ensp;
          <i class="el-icon-arrow-up" v-if="showMore[index] !== false"></i>
          <i class="el-icon-arrow-down" v-else></i>
        </div>
        <transition name="slideOutUp">
          <NavList
            :list="item.children"
            :deep="deep + 1"
            :highlight-parent-rule="highlightParentRule"
            v-if="showMore[index] !== false"
          />
        </transition>
      </template>
      <template v-else>
        <router-link
          class="nav-item text-clip"
          :to="item.path"
          active-class="current"
          tag="div"
        >
          <span :style="{ paddingLeft: `${deep}em` }">{{ item.name }}</span>
        </router-link>
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  name: "NavList",
  props: {
    list: {
      type: Array,
      required: true,
    }, // 导航列表 [ { name: "xxx", path: "xxx" } ]
    deep: {
      type: Number,
      default: 0,
    },
    highlightParentRule: {
      type: Function,
    },
  },
  data() {
    return {
      showMore: {},
    };
  },
  methods: {
    showMoreAction(index) {
      let flag = this.showMore[index];

      if (flag === undefined) {
        flag = true;
      }

      this.showMore[index] = !flag
    },
    isCurrent(path) {
      return (
        (this.highlightParentRule && this.highlightParentRule(path)) || false
      );
    },
  },
};
</script>
