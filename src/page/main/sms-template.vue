<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 短信模板管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="top_fliter">
      <show-more-filter class="filter_list">
        <div class="filter_item">
          <span class="filter_title">编号</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.smsModelNumber"
            placeholder="请输入关键词"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">标题</span>
          <el-input
            prefix-icon="el-icon-search"
            v-model="topFilter.smsModelTitle"
            placeholder="请输入标题"
            style="width: 200px"
          />
        </div>
        <div class="filter_item">
          <span class="filter_title">是否启用</span>
          <el-select
            v-model="topFilter.isUsed"
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
      </show-more-filter>
      <div class="filter_action apaas_button">
        <el-button type="primary" @click="topFilterAction"> 查询 </el-button>
        <el-button type="default" @click="topFilterClear"> 重置 </el-button>
      </div>
    </div>

    <div class="main_container">
      <div class="action-container apaas_button" v-if="userInfo&&userInfo.userType == 1">
        <el-button type="primary" @click="addBtn">新建</el-button>
      </div>
      <bg-table ref="bgTable" :headers="headers" :rows="tableRows">
        <template v-slot:isUsed="{ row }">
          {{ ["禁用", "启用"][row.isUsed] }}
        </template>
        <template v-slot:updatedTime="{ row }">
          {{ row.updatedTime ? row.updatedTime.split(".")[0] : "-" }}
        </template>
        <template v-slot:action="{ row }">
          <bg-table-btn class="btn warn" v-if="userInfo&&userInfo.userType != 1" @click="view_row(row, 3)">
            查看
          </bg-table-btn>
          <bg-table-btn class="btn warn" v-if="userInfo&&userInfo.userType == 1" @click="view_row(row, 2)">
            编辑
          </bg-table-btn>
          <bg-table-btn class="btn warn" v-if="userInfo&&userInfo.userType == 1" @click="use_row(row)">
            {{ row.isUsed == 0 ? "启用" : "禁用" }}
          </bg-table-btn>
          <bg-table-btn class="btn warn" v-if="userInfo&&userInfo.userType == 1" @click="delete_row(row)">
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
      :title="['', '新建', '编辑', '查看'][dataType]"
      v-model="dataFlag"
      width="920px"
      :before-close="
        () => {
          dataFlag = false;
        }
      "
    >
      <el-form
        ref="dataForm1"
        class="dataForm"
        :model="dataForm"
        :rules="dataFormRules"
      >
        <el-form-item label="标题" prop="smsModelTitle" label-width="100px">
          <el-input
            v-model="dataForm.smsModelTitle"
            :disabled="dataType == 3"
          ></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="smsModelBody" label-width="100px">
          <el-input
            v-model="dataForm.smsModelBody"
            type="textarea"
            :autosize="{ minRows: 5 }"
            resize="none"
            :disabled="dataType == 3"
          ></el-input>
          <el-tooltip
            class="item"
            effect="light"
            content="变量格式：${变量名}，例如${code}，code即为变量名"
            placement="top-start"
          >
            <i class="icon-info el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备案编号" class="half" label-width="100px">
          <el-select v-model="dataForm.smsGateway" :disabled="dataType == 3" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="'type' + item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="dataForm.smsTemplateCode"
            maxlength="50"
            show-word-limit
            :disabled="dataType == 3"
            style="width: 366px"
          ></el-input>
          <el-tooltip
            class="item"
            effect="light"
            content="请填写该模板在短信网关平台备案通过后的模板编码"
            placement="top-start"
          >
            <i class="icon-info el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <template
        v-slot:footer
        class="apaas_button"
        v-if="dataType == 1 || dataType == 2"
      >
        <el-button @click="dataFlag = false">取 消</el-button>
        <el-button type="primary" @click="changeData">确 定</el-button>
      </template>
    </el-dialog>

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
      <div>是否删除短信模板</div>
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
  computed,
  onMounted,
  getCurrentInstance,
  ref
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
    const { $message, $axios,$store } = proxy;
    const bgTable = ref(null);
    const dataForm1 = ref(null);
    const state = reactive({
      allLength: 0,
      nowName: "1",
      bgTable,
      name: "",
      nameTimer: null,
      tableTotal: 0,
      filter: {
        size: 10,
        page: 1,
      },
      topFilter: {
        smsModelNumber: "", //	否	string	编号
        smsModelTitle: "", //	否	string	标题
        isUsed: "", //	否	string	是否启用(0-未启用,1-启用), 全部则不传
      },
      statusOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      nameArr: [],
      headers: [
        {
          label: "编号",
          prop: "smsModelNumber",
          width:"140px"
        },
        {
          label: "标题",
          prop: "smsModelTitle",
        },
        {
          label: "正文",
          prop: "smsModelBody",
        },
        {
          label: "是否启用",
          prop: "isUsed",
          width:"140px"
        },
        {
          label: "更新时间",
          prop: "updatedTime",
          width:"220px"
        },
        {
          label: "更新人",
          prop: "updatedBy",
          width:"140px"
        },
        {
          label: "操作",
          prop: "action",
          width: 250,
        },
      ],
      tableRows: [],
      typeOptions: [],
    });

    //搜索，重置搜索
    const topFilterAction = () => {
      changePage(1);
    };
    const topFilterClear = () => {
      state.topFilter = {
        smsModelNumber: "", //	否	string	编号
        smsModelTitle: "", //	否	string	标题
        isUsed: "", //	否	string	是否启用(0-未启用,1-启用), 全部则不传
      };
      changePage(1);
    };
    //获取网关数据
    const getTypeOptions = () => {
      $axios
        .get(`/msg/dict/list/9999/1`, {
          params: {
            msgName: "",
            status: 1,
            dictContents: "短信网关",
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            state.typeOptions = res.data.data || [];
          }
        });
    };

    const view_row = (row, type) => {
      dataState.dataType = type;
      dataState.dataForm = {
        smsModelTitle: row.smsModelTitle,
        smsModelBody: row.smsModelBody,
        smsGateway: row.smsGateway,
        smsTemplateCode: row.smsTemplateCode,
        smsModelNumber: row.smsModelNumber,
      };
      if (dataState.dataForm1) {
        dataState.dataForm1.clearValidate();
      }
      dataState.dataRow = row;
      dataState.dataFlag = true;
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
      $axios
        .get(`/msg/sms/list/model/${state.filter.size}/${state.filter.page}`, {
          params: {
            ...state.topFilter,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            state.tableRows = res.data.data || [];
            state.tableTotal = res.data.total;
          }
        });
    };

    //数据状态改变
    const dataState = reactive({
      dataFlag: false,
      dialogDelete: false,
      dataRow: null,
      dataType: 1, //1新建2编辑3查看
      dataForm1,
      dataForm: {
        smsModelTitle: "",
        smsModelBody: "",
        smsGateway: "",
        smsTemplateCode: "",
        smsModelNumber: "",
      },
      dataFormRules: {
        smsModelTitle: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        smsModelBody: [
          { required: true, message: "请输入正文", trigger: "blur" },
          {
            min: 1,
            max: 140,
            message: "长度在 1 到 140 个字符",
            trigger: "blur",
          },
        ],
      },
    });

    //新增按钮
    const addBtn = () => {
      dataState.dataType = 1;

      if (dataState.dataForm1) {
        dataState.dataForm.smsGateway = "";
        dataState.dataForm.smsTemplateCode = "";
        dataState.dataForm1.resetFields();
      }
      dataState.dataRow = null;
      dataState.dataFlag = true;
    };

    //确定添加编辑数据
    const changeData = () => {
      dataState.dataForm1.validate((valid) => {
        if (valid) {
          let url = "";
          let methods = "";
          let postData = {
            smsModelTitle: dataState.dataForm.smsModelTitle,
            smsModelBody: dataState.dataForm.smsModelBody,
            smsGateway: dataState.dataForm.smsGateway,
            smsTemplateCode: dataState.dataForm.smsTemplateCode,
          };
          //新增
          if (dataState.dataType == 1) {
            url = "/msg/sms/save";
            methods = "post";
            //编辑
          } else if (dataState.dataType == 2) {
            postData.smsModelNumber = dataState.dataForm.smsModelNumber;
            url = "/msg/sms";
            methods = "put";
          }

          dataState.dataFlag = false;

          $axios[methods](url, {
            ...postData,
          }).then((res) => {
            if (res.data.code == 200) {
              if (dataState.dataType == 1) {
                $message.success("新增成功");
              } else if (dataState.dataType == 2) {
                $message.success("编辑成功");
              }
              getTableData();
            } else {
              if (dataState.dataType == 1) {
                $message.error(res.data.desc);
              } else if (dataState.dataType == 2) {
                $message.error(res.data.desc);
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //禁用启用
    const use_row = (row) => {
      //当前启用--->禁用
      let url = "";
      if (row.isUsed == 1) {
        url = `/msg/sms/disable/${row.smsModelNumber}/0`;
      } else {
        url = `/msg/sms/disable/${row.smsModelNumber}/1`;
      }

      $axios.put(url).then((res) => {
        if (res.data.code == 200) {
          if (row.isUsed == 1) {
            $message.success("禁用成功");
          } else {
            $message.success("启用成功");
          }
          getTableData();
        } else {
          if (row.isUsed == 1) {
            $message.error(res.data.desc);
          } else {
            $message.error(res.data.desc);
          }
        }
      });
    };

    //确认删除
    const deleteData = () => {
      dataState.dialogDelete = false;
      $axios
        .delete(`/msg/sms/delete/${dataState.dataRow.smsModelNumber}`)
        .then((res) => {
          if (res.data.code == 200) {
            $message.success("删除成功");
            changePage(1);
          } else {
            $message.error(res.data.desc);
          }
        });
    };

    //删除弹窗
    const delete_row = (row) => {
      dataState.dataRow = row;
      dataState.dialogDelete = true;
    };

    const userInfo = computed(() => {
      return $store.state.userInfo;
    });

    onBeforeMount(() => {
      getTypeOptions();
      getTableData();
    });

    return {
      ...toRefs(state),
      ...toRefs(dataState),
      topFilterAction,
      topFilterClear,
      delete_row,
      view_row,
      changeSize,
      changePage,
      getTableData,
      addBtn,
      use_row,
      changeData,
      deleteData,
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
    .action-container {
      width: 100%;
      height: 52px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e6e9ef;

      span {
        font-size: 14px;
        color: #202531;
        margin-left: 32px;
      }
    }
  }
}

.dataForm {
  width: 700px;
  margin: 0 auto;
  text-align: left;
}
.el-form-item .icon-info {
  position: absolute;
  right: -24px;
  bottom: 10px;
  font-size: 18px;
  color: #2b4695;
}
.half .el-input {
  width: 370px;
  margin-left: 12px;
}
.half .el-input__inner {
  width: 370px;
}
</style>
<style>
.el-tooltip__popper.is-light {
  font-size: 14px;
  color: #202531;
  border: 0;
  box-shadow: 0px 4px 12px 0px rgba(18, 30, 63, 0.1);
}
</style>
