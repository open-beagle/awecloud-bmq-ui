<template>
  <div class="bg-upload-image user-upload-image">
    <el-upload
      action="#"
      ref="upload"
      :auto-upload="false"
      :on-change="onChangeFile"
      :file-list="fileList"
      :disabled="disabled"
    >
      <template v-slot:trigger>
        <div class="trigger-content">
          <div class="image-trigger" v-if="modelValue">
            <img :src="modelValue" />
            <div class="refresh-image">
              <i class="el-icon-refresh-right"></i>
            </div>
          </div>
          <div class="upload-trigger" v-else>
            <span class="upload-icon"></span>
          </div>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "BgUploadImage",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  emits: ['update:modelValue'],
  data(){
      return{
          fileList:[]
      }
  },
  created(){

  },
  methods: {
    handleAvatarSuccess({ data }) {
      this.$emit("update:modelValue", data.visitURL);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传的图片只能是 JPG、PNG 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传的图片大小不能超过 1MB!");
      }

      return isJPG && isLt1M;
    },
    onChangeFile(file, fileList){
        console.log(file, fileList);
        if(!this.beforeAvatarUpload(file.raw)){
            return
        }
        var reader = new FileReader();
        reader.readAsDataURL(file.raw); // 一定要传入file格式  
        reader.onload = () => {
            this.$emit("update:modelValue", reader.result);
        };
    }
  },
};
</script>

<style scoped>
.user-upload-image :deep() .el-upload-list{
    display: none;
}
</style>
