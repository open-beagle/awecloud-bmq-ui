<template>
  <div class="bg-upload-image">
    <el-upload
      action="/bgfile/upload"
      :data="{
        directory: 'file',
      }"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <div class="trigger-content">
        <div class="image-trigger" v-if="value">
          <img :src="value" />
          <div class="refresh-image">
            <i class="el-icon-refresh-right"></i>
          </div>
        </div>
        <div class="upload-trigger" v-else>
          <span class="upload-icon"></span>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "BgUploadImage",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleAvatarSuccess({ data }) {
      this.$emit("change", data.visitURL);
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
  },
};
</script>
