<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 消息监控 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="top_fliter">
      <show-more-filter class="filter_list">
        <div class="filter_item">
          <span class="filter_title">消息ID</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.msgId"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item" v-if="userInfo&&userInfo.userType == 1">
          <span class="filter_title">appID</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.appId"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">消息类型</span>
          <el-select
            v-model="topFilter.msgType"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="'status' + index"
              :label="item.dictName"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </div>
        <div class="filter_item">
          <span class="filter_title">通知方式</span>
          <el-select
            v-model="topFilter.notifyWay"
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
        <div class="filter_item" v-if="userInfo&&userInfo.userType == 1">
          <span class="filter_title">系统名称</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.systemName"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">消息标题</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.msgTitle"
            placeholder="请输入关键词"
            style="width: 200px"
          />
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
      <bg-table ref="bgTable" :headers="headers" :rows="tableRows">
        <template v-slot:notifyWay="{ row }">
          {{
            pushObj[row.notifyWay] ? pushObj[row.notifyWay].dictName || "" : ""
          }}
        </template>
        <template v-slot:msgType="{ row }">
          {{
            statusObj[row.msgType] ? statusObj[row.msgType].dictName || "" : ""
          }}
        </template>
        <template v-slot:readCount="{ row }">
          <span
            @click="readShow(row)"
            class="readnum"
            v-if="row.notifyWay == 1 || row.notifyWay == 2"
            >{{ row.readCount }}/{{ row.noReadCount || "-" }}</span
          >
          <span @click="readShow(row)" class="readnum" v-else>-</span>
        </template>
        <template v-slot:sendCount="{ row }">
          <span
            v-if="row.notifyWay == 3 || row.notifyWay == 2"
            @click="sendShow(row)"
            class="readnum"
            >{{ row.sendCount }}/{{ row.noSendCount || "-" }}</span
          >
          <span v-else @click="sendShow(row)" class="readnum">-</span>
        </template>
        <template v-slot:notifyObject="{ row }">
          {{
            noticeObj[row.notifyObject]
              ? noticeObj[row.notifyObject].dictName || ""
              : ""
          }}
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

    <el-dialog
      title="数据列表"
      v-model="dialogRead"
      width="640px"
      :before-close="
        () => {
          dialogRead = false;
        }
      "
    >
      <div class="read-container">
        <el-tabs class="read-tab" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已读" name="read">
            <bg-table
              :headers="readHeaders"
              :rows="readTableRows"
              height="100%"
            ></bg-table>
          </el-tab-pane>
          <el-tab-pane label="未读" name="unread">
            <bg-table
              :headers="unreadHeaders"
              :rows="readTableRows"
              height="100%"
            ></bg-table>
          </el-tab-pane>
          <Pagination
            :total="readTotal"
            :page-sizes="[10, 50, 100]"
            :page-size="read.size"
            :current-page="read.page"
            @size-change="readChangeSize"
            @current-change="readChangePage"
          />
        </el-tabs>
        <el-input
          class="search"
          v-model="readSearch"
          @input="changSearch"
          placeholder="姓名/账号（ID）"
        >
        <template v-slot:prefix>
          <i class="el-input__icon el-icon-search"></i>
        </template>
        </el-input>
      </div>
    </el-dialog>
    <el-dialog
      title="数据列表"
      v-model="dialogSend"
      width="640px"
      :before-close="
        () => {
          dialogSend = false;
        }
      "
    >
      <div class="read-container">
        <el-tabs
          class="read-tab"
          v-model="activeSendName"
          @tab-click="handleSendClick"
        >
          <el-tab-pane label="送达" name="send">
            <bg-table
              :headers="sendHeaders"
              :rows="sendTableRows"
              height="100%"
            >
              <template v-slot:userName="{ row }">
                {{ row.userName || "-" }}
              </template>
            </bg-table>
          </el-tab-pane>
          <el-tab-pane label="未送达" name="unsend">
            <bg-table
              :headers="unsendHeaders"
              :rows="sendTableRows"
              height="100%"
            ></bg-table>
          </el-tab-pane>
          <Pagination
            :total="sendTotal"
            :page-sizes="[10, 50, 100]"
            :page-size="send.size"
            :current-page="send.page"
            @size-change="sendChangeSize"
            @current-change="sendChangePage"
          />
        </el-tabs>
        <el-input
          class="search"
          v-model="sendSearch"
          @input="changSendSearch"
          placeholder="姓名/手机号"
        >
          <template v-slot:prefix>
            <i class="el-input__icon el-icon-search"></i>
          </template>
        </el-input>
      </div>
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
        msgId: "",
        appId: "",
        msgType: "",
        systemName: "",
        notifyWay: "",
        msgTitle: "",
        time: "",
      },
      statusOptions: [], //消息类型数组
      statusObj: {}, //消息类型对象
      pushOptions: [], //通知方式数组
      pushObj: {}, //通知方式对象
      noticeObj: {}, //通知对象对象
      headers: [
        {
          label: "消息ID",
          prop: "msgId",
          width: "300px",
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
          label: "通知对象",
          prop: "notifyObject",
        },
        {
          label: "通知方式",
          prop: "notifyWay",
        },
        {
          label: "消息类型",
          prop: "msgType",
        },
        {
          label: "消息标题",
          prop: "msgTitle",
        },
        {
          label: "送达/未送达",
          prop: "sendCount",
          width: "100px",
        },
        {
          label: "已读/未读",
          prop: "readCount",
          width: "100px",
        },
        {
          label: "推送时间",
          prop: "pushTime",
          width: "160px",
        },
        {
          label: "操作",
          prop: "action",
          width: 100,
        },
      ],
      tableRows: [],
    });

    const readState = reactive({
      activeName: "read",
      readTotal: 0,
      read: {
        size: 10,
        page: 1,
      },
      times: null,
      readSearch: "",
      dialogRead: false,
      readHeaders: [
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "账号（ID）",
          prop: "userId",
        },
        {
          label: "阅读时间",
          prop: "readTime",
        },
      ],
      unreadHeaders: [
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "账号（ID）",
          prop: "userId",
        },
      ],

      readTableRows: [],
    });
    const sendState = reactive({
      activeSendName: "send",
      sendTotal: 0,
      send: {
        size: 10,
        page: 1,
      },
      times: null,
      sendSearch: "",
      dialogSend: false,

      sendHeaders: [
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "手机号",
          prop: "phoneNumber",
        },
        {
          label: "送达时间",
          prop: "pushTime",
        },
      ],
      unsendHeaders: [
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "手机号",
          prop: "phoneNumber",
        },
        {
          label: "错误信息",
          prop: "errorInfo",
        },
      ],
      sendTableRows: [],
    });

    const userInfo = computed(() => {
      return $store.state.userInfo;
    });

    const topFilterAction = () => {
      changePage(1);
    };
    const topFilterClear = () => {
      state.topFilter = {
        msgId: "",
        appId: "",
        msgType: "",
        systemName: "",
        notifyWay: "",
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
      topFilter.notifyWay = topFilter.notifyWay.toString();
      delete topFilter.time;
      let url = "";
      if ($store.state.userInfo.userType == 1) {
        //超管
        url = `/msg/mgt/list/${state.filter.size}/${state.filter.page}`;
      } else {
        url = `/msg/mgt/app/list/${state.filter.size}/${state.filter.page}`;
      }
      $axios
        .get(url, {
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

    //展示已读未读表格
    const readShow = (row) => {
      state.actionRow = row;
      readState.readSearch = "";
      readState.activeName = "read";
      readState.read.page = 1;
      getReadTableData();
      readState.dialogRead = true;
    };

    //切换已读未读
    const handleClick = () => {
      readState.readSearch = "";
      getSearchData();
    };

    //触发阅读搜索
    const changSearch = () => {
      if (readState.times) {
        clearTimeout(readState.times);
      }
      readState.times = setTimeout(() => {
        getSearchData();
      }, 1000);
    };

    //阅读搜索接口调用
    const getSearchData = () => {
      readChangePage(1);
    };

    //阅读翻页
    const readChangeSize = (pageSize) => {
      readState.read = {
        size: pageSize,
        page: 1,
      };
      getReadTableData();
    };
    const readChangePage = (page) => {
      readState.read.page = page;
      getReadTableData();
    };

    //展示送达未送达表格
    const sendShow = (row) => {
      state.actionRow = row;
      sendState.sendSearch = "";
      sendState.activeSendName = "send";
      sendState.send.page = 1;
      getSendTableData();
      sendState.dialogSend = true;
    };

    //切换已读未读
    const handleSendClick = () => {
      sendState.sendSearch = "";
      getSendSearchData();
    };

    //触发阅读搜索
    const changSendSearch = () => {
      if (sendState.times) {
        clearTimeout(sendState.times);
      }
      sendState.times = setTimeout(() => {
        getSendSearchData();
      }, 1000);
    };

    //阅读搜索接口调用
    const getSendSearchData = () => {
      sendChangePage(1);
    };

    //阅读翻页
    const sendChangeSize = (pageSize) => {
      sendState.send = {
        size: pageSize,
        page: 1,
      };
      getSendTableData();
    };
    const sendChangePage = (page) => {
      sendState.send.page = page;
      getSendTableData();
    };
    //获取消息类型
    const getMsgType = () => {
      $axios.get(`/msg/dict/list/9999/1?dictContents=消息类型`).then((res) => {
        if (res.data.code == 200) {
          state.statusOptions = [
            { dictName: "全部", dictValue: "" },
            ...res.data.data,
          ];
          state.statusOptions.forEach((e) => {
            state.statusObj[e.dictValue] = e;
          });
        }
      });
    };

    //获取通知方式
    const getPostType = () => {
      $axios.get(`/msg/dict/list/9999/1?dictContents=通知方式`).then((res) => {
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

    //获取通知对象
    const getNoticeObj = () => {
      $axios.get(`/msg/dict/list/9999/1?dictContents=通知对象`).then((res) => {
        if (res.data.code == 200) {
          let pushOptions = [
            { dictName: "全部", dictValue: "" },
            ...res.data.data,
          ];
          pushOptions.forEach((e) => {
            state.noticeObj[e.dictValue] = e;
          });

          getTableData();
        }
      });
    };

    const getReadTableData = () => {
      let url = "";
      if (readState.activeName == "read") {
        url = `/msg/mgt/read/list/${readState.read.size}/${readState.read.page}`;
      } else {
        url = `/msg/mgt/unRead/list/${readState.read.size}/${readState.read.page}`;
      }
      $axios
        .get(url, {
          params: {
            msgId: state.actionRow.msgId,
            userInfo: readState.readSearch,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            readState.readTableRows = res.data.data || [];
            readState.readTotal = res.data.total;
          }
        });
    };
    const getSendTableData = () => {
      let url = "";
      if (sendState.activeSendName == "send") {
        url = `/msg/sms/send/list/${sendState.send.size}/${sendState.send.page}`;
      } else {
        url = `/msg/sms/unSend/list/${sendState.send.size}/${sendState.send.page}`;
      }
      $axios
        .get(url, {
          params: {
            msgId: state.actionRow.msgId,
            phoneNumber: sendState.sendSearch,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            sendState.sendTableRows = res.data.data || [];
            sendState.sendTotal = res.data.total;
          }
        });
    };

    onBeforeMount(() => {
      getMsgType();
      getPostType();
      getNoticeObj();

      if ($store.state.userInfo.userType != 1) {
        //超管
        state.headers = [
          {
            label: "消息ID",
            prop: "msgId",
            width: "300px",
          },
          {
            label: "通知对象",
            prop: "notifyObject",
          },
          {
            label: "通知方式",
            prop: "notifyWay",
          },
          {
            label: "消息类型",
            prop: "msgType",
          },
          {
            label: "消息标题",
            prop: "msgTitle",
          },
          {
            label: "送达/未送达",
            prop: "sendCount",
            width: "100px",
          },
          {
            label: "已读/未读",
            prop: "readCount",
            width: "100px",
          },
          {
            label: "推送时间",
            prop: "pushTime",
            width: "160px",
          },
          {
            label: "操作",
            prop: "action",
            width: 100,
          },
        ];
      }
    });

    return {
      ...toRefs(state),
      ...toRefs(readState),
      ...toRefs(sendState),
      topFilterAction,
      topFilterClear,
      delete_row,
      changeSize,
      changePage,
      getTableData,
      deleteData,
      handleClick,
      changSearch,
      readChangeSize,
      readChangePage,
      readShow,
      getSendTableData,
      sendShow,
      handleSendClick,
      changSendSearch,
      getSendSearchData,
      sendChangeSize,
      sendChangePage,
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
