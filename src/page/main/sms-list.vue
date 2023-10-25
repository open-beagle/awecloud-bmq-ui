<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 短信清单 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="top_fliter">
      <show-more-filter class="filter_list">
        <div class="filter_item">
          <span class="filter_title">手机号</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.phoneNumber"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">状态</span>
          <el-select
            v-model="topFilter.sendStatus"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="'status' + index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="filter_item">
          <span class="filter_title">消息ID</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.msgId"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item" v-if="userInfo.userType == 1">
          <span class="filter_title">appID</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.appId"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">系统名称</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.systemName"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">短信网关</span>
          <el-select
            v-model="topFilter.smsGateway"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, index) in pushOptions"
              :key="'pushOptions' + index"
              :label="item.dictName"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </div>

        <div class="filter_item">
          <span class="filter_title">推送时间</span>
          <el-date-picker
            v-model="topFilter.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </div>
      </show-more-filter>
      <div class="filter_action apaas_button">
        <el-button type="primary" @click="topFilterAction"> 查询 </el-button>
        <el-button type="default" @click="topFilterClear"> 重置 </el-button>
      </div>
    </div>

    <div class="main_container">
      <div class="action-container apaas_button">
        <el-button type="primary" @click="exportData">导出</el-button>
      </div>
      <bg-table ref="bgTable" rowKey="msgId" :select="true" :headers="headers" :rows="tableRows">
        <template v-slot:sendStatus="{ row }">
          {{ ["失败", "成功"][row.sendStatus] }}
        </template>

        <template v-slot:action="{ row }">
          <bg-table-btn class="btn warn" @click="delete_row(row)">
            删除
          </bg-table-btn>
        </template>
      </bg-table>

      <Pagination
        class="main_pagination"
        :total="tableTotal"
        :page-sizes="[10, 50, 100]"
        :page-size="filter.size"
        :current-page="filter.page"
        @size-change="changeSize"
        @current-change="changePage"
      />
    </div>

    <el-dialog
      title="删除"
      v-model="dialogDelete"
      width="400px"
      :before-close="
        () => {
          dialogDelete = false;
        }
      "
    >
      <div>是否删除该消息</div>
      <template v-slot:footer>
        <div class="apaas_button">
          <el-button @click="dialogDelete = false">取 消</el-button>
          <el-button type="primary" @click="deleteData">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
  computed,
  getCurrentInstance
} from "vue";
import showMoreFilter from "@/components/show-more-filter.vue";
import Pagination from "@/components/comments-pagination.vue";
export default {
  components: {
    showMoreFilter,
    Pagination,
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance()
    const { $message, $axios, $store } = proxy;
    const bgTable = ref(null);
    const state = reactive({
      bgTable,
      dialogDelete: false,
      actionRow: null,
      tableTotal: 0,
      filter: {
        size: 10,
        page: 1,
      },
      topFilter: {
        phoneNumber: "",
        msgId: "",
        appId: "",
        sendStatus: "",
        systemName: "",
        smsGateway: "",
        msgTitle: "",
        time: "",
      },
      statusOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "失败",
          value: "0",
        },
        {
          label: "成功",
          value: "1",
        },
      ],
      pushOptions: [], //短信网关数组
      pushObj: {},
      headers: [
        {
          label: "手机号",
          prop: "phoneNumber",
          width: "150px",
        },
        {
          label: "状态",
          prop: "sendStatus",
          width: "100px",
        },
        {
          label: "短信网关",
          prop: "smsGateway",
          width: "150px",
        },
        {
          label: "消息ID",
          prop: "msgId",
          width: "290px",
        },
        {
          label: "appID",
          prop: "appId",
          width: "290px",
        },
        {
          label: "系统名称",
          prop: "systemName",
        },
        {
          label: "消息标题",
          prop: "msgTitle",
        },
        {
          label: "推送时间",
          prop: "pushTime",
          width: "160px",
        },
      ],
      tableRows: [],
    });

    const userInfo = computed(() => {
      return $store.state.userInfo;
    });

    const topFilterAction = () => {
      changePage(1);
    };
    const topFilterClear = () => {
      state.topFilter = {
        phoneNumber: "",
        msgId: "",
        appId: "",
        sendStatus: "",
        systemName: "",
        smsGateway: "",
        msgTitle: "",
        time: "",
      };
      changePage(1);
    };
    const delete_row = (row) => {
      state.actionRow = row;
      state.dialogDelete = true;
    };
    const changeSize = (pageSize) => {
      state.filter = {
        size: pageSize,
        page: 1,
      };
      getTableData();
    };
    const changePage = (page) => {
      state.filter.page = page;
      getTableData();
    };

    //请求table
    const getTableData = () => {
      let topFilter = { ...state.topFilter };
      let time = topFilter.time || ["", ""];

      topFilter.pushStartTime = time[0];
      topFilter.pushEndTime = time[1];
      delete topFilter.time;

      $axios
        .get(`/msg/sms/list/${state.filter.size}/${state.filter.page}`, {
          params: topFilter,
        })
        .then((res) => {
          if (res.data.code == 200) {
            state.tableRows = res.data.data || [];
            state.tableTotal = res.data.total;
          }
        });
    };

    const deleteData = () => {
      state.dialogDelete = false;
      console.log(state.actionRow);
      let url = `/msg/mgt/${state.actionRow.msgId}`;
      $axios.delete(url).then((res) => {
        if (res.data.code == 200) {
          $message.success("删除成功");
          getTableData();
        } else {
          $message.error("删除失败");
        }
      });
    };
    const exportData = () => {
      let topFilter = { ...state.topFilter };
      let time = topFilter.time || ["", ""];

      topFilter.pushStartTime = time[0];
      topFilter.pushEndTime = time[1];
      delete topFilter.time;
      var url = `/msg/sms/smsExport?phoneNumber=${state.topFilter.phoneNumber}&sendStatus=${state.topFilter.sendStatus}&msgId=${state.topFilter.msgId}&appId=${state.topFilter.appId}&systemName=${state.topFilter.systemName}&pushStartTime=${topFilter.pushStartTime}&pushEndTime=${topFilter.pushEndTime}&smsGateway=${state.topFilter.smsGateway}`;
      let a = document.createElement("a");
      a.setAttribute("download", "");
      a.setAttribute("href", url);
      a.click();
    };
    //获取短信网关

    const getPostType = () => {
      $axios.get(`/msg/dict/list/9999/1?dictContents=短信网关`).then((res) => {
        if (res.data.code == 200) {
          state.pushOptions = [
            { dictName: "全部", dictValue: "" },
            ...res.data.data,
          ];
          state.pushOptions.forEach((e) => {
            state.pushObj[e.dictValue] = e;
          });
        }
      });
    };

    onBeforeMount(() => {
      getTableData();
      getPostType();
    });

    return {
      ...toRefs(state),
      topFilterAction,
      topFilterClear,
      delete_row,
      changeSize,
      changePage,
      getTableData,
      deleteData,
      exportData,
      userInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail_container {
  width: 100%;
  padding: 0 14px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  .top_fliter {
    padding: 0 20px 15px;
    background-color: #fff;
    border-radius: 10px;
  }

  .main_container {
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: #fff;
    box-shadow: 0px 3px 6px 0px #f4f7fc;
    border-radius: 12px;
    padding: 20px;
    margin: 14px 0;
    .el-table{
      flex:1;
    }

    .readnum {
      color: #3759be;
      cursor: pointer;
    }
  }
}

.read-container {
  width: 100%;
  height: 600px;
  margin-top: -20px;
  position: relative;

  .read-tab {
    height: 100%;

    :deep() .el-tabs__content {
      height: calc(100% - 55px);
      // display: flex;
    }

    :deep() .el-tab-pane {
      height: calc(100% - 55px);
    }
  }

  .search {
    position: absolute;
    width: 240px;
    top: -3px;
    right: 0px;
  }

  .el-tabs__header .el-tabs__item {
    font-size: 16px;
  }

  :deep() .total_info {
    text-align: left;
  }
}
</style>
