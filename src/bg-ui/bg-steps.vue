<template>
  <div class="bg-steps">
    <div class="bg-steps-container">
      <div class="steps-nav">
        <ul>
          <template v-for="(item, index) in calcSteps()" :key="'tab_' + index">
            <li
              class="step-line"
              :class="{
                done: active > index,
                current: active === index,
              }"
              v-if="index > 0"
            ></li>
            <li
              class="step-item"
              :class="{
                done: active > index,
                current: active === index,
              }"
            >
              <div class="step-icon">
                <!--  -->
              </div>
              <div class="step-hightlight-icon">
                <img :src="item.icon" />
              </div>
              <div class="step-title">
                <p>
                  {{ item.title || "完成" }}
                </p>
                <p v-if="item.title">
                  <template v-if="active > index">
                    已完成
                  </template>
                  <template v-else-if="active === index">
                    进行中
                  </template>
                  <template v-else>
                    未进行
                  </template>
                </p>
              </div>
            </li>
            <li
              class="step-line"
              :class="{
                done: active > index,
                current: active === index,
              }"
              v-if="index < calcSteps().length - 1"
            ></li>
          </template>
        </ul>
      </div>
      <div class="steps-content">
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
      getActive: () => {
        return this.active;
      },
    };
  },
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showFixedBars: false,
      scrollCallback: null,
    };
  },
  methods: {
    calcSteps() {
      let stepSlots = [];

      if (this.$slots.default) {
        stepSlots = this.$slots.default
          .filter(
            (vnode) =>
              vnode.tag &&
              vnode.componentOptions &&
              vnode.componentOptions.Ctor.options.name === "BgStep"
          )
          .map((vnode) => {
            return vnode.componentOptions.propsData;
          });
      }

      return stepSlots;
    },
  },
};
</script>
