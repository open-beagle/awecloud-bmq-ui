<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 应用管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="top_fliter">
      <show-more-filter class="filter_list">
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
          <span class="filter_title">appID</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.appId"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">接收状态</span>
          <el-select
            v-model="topFilter.receiveStatus"
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
          <span class="filter_title">发送权限</span>
          <el-select
            v-model="topFilter.sendStatus"
            placeholder="请选择"
            style="width: 250px"
            multiple
          >
            <el-option
              v-for="(item, index) in sendList"
              :key="'status1' + index"
              :label="item.dictName"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </div>
      </show-more-filter>
      <div class="filter_action apaas_button">
        <el-button type="primary" @click="topFilterAction"> 查询 </el-button>
        <el-button type="default" @click="topFilterClear"> 重置 </el-button>
      </div>
    </div>

    <div class="main_container">
      <bg-table ref="bgTable" :headers="headers" :rows="tableRows">
        <template v-slot:sendStatus="{ row }">
          <div>
            <span
              v-for="(item, index) in sendList"
              :key="index"
              class="send-text"
            >
              <i
                :class="
                  row.sendStatus.split(',').includes(item.dictValue)
                    ? 'send-tip-check'
                    : 'send-tip'
                "
              ></i>
              {{ item.dictName }}</span
            >
          </div>
        </template>
        <template v-slot:receiveStatus="{ row }">
          {{ ["启用", "禁用"][row.receiveStatus] }}
        </template>
        <template v-slot:updateTime="{ row }">
          {{ row && row.updateTime ? row.updateTime.split(".")[0] : "-" }}
        </template>
        <template v-slot:action="{ row }">
          <bg-table-btn class="btn warn" :click="()=>{send_row(row, 'sendStatus')}">
            发送权限
          </bg-table-btn>
          <bg-table-btn
            class="btn warn"
            :click="()=>{delete_row(row, 'receiveStatus')}"
          >
            {{ row.receiveStatus == 0 ? "禁用接收" : "启用接收" }}
          </bg-table-btn>
          <bg-table-btn class="btn warn" :click="()=>{share_row(row)}">
            共享接收
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
      title="发送权限"
      v-model="sendFlag"
      width="640px"
      :before-close="
        () => {
          sendFlag = false;
        }
      "
    >
      <div style="overflow: hidden">
        <div class="send-out-box">发送权限</div>
        <div class="send-out-box1">
          <div class="send-container apaas_scroll_nor">
            <el-checkbox-group v-model="sendPower">
              <el-checkbox
                v-for="(item, index) in sendList"
                :key="'check' + index"
                :label="item.dictValue"
                class="send-check"
                >{{ item.dictName }}</el-checkbox
              ><br />
            </el-checkbox-group>
          </div>
        </div>
        <p class="send-out-box-tip">*勾选表示开启</p>
      </div>
      <template v-slot:footer>
        <div class="apaas_button">
          <el-button @click="sendFlag = false">取 消</el-button>
          <el-button type="primary" @click="changeSend">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      title="共享接收"
      v-model="shareFlag"
      width="640px"
      :before-close="
        () => {
          shareFlag = false;
        }
      "
    >
      <div style="overflow: hidden">
        <div class="share-out-box">共享接收</div>
        <div class="share-out-box1">
          <el-input
            v-model="checkSearch"
            @input="changeCheckInput"
            placeholder="名称/appID"
          ></el-input>
          <div class="check-container apaas_scroll_nor">
            <el-checkbox-group v-model="checkList">
              <p
                style="line-height: 26px; text-align: left"
                :title="item.systemName + '(' + item.appId + ')'"
                v-for="(item, index) in checkAll"
                :key="'check' + index"
              >
                <el-checkbox
                  :label="item.appId"
                  :disabled="item.receiveStatus == 1"
                  v-if="actionRow && actionRow.appId !== item.appId"
                  >{{ item.systemName }} ({{ item.appId }})</el-checkbox
                >
              </p>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="apaas_button">
          <el-button @click="shareFlag = false">取 消</el-button>
          <el-button type="primary" @click="changeShare">确 定</el-button>
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
    const { $message, $axios } = proxy;
    const bgTable = ref(null);
    const state = reactive({
      bgTable,
      tableTotal: 0,
      shareFlag: false,
      actionRow: null,
      checkList: [],
      checkAll: [],
      filter: {
        size: 10,
        page: 1,
      },
      topFilter: {
        systemName: "",
        appId: "",
        receiveStatus: "",
        sendStatus: "",
      },
      statusOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "启用",
          value: "0",
        },
        {
          label: "禁用",
          value: "1",
        },
      ],
      headers: [
        {
          label: "系统名称",
          prop: "systemName",
        },
        {
          label: "appID",
          prop: "appId",
          width: "290px",
        },
        {
          label: "secretKey",
          prop: "secretKey",
          width: "290px",
        },
        {
          label: "发送权限",
          prop: "sendStatus",
          width: "280px",
        },
        {
          label: "接收状态",
          prop: "receiveStatus",
          width: "80px",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          width: "160px",
        },
        {
          label: "更新人",
          prop: "updateBy",
          width: "100px",
        },
        {
          label: "操作",
          prop: "action",
          width: "300px",
        },
      ],
      tableRows: [],
      checkSearch: "",
      checkTimer: null,
      sendFlag: false,
      sendPower: [],
      sendList: [],
      sendObj: [],
    });

    const topFilterAction = () => {
      changePage(1);
    };
    const topFilterClear = () => {
      state.topFilter = {
        systemName: "",
        appId: "",
        receiveStatus: "",
        sendStatus: "",
      };
      changePage(1);
    };
    const delete_row = (row, type) => {
      let typeObj = {
        sendStatus: "send",
        receiveStatus: "receive",
      };
      let url = `/msg/application/${typeObj[type]}/${row.appId}/${
        row[type] == 0 ? 1 : 0
      }`;
      $axios
        .put(url)
        .then((res) => {
          if (res.data.code == 200) {
            if (row[type] == 0) {
              $message.success("禁用成功");
            } else {
              $message.success("启用成功");
            }
            getTableData();
          } else {
            if (row[type] == 0) {
              $message.error("禁用失败");
            } else {
              $message.error("启用失败");
            }
          }
        })
        .catch(() => {
          if (row[type] == 0) {
            $message.error("禁用失败");
          } else {
            $message.error("启用失败");
          }
        });
    };
    const changeSize = (size) => {
      state.filter.size = size;
      state.filter.page = 1;
      getTableData();
    };
    const changePage = (page) => {
      state.filter.page = page;
      getTableData();
    };
    const getTableData = () => {
      let params = {
        ...state.topFilter,
        sendStatus: state.topFilter.sendStatus.toString(),
      };
      $axios
        .get(
          `/msg/application/list/${state.filter.size}/${state.filter.page}`,
          {
            params,
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            state.tableRows = res.data.data || [];
            state.tableTotal = res.data.total;
          } else {
            $message.error(res.data.desc);
          }
        });
    };

    const share_row = (row) => {
      state.actionRow = row;
      state.checkSearch = "";
      initSelect();
      state.shareFlag = true;
    };

    //初始化接受对象
    const initSelect = () => {
      getCheckList();
      getCheckAll();
    };
    //勾选接收对象
    const getCheckList = () => {
      $axios
        .get(`/msg/application/share/${state.actionRow.appId}`)
        .then((res) => {
          if (res.data.code == 200) {
            state.checkList = res.data.data ? res.data.data.split(",") : [];
            console.log(state.checkList);
          } else {
            $message.error(res.data.desc);
          }
        });
    };
    //全部接收对象
    const getCheckAll = () => {
      $axios
        .get(`/msg/application/share`, {
          params: {
            appInfo: state.checkSearch,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            state.checkAll = res.data.data || [];
          } else {
            $message.error(res.data.desc);
          }
        });
    };
    //确认勾选接收对象
    const changeShare = () => {
      state.shareFlag = false;
      $axios
        .put(`/msg/application/share/${state.actionRow.appId}`, state.checkList)
        .then((res) => {
          if (res.data.code == 200) {
            $message.success("修改接收对象成功");
          } else {
            $message.error(res.data.desc);
          }
        });
    };

    //输入搜索
    const changeCheckInput = () => {
      if (state.checkTimer) {
        clearTimeout(state.checkTimer);
      }
      state.checkTimer = setTimeout(() => {
        getCheckAll();
      }, 500);
    };

    // 发送权限
    const send_row = (row) => {
      debugger
      state.sendFlag = true;
      state.actionRow = row;
      state.sendPower = row.sendStatus.split(",");
    };

    //获取通知方式
    const getPostType = () => {
      $axios.get(`/msg/dict/list/9999/1?dictContents=通知方式`).then((res) => {
        if (res.data.code == 200) {
          state.sendList = [...res.data.data];
          state.sendList.forEach((e) => {
            state.sendObj[e.dictValue] = e;
          });
        }
      });
    };

    const changeSend = () => {
      state.sendFlag = false;
      $axios
        .put(`/msg/application/send`, {
          appId: state.actionRow.appId,
          status: state.sendPower.toString(),
        })
        .then((res) => {
          if (res.data.code == 200) {
            $message.success("修改发送权限成功");
            getTableData();
          } else {
            $message.error(res.data.desc);
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
      share_row,
      changeShare,
      changeCheckInput,
      send_row,
      changeSend,
      getPostType,
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
  }
}
.check-container {
  width: 100%;
  height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 0;
  margin: 10px 0;
}
.share-out-box {
  float: left;
  width: 65px;
  font-size: 14px;
  color: #202531;
  margin-top: 20px;
  margin-right: 20px;
}
.share-out-box1 {
  float: left;
  width: 432px;
  border-radius: 4px;
  border: solid 1px #dadee7;
  padding: 16px;
}
.send-container {
  width: 100%;

  overflow-x: hidden;
  overflow-y: scroll;
  padding: 0;
  margin: 5px 0;
  text-align: left;
}
.send-out-box {
  float: left;
  width: 65px;
  font-size: 14px;
  color: #202531;
  margin-top: 20px;
  margin-right: 20px;
}
.send-out-box1 {
  float: left;
  width: 432px;
  border-radius: 4px;
  // border: solid 1px #dadee7;
  padding-top: 16px;
}
.send-check {
  display: block;
  margin-bottom: 5px;
}
.send-out-box-tip {
  float: left;
  font-size: 14px;
  color: #616f94;
  margin-right: 20px;
}
.send-tip {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #dd6955;
  border-radius: 50%;
  margin-top: -3px;
  vertical-align: middle;
}
.send-text {
  margin-right: 10px;
}
.send-tip-check {
  background-color: #48ad97;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: -3px;
  vertical-align: middle;
}
</style>
