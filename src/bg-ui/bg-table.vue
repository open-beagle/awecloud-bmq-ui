<template>
  <el-table
    ref="table"
    class="bg-table"
    :data="rows"
    @selection-change="selectAction"
    @select="selectActionRow"
    @select-all="selectActionAll"
  >
    <el-table-column
      type="selection"
      :selectable="selectable"
      width="80"
      align="center"
      v-if="select"
    >
      <!-- checkbox -->
    </el-table-column>
    <el-table-column
      v-for="(header, index) in headers"
      :width="header.width"
      :align="header.align"
      :key="'col_' + index"
      show-overflow-tooltip
    >
      <template v-slot:header>
        <template v-if="$slots[`header-${header.prop}`]">
          <slot :name="`header-${header.prop}`" />
        </template>
        <p class="text-clip" v-else>{{ header.label }}</p>
      </template>
      <template v-slot:default="{ row }">
        <slot v-if="$slots[header.prop]" :name="header.prop" :row="row" />

        <template v-else>
          <!-- {{ row[header.prop] | ellipsis(header.max) }} -->
          {{ row[header.prop] }}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { selectTableMixin } from './hook/mixin-select-table'
export default {
  name: "BgTable",
  setup() {
    const { 
      nowSelectData,
      allSelectData,
      selectData,
      initSelectTableData,
      runPage,
      dealSelectData 
    } = selectTableMixin()

    return { 
      nowSelectData,
      allSelectData,
      selectData,
      initSelectTableData,
      runPage,
      dealSelectData 
    }
  },
  props: {
    headers: {
      type: Array,
      require: true,
    },
    rows: {
      type: Array,
      default: () => [],
    },
    select: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Function,
    },
  },
  /* filters: {
    ellipsis(value, max) {
      if (!value) {
        return "";
      } else if (max && value.length > max) {
        return value.slice(0, max - 1) + "...";
      } else {
        return value;
      }
    },
  }, */
  watch:{
    rows(n,o){
      if(n.length&&this.select){
        this.runPage()
        this.initSelectTableData(n).then((selectData)=>{
          if(selectData.length){
            setTimeout(()=>{
              this.toggleRowArrSelection(selectData)
            })
          }
        })
      }
    }
  },
  created(){
    console.log(this.$attrs)
  },
  methods: {
    toggleRowSelection(row, flag = true) {
      this.$refs.table.toggleRowSelection(row, flag);
    },
    selectAction(selection) {
      this.$emit("selectAc", {allLength:Object.keys(this.allSelectData).length+this.nowSelectData.length,selection});
    },
    clearSelection() {
      this.$refs.table.clearSelection();
       this.$emit("select", {allLength:Object.keys(this.allSelectData).length+this.nowSelectData.length,selection:[]});
    },
    setSelectedRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    toggleRowArrSelection(arr, flag = true){
      arr.forEach(e => {
        this.$refs.table.toggleRowSelection(e, flag);
      });
    },
    selectActionRow(selection,row){
      this.selectData(selection)
      this.$emit("select", {allLength:Object.keys(this.allSelectData).length+this.nowSelectData.length,selection});
    },
    selectActionAll(selection){
      this.selectData(selection)
      this.$emit("select", {allLength:Object.keys(this.allSelectData).length+this.nowSelectData.length,selection});
    },
    clearTable(){//清除选中数据,在页面状态更新时使用
      this.allSelectData={}
      this.nowSelectData=[]
      this.clearSelection();
    }
  },
};
</script>
