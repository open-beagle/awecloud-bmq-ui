<template>
  <div class="bg-upload" :class="{ disabled: actionDisabled }">
    <el-upload
      action="/apaas/static/image/upload"
      :data="{
        directory: 'file',
      }"
      :before-upload="handleBeforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="limit"
      :disabled="actionDisabled"
      style="max-width: 600px;"
      multiple
    >
      <!-- <el-button type="primary">
        上传附件
      </el-button>
      <div class="el-upload__tip" slot="tip">
        支持上传{{ fileTypes.join("、") }}，最大{{ fileMaxSize }}M
      </div> -->
      <div class="trigger-content">
        <div class="trigger-icon">
          <img src="./imgs/ic_updata_cloud.png" />
        </div>
        <p class="trigger-tip">
          1.最多允许上传{{ limit }}个附件 <br />
          2.单个附件最大{{ fileMaxSize }}M； <br />
          3.允许上传后缀为传{{ fileTypes.join("、") }} <br />
        </p>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "BgUpload",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    limit: {
      type: Number,
    },
    fileTypes: {
      type: Array,
      default: () => [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "pdf",
        "jpg",
        "jpeg",
        "png",
      ],
    },
    fileMaxSize: {
      type: Number,
      default: 20, // 单位：M
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    refresh: {
      type: Boolean,
      default: false,
    }, // 是否重新初始化附件（手动刷新组件的附件列表）
  },
  data() {
    return {
      fileList: [],
    };
  },
  computed: {
    actionDisabled() {
      return this.disabled || this.fileList.length === this.limit;
    },
  },
  watch: {
    refresh(value) {
      if (value) {
        this.initFileList();
      }
    },
  },
  methods: {
    initFileList() {
      let urls = (this.value && this.value.split(",")) || [];

      this.fileList = urls.map((url, index) => {
        let temp = url.split("/");
        let name = temp[temp.length - 1] || `附件_${index + 1}`;

        return { name, url };
      });

      this.$emit("update:refresh", false);
    },
    handleBeforeUpload(file) {
      let temp = file.name.split(".");
      let type = temp[temp.length - 1].toLocaleLowerCase();
      let fileTypesOk = this.fileTypes.indexOf(type) > -1;
      let fileMaxSizeOk = file.size / 1024 / 1024 <= this.fileMaxSize;

      if (!fileTypesOk) {
        this.$message.error(
          `上传图片只能是${this.fileTypes.join("、")}这些格式！`
        );
      }

      if (!fileMaxSizeOk) {
        this.$message.error(`上传图片大小不能超过${this.fileMaxSize}M!`);
      }

      return fileTypesOk && fileMaxSizeOk;
    },
    handleExceed(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview({ name, url }) {
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件

      a.download = name; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    },
    handleRemove(file, fileList) {
      this.updateFileList(fileList);
    },
    handleSuccess(response, file, fileList) {
      this.updateFileList(fileList);
    },
    updateFileList(fileList) {
      this.fileList = fileList.map((v) => {
        return {
          name: v.name,
          url: v.url || v.response.data,
        };
      });

      this.$emit("change", this.fileList.map(({ url }) => url).join(","));
    },
  },
  mounted() {
    this.initFileList();
  },
};
</script>
