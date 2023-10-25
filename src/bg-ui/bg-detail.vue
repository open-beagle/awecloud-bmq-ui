<template>
  <div class="bg-detail bg-form">
    <!-- 固定导航 -->
    <div class="bg-tabs-nav--fixed" v-show="showFixedBars">
      <ul v-if="calcTabs().length">
        <li
          v-for="(item, index) in calcTabs()"
          :key="'tab_' + index"
          :class="{
            current: activeName === item.name,
          }"
          @click="changeActiveName(item, index)"
        >
          {{ item.label }}
        </li>
        <li>
          <!-- empty -->
        </li>
      </ul>
    </div>

    <!-- 面包屑 -->
    <div class="bg-breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <!-- 基本信息 -->
    <div class="bg-detail-info" v-if="$slots.info">
      <slot name="info" />
    </div>

    <!-- 兼容意外模块 -->
    <div v-if="$slots.other">
      <slot name="other" />
    </div>

    <!-- 详情 -->
    <div class="bg-tabs bg-detail-tabs">
      <div class="bg-tabs-nav" v-if="calcTabs().length">
        <ul>
          <li
            v-for="(item, index) in calcTabs()"
            :key="'tab_' + index"
            :class="{
              current: activeName === item.name,
            }"
            @click="changeActiveName(item, index)"
          >
            {{ item.label }}
          </li>
          <li>
            <!-- empty -->
          </li>
        </ul>
      </div>
      <div class="bg-tabs-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BgDetail",
  provide() {
    return {
      getActiveName: () => {
        return this.activeName;
      },
      getIsTabs: () => {
        return false;
      },
    };
  },
  data() {
    return {
      activeName: "",
      showFixedBars: false,
      scrollCallback: null,
    };
  },
  methods: {
    calcTabs() {
      let tabSlots = [];

      if (this.$slots.default) {
        tabSlots = this.$slots.default
          .filter(
            (vnode) =>
              vnode.tag &&
              vnode.componentOptions &&
              vnode.componentOptions.Ctor.options.name === "BgTab"
          )
          .map((vnode) => vnode.componentOptions.propsData);
      }

      return tabSlots;
    },
    changeActiveName({ name }, index) {
      let targetEl = this.$el.querySelectorAll(`.bg-tab`)[index];
      let targetCtx = document.querySelector(`.bg-main`);

      targetCtx.scrollTop = targetEl && targetEl.offsetTop - 165;

      this.activeName = name;
      this.scrollCallback = () => {
        this.activeName = name;
      };
    },
    scrollAction() {
      let targetCtx = document.querySelector(`.bg-main`);
      let ctxScrollTop = targetCtx.scrollTop || 0;
      let targetEls = this.$el.querySelectorAll(`.bg-tab`);
      let tabs = this.calcTabs();

      for (let i = 0; i < targetEls.length; i++) {
        let targetEl = targetEls[i];

        if (ctxScrollTop >= targetEl.offsetTop) {
          this.activeName = tabs[i].name;
        }
      }

      this.showFixedBars = ctxScrollTop > 222;
      this.scrollCallback && this.scrollCallback();
      this.scrollCallback = null;
    },
  },
  mounted() {
    this.$nextTick(() => {
      let tabs = this.calcTabs();
      this.activeName = tabs[0] && tabs[0].name;

      this.scrollAction();
      window.addEventListener("scroll", this.scrollAction, true);
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollAction, true);
  },
};
</script>
