<template>
  <div class="detail_container">
    <div class="bg-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 首选项 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main_container">
        <el-form ref="formSet" class="form" :rules="formRules" :model="form" label-width="80px">
          <p class="form-gap">基本信息</p>
            <el-form-item label="系统名称">
                <el-input v-model="form.name" :disabled="editState"></el-input>
            </el-form-item>
            <el-form-item label="LOGO">
                <bg-user-upload-image :disabled="editState" ref="logo" v-model="form.logo"></bg-user-upload-image>
                <span class="tips">建议上传图片尺寸为40*40 px</span>
            </el-form-item>
          <p class="form-gap">站内信相关配置</p>
            <el-form-item label="保存时长">
                <el-input v-model="form.time" :disabled="editState">
                <template v-slot:suffix>
                  <span>天</span>
                </template>
                </el-input>
            </el-form-item>
          <p class="form-gap">短信相关配置</p>
            <el-form-item label="开启短信通知功能" label-width="130px">
                <bg-switch :disabled="editState" :labels="['OFF','ON']" :values="[0,1]" v-model="form.sms"></bg-switch>
            </el-form-item>
            <el-form-item label="重试次数" prop="retryCount">
                <el-input :disabled="editState||form.sms==0" v-model="form.retryCount">
                  <template v-slot:suffix>
                    <span>次</span>
                  </template>
                </el-input>
            </el-form-item>
            <el-form-item label="重试间隔" prop="retryInterval">
                <el-input :disabled="editState||form.sms==0" v-model="form.retryInterval">
                  <template v-slot:suffix>
                    <span>分</span>
                  </template>
                </el-input>
            </el-form-item>
            <bg-rich-text v-model="rich"></bg-rich-text>
        </el-form>

        <after-table :afterData="[]"></after-table>

        <bg-detail-table :layout="{line_num:4}"></bg-detail-table>

        <el-button v-if="editState" class="edit-btn" @click="editState=false" type="primary">编辑</el-button>
        <el-button v-if="!editState" class="edit-btn cancel" @click="cancel">取消</el-button>
        <el-button v-if="!editState" class="edit-btn" @click="edit" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs,onBeforeMount,onMounted,ref,getCurrentInstance } from 'vue'
import afterTable from '@/components/after-table.vue'
 var checkRetryCount = (rule, value, callback) => {
        test(rule, value, callback)
      };
 var checkRetryInterval = (rule, value, callback) => {
        test(rule, value, callback)
      }
var test = (rule, value, callback) => {
        if(value>=0&&value<=99){
          var reg = /^\+?([0-9]|[1-9]\d*)$/
          if(reg.test(value)){
            callback()
          }else{
            callback(new Error('请输入正整数'));
          }
        }else{
          callback(new Error('数值在0-99之间'));
        }
      }
        const { proxy } = getCurrentInstance()
        const { $message,$axios,$store } = proxy
        const formSet = ref(null)
        const state = reactive({
            formSet,
            rich:'',
            editState:true,//编辑状态true不可编辑
            form:{
                name:'',
                logo:'',
                time:'',
                sms:1,
                retryCount:0,
                retryInterval:0,
                id:'',
            },
            formRules:{
              retryCount:[
                { validator: checkRetryCount, trigger: 'blur' }
              ],
              retryInterval:[
                { validator: checkRetryInterval, trigger: 'blur' }
              ],
            },
            afterData:[

            ]
        })


        const edit = ()=>{
          let reg = /^\+?[0-9]\d*$/
          if(!state.form.name){
            $message.error('请输入系统名称');
            return
          }else if(state.form.name.length>50){
            $message.error('系统名称不能超过50个字符');
            return
          }
          if(!state.form.logo){
            $message.error('请选择logo');
            return
          }
          if(!state.form.time){
            $message.error('请输入保存时长');
            return
          }
          if(reg.test(state.form.time)&&state.form.time<=732){
            state.formSet.validate((valid) => {
              if (valid) {
                save()
              }else{
                $message.error('请按要求完成填写')
              }
            })
          }else{
            $message.error('请输入0-732的整数')
            return
          }
        }

        const cancel = ()=>{
          getData()
          state.editState=true
        }

        const save = ()=>{
          state.editState=true
          $axios.put(`/msg/system`,{
            id:state.form.id,
            appId:$store.state.userInfo.id,
            systemName:state.form.name,
            reservedDay:state.form.time,
            picture:state.form.logo,
            messageSwitch:state.form.sms,
            retryCount:state.form.retryCount,
            retryTime:state.form.retryInterval,
          }).then(res=>{
            if(res.data.code==200){
              $message.success('编辑成功')
              $store.commit('setNameFlag',!$store.state.nameFlag)
              getData()
            }else{
              $message.error(res.data.desc)
            }
          })
        }

        const getData = ()=>{
          $axios.get(`/msg/system/${$store.state.userInfo.user}`).then(res=>{
            if(res.data.code==200){
              let data = res.data.data
              state.form={
                name:data.systemName,
                logo:data.picture,
                time:data.reservedDay,
                sms:data.messageSwitch,
                retryCount:data.retryCount,
                retryInterval:data.retryTime,
                id:data.id
              }
            }
          })
        }

        onBeforeMount(()=>{
          getData()
          setTimeout(() => {
            state.rich='<p>qweqeqwwe1122</p>'
          }, 5000);
        })

        const { editState, form,formRules,rich } = toRefs(state)
</script>
<script>
export default {
    
}
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
    margin-bottom: 14px;
    position: relative;

    .el-table{
      flex:1;
    }

    .form{
        margin-bottom: 50px;
        width: 710px;
        .tips{
          font-size: 14px;
          color: #616f94;
          position: absolute;
          left: 170px;
          bottom: -10px;
        }

        .form-gap{
          font-size: 16px;
          font-weight: 600;
          color: #202531;
          margin-bottom: 27px;

          &::before{
            width: 4px;
            height: 16px;
            background-color: #2b4695;
            border-radius: 2px;
            display: inline-block;
            vertical-align: -2px;
            margin-right: 8px;
            content:'';
          }
        }
    }

    .edit-btn{
        position: absolute;
        right: 40px;
        bottom: 40px;
        background-color: #2b4695;
	      border-radius: 4px;
        width: 92px;
	      height: 36px;
        padding: 0;
    }
    .cancel{
      right:140px;
      background-color: #fff;
      color: #000;
    }
  }
}
</style>
