<template>
  <div class="bg-tabs nice-tabs">
    <div class="bg-tabs-nav">
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
    <div class="bg-tabs-action" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: "BgTabs",
  model: {
    prop: "activeName",
    event: "change",
  },
  provide() {
    return {
      getActiveName: () => {
        return this.activeName;
      },
      getIsTabs: () => {
        return true;
      },
    };
  },
  props: {
    activeName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isTabs: true,
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
    changeActiveName({ name }) {
      this.$emit("change", name);
    },
  },
};
</script>
