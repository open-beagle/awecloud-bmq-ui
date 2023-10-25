/**
 * 全局组件
 */
 import BgNav from './bg-nav.vue'
 import BgList from './bg-list.vue'
 import BgDetail from './bg-detail.vue'
 import BgFiltrate from './bg-filtrate.vue'
 import BgTable from './bg-table.vue'
 import BgTableBtn from './bg-table-btn.vue'
 import BgTabs from './bg-tabs.vue'
 import BgTab from './bg-tab.vue'
 import BgLayoutCard from './bg-layout-card.vue'
 import BgInfo from './bg-info.vue'
 import BgSteps from './bg-steps.vue'
 import BgStep from './bg-step.vue'
 import BgBtns from './bg-btns.vue'
 import BgUpload from './bg-upload.vue'
 import BgUploadImage from './bg-upload-image.vue'
 import BgTags from './bg-tags.vue'
 import BgSwitch from './bg-switch.vue'
 import BgRichText from './bg-rich-text.vue'
 import BgFilter from './bg-filter.vue'
 import BgSort from './bg-sort.vue'
 import BgFilterDate from './bg-filter-date.vue'
 import bgUserUploadImage from './bg-user-upload-image.vue'
 import bgDetailTable from './bg-detail-table.vue'
 import bgDetailTable2 from './bg-detail-table2.vue'
 import debounce from './debounce'
 
const components = {
  BgNav, // 左侧导航
  BgList, // 列表页布局
  BgDetail, // 详情页布局
  BgFiltrate, // 筛选条件
  BgTable, // 表格
  BgTableBtn, // 表格按钮
  BgTabs, // 信息块
  BgTab, // 信息块（子）
  BgLayoutCard, // 带标题的卡片
  BgInfo, // 表格信息
  BgSteps, // 步骤条
  BgStep, // 步骤条
  BgBtns, // 按钮组
  BgUpload, // 上传附件
  BgUploadImage, // 上传单张图片
  BgTags, // 标签
  BgSwitch, // 开关
  BgRichText, // 富文本
  BgFilter, // 首页筛选
  BgSort, // 首页排序
  BgFilterDate,
  bgUserUploadImage,
  bgDetailTable,//详情展示组件1
  bgDetailTable2,//详情展示组件2
  debounce,//防抖组件
};

const install = (Vue) => {
  for (let name in components) {
    Vue.component(name, components[name]);
  }
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components,
};
