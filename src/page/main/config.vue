<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 系统字典 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="config-container">
      <div class="left-container">
        <el-input class="name-input" @input="changeName" placeholder="请输入关键字搜索" v-model="name">
          <template v-slot:prefix>
            <i class="el-input__icon el-icon-search"></i>
          </template>
        </el-input>
        <div class="name-container apaas_scroll_nor">
          <div class="name-box" @click="changeNowName(item)" :class="{'in-name-box':nowName==item}" v-for="(item,index) in nameArr" :key="'name'+index">{{item}}</div>
        </div>
      </div>
      <div class="right-container">
        <div class="top_fliter">
          <show-more-filter class="filter_list">
            <div class="filter_item">
              <span class="filter_title">名称</span>
              <el-input prefix-icon="el-icon-search" v-model="topFilter.msgName" placeholder="请输入关键词" style="width: 200px" />
            </div>
            <div class="filter_item">
              <span class="filter_title">状态</span>
              <el-select v-model="topFilter.status" placeholder="请选择" style="width: 200px">
                <el-option v-for="(item, index) in statusOptions" :key="'status' + index" :label="item.label" :value="item.value">
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
          <div class="action-container apaas_button">
            <el-button type="primary" @click="addBtn">新建</el-button>
            <el-button @click="allAction(1)" class="gray-button">批量启用</el-button>
            <el-button @click="allAction(2)" class="gray-button">批量禁用</el-button>
            <el-button @click="allAction(3)">删除</el-button>
            <span>已选择 <b>{{allLength}}</b> 项</span>
            <span @click="clearSelect" class="pointer">清空</span>
          </div>
          <bg-table ref="bgTable" :select="true" @select="selectData" :headers="headers" :rows="tableRows">
            <template v-slot:status="{ row }">
              {{['禁用','启用'][row.status]}}
            </template>
            <template v-slot:action="{ row }">
              <bg-table-btn class="btn warn" @click="view_row(row,3)">
                查看
              </bg-table-btn>
              <bg-table-btn class="btn warn" @click="view_row(row,2)">
                编辑
              </bg-table-btn>
              <bg-table-btn class="btn warn" @click="use_row(row)">
                {{row.status==0?'启用':'禁用'}}
              </bg-table-btn>
              <bg-table-btn class="btn warn" @click="delete_row(row)">
                删除
              </bg-table-btn>
            </template>
          </bg-table>

          <Pagination class="main_pagination" :total="tableTotal" :page-sizes="[10, 50, 100]" :page-size="filter.size" :current-page="filter.page" @size-change="changeSize" @current-change="changePage" />
        </div>
      </div>
    </div>

    <el-dialog :title="['','新建','编辑','查看'][dataType]" v-model="dataFlag" width="920px" :before-close="()=>{dataFlag=false}">
      <el-form ref="dataForm1" class="dataForm" :model="dataForm" :rules="dataFormRules">
        <el-form-item label="字典名称" prop="tag" label-width="100px">
          <el-input v-model="dataForm.tag" :disabled="dataType==3"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value" label-width="100px">
          <el-input v-model="dataForm.value" :disabled="dataType==3"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="use" label-width="100px">
          <el-radio-group v-model="dataForm.use" :disabled="dataType==3">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="desc" label-width="100px">
          <el-input type="textarea" :disabled="dataType==3" v-model="dataForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="apaas_button" v-if="dataType==1||dataType==2">
          <el-button @click="dataFlag = false">取 消</el-button>
          <el-button type="primary" @click="changeData">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="删除" v-model="dialogDelete" width="400px" :before-close="()=>{dialogDelete=false}">
      <div>是否删除字典</div>
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
    const { $message, $axios } = proxy
    const bgTable = ref(null);
    const dataForm1 = ref(null);
    const state = reactive({
      allLength: 0,
      nowName: '1',
      bgTable,
      name: "",
      nameTimer:null,
      tableTotal: 0,
      filter: {
        size: 10,
        page: 1,
      },
      topFilter: {
        msgName: "",
        status: "",
      },
      statusOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "禁用",
          value: "0",
        },
        {
          label: "启用",
          value: "1",
        },
      ],
      nameArr:[],
      headers: [
        {
          label: "字典名称",
          prop: "dictName",
        },
        {
          label: "字典值",
          prop: "dictValue",
        },
        {
          label: "是否启用",
          prop: "status",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          width: "180px",
        },
        {
          label: "更新人",
          prop: "updateBy",
        },
        {
          label: "描述",
          prop: "description",
        },
        {
          label: "操作",
          prop: "action",
          width: 250,
        },
      ],
      tableRows: [],
    });

    //搜索左侧字典
    const changeName = ()=>{
      if(state.nameTimer){
        clearTimeout(state.nameTimer)
      }

      state.nameTimer = setTimeout(() => {
        searchName()
      }, 500);
    }

    //接口搜索左侧字典
    const searchName = (init=false)=>{
      $axios
        .get(`/msg/dict/contents?dictContents=${state.name}`)
        .then((res) => {
          if(res.data.code==200){
            state.nameArr = res.data.data
            if(init){
              state.nowName = state.nameArr[0]
              getTableData();
            }
          }
        })
    }

    //搜索，重置搜索
    const topFilterAction = () => {
      clearSelect();
      changePage(1);
    };
    const topFilterClear = () => {
      state.topFilter = {
        msgName: "",
        status: "",
      };
      clearSelect();
      changePage(1);
    };

    const view_row = (row, type) => {
      dataState.dataType = type;
      dataState.dataForm = {
        tag: row.dictName,
        value: row.dictValue,
        use: row.status,
        desc: row.description,
        id: row.id,
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
        .get(`/msg/dict/list/${state.filter.size}/${state.filter.page}`, {
          params: {
            ...state.topFilter,
            dictContents: state.nowName,
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            state.tableRows = res.data.data || [];
            state.tableTotal = res.data.total;
          }
        });
    };

    //table  选择处理逻辑
    //清除选中
    const clearSelect = () => {
      state.bgTable.clearTable();
    };
    const selectData = (data) => {
      console.log(data);
      state.allLength = data.allLength;
    };
    const getSelect = () => {
      let select = state.bgTable.dealSelectData();
      console.log(select);
      return select;
    };

    //数据状态改变
    const dataState = reactive({
      dataFlag: false,
      dialogDelete: false,
      dataRow: null,
      dataType: 1, //1新建2编辑3查看
      dataForm1,
      dataForm: {
        tag: "",
        value: "",
        use: "1",
        desc: "",
        id: "",
      },
      dataFormRules: {
        tag: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        value: [
          { required: true, message: "请输入字典值", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        desc: [{ max: 200, message: "最多 200 个字符", trigger: "blur" }],
      },
    });

    //新增按钮
    const addBtn = () => {
      dataState.dataType = 1;
      // dataState.dataForm={
      //   tag:'',
      //   value:'',
      //   use:1,
      //   desc:''
      // }
      if (dataState.dataForm1) {
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
            dictContents: state.nowName,
            dictName: dataState.dataForm.tag,
            dictValue: dataState.dataForm.value,
            status: dataState.dataForm.use,
            description: dataState.dataForm.desc,
          };
          //新增
          if (dataState.dataType == 1) {
            url = "/msg/dict";
            methods = "post";
            //编辑
          } else if (dataState.dataType == 2) {
            postData.id = dataState.dataForm.id;
            url = "/msg/dict";
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
              clearSelect();
              changePage(1);
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
    const use_row = (row, type = 1) => {
      //type:1单个2多个
      //当前启用--->禁用
      let url = "";
      let idArr = [];
      if (row.status == 1) {
        url = "/msg/dict/disable";
      } else {
        url = "/msg/dict/enable";
      }

      if (type == 1) {
        idArr = [row.id];
      } else {
        idArr = [...row.id];
      }

      $axios.put(url, idArr).then((res) => {
        if (res.data.code == 200) {
          if (row.status == 1) {
            $message.success("禁用成功");
          } else {
            $message.success("启用成功");
          }
          clearSelect();
          changePage(1);
        } else {
          if (row.status == 1) {
            $message.error(res.data.desc);
          } else {
            $message.error(res.data.desc);
          }
        }
      });
    };

    //确认删除
    const deleteData = () => {
      //单个删除
      let data = [];
      let params;
      if (dataState.dataRow) {
        data = [dataState.dataRow.id];
      } else {
        //多个删除
        params = getSelect();
        for (const key in params) {
          data.push(key);
        }
      }
      dataState.dialogDelete = false;
      $axios.delete("/msg/dict", { data: data }).then((res) => {
        if (res.data.code == 200) {
          $message.success("删除成功");
          clearSelect();
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

    //批量操作按钮type 1启用  2禁用  3删除
    const allAction = (type) => {
      let params = null;
      let data = [];
      let status = 0;
      if (state.allLength == 0) {
        $message.error("请先选择字典");
        return;
      }

      if (type == 3) {
        dataState.dataRow = null;
        dataState.dialogDelete = true;
      } else {
        params = getSelect();
        for (const key in params) {
          if (2 == type) {
            if (params[key].status == 1) {
              status = params[key].status;
              data.push(key);
            }
          } else {
            if (params[key].status == 0) {
              status = params[key].status;
              data.push(key);
            }
          }
        }

        use_row({ status, id: data }, 2);
      }
    };

    //切换字典
    const changeNowName = (idx) => {
      state.nowName = idx;
      //getData添加字典搜索字段，在此需要修改
      topFilterClear();
    };

    onBeforeMount(() => {
      searchName(true)
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
      clearSelect,
      selectData,
      changeNowName,
      addBtn,
      use_row,
      changeData,
      deleteData,
      allAction,
      changeName,
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
  .config-container {
    display: flex;
    flex-grow: 1;
    .left-container {
      width: 280px;
      background-color: #ffffff;
      box-shadow: 0px 1px 4px 0px rgba(0, 7, 101, 0.1);
      border-radius: 6px;
      margin: 0 14px 14px 0;
      .name-input {
        margin: 16px;
        width: calc(100% - 32px);
      }
      .name-container {
        width: 100%;
        height: calc(100% - 72px);
        overflow-y: scroll;

        .name-box {
          font-size: 14px;
          height: 32px;
          line-height: 32px;
          color: #404a62;
          text-align: center;
          cursor: pointer;
          &:hover {
            background-color: #dfe5f6;
            color: #3759be;
          }
        }
        .in-name-box {
          background-color: #dfe5f6;
          color: #3759be;
        }
      }
    }
    .right-container {
      width: calc(100% - 294px);
      display: flex;
      flex-direction: column;

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
  }
}

.dataForm {
  width: 700px;
  margin: 0 auto;
  text-align: left;
}
</style>
