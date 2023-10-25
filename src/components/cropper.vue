<template>
  <div class="img_crop">
    <div v-for="(item, index) in fileArr" :key="'img' + index" class="list_img">
      <div class="list_img_back">
        <i class="el-icon-refresh-right img_replace"></i>
        <input
          type="file"
          id="upItem1"
          class="up_input"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event,1)"
        />
      </div>
      <el-image class="list_img_item" :src="item.url" :fit="fit">
      <template v-slot:error>
        <div class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </template>
      </el-image>
    </div>
    <div class="add_img" v-if="fileArr.length <= max - 1">
      <div class="add_pic">
        <i class="el-icon-plus add_icon"></i>
        <input
          type="file"
          id="upItem2"
          class="up_input"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event,1)"
        />
      </div>
    </div>
    <!-- 弹出层-裁剪 -->
    <el-dialog
      title="编辑图片"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="cropper_dia"
    >
      <div style="width: 100%">
        <div class="cropper_container">
          <!-- 裁剪 -->
          <div class="croppers">
            <vueCropper
              style="width:100%;height:300px"
              ref="cropper"
              :img="attach.customaryUrl"
              :autoCrop="options.autoCrop"
              :fixedBox="options.fixedBox"
              :canMoveBox="options.canMoveBox"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :centerBox="options.centerBox"
              :mode="options.mode"
              @realTime="realTime"
            ></vueCropper>
          </div>
          <!-- 实时裁剪结果 -->
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
        <el-row class="footerBtn" align="center">
          <el-button type="primary" class="form_c" size="small" @click="handleClose">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" class="form_t" size="small" @click="cut('blob')">确&nbsp;&nbsp;认</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  components: {
    VueCropper,
  },
  props: {
    fileArray: {
      type: Array,
      default: () => {
        [];
      },
    },
    fit: {
      type: String,
      default: "",
    },
    max: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    fileArray: {
      handler(val) {
        this.fileArr = val;
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      options: {
        autoCrop: true, //默认生成截图框
        fixedBox: true, //固定截图框大小
        canMoveBox: true, //截图框不能拖动
        autoCropWidth: 200, //截图框宽度
        autoCropHeight: 200, //截图框高度
        centerBox: true, //截图框被限制在图片里面
        mode: "cover",
      },
      previews: {}, //实时预览图数据
      attach: {
        id: "",
        userId: "",
        customaryUrl: "", //原图片路径
        laterUrl: "", //裁剪后图片路径
        attachType: "photo", //附件类型
      },
      fileName: "", //本机文件地址
      uploadImgRelaPath: "", //上传后图片地址
      fileArr: [],
    };
  },
  methods: {
    //控制弹出层关闭
    handleClose() {
      let abc1 = document.getElementById("upItem1");
      let abc2 = document.getElementById("upItem2");
      if (abc1) {
        abc1.value = "";
      }
      if (abc2) {
        abc2.value = "";
      }
      this.dialogVisible = false;
    },
    //实时预览
    realTime(data) {
      this.previews = data;
    },
    //加载图片信息
    find() {
      this.userId = sessionStorage.getItem("userId");
    },
    //选择本地图片
    uploadImg(e, num) {
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      // console.log(e.target);
      //fileReader 接口，用于异步读取文件数据
      var reader = new FileReader();
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = (e) => {
        // data = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式

        let data = e.target.result;

        this.attach.customaryUrl = data;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
      this.dialogVisible = true;
    },
    //确认截图,上传
    cut(type) {
      var formData = new FormData();
      this.$refs.cropper.getCropBlob((res) => {
        //res是裁剪后图片的bolb对象
        formData.append("file", res, this.userId);
        formData.append("directory", "image");
        let url = "/apaas/static/image/upload";
        this.$http
          .post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            this.fileArr = [{ name: res.data.data, url: res.data.data }];
            // 上传图片后服务器返回访问路径
            this.$emit("getNewUrl", res.data.data);
            this.handleClose();
          });
      });
    },
  },
};
</script>

<style scoped>
.add_img {
  display: inline-block;
  margin-left: 10px;
}
.add_pic {
  width: 140px;
  height: 140px;
  border: 3px #f6f7fb solid;
  border-radius: 5px;
  position: relative;
}
.add_icon {
  position: absolute;
  top: calc((100% - 70px) / 2);
  left: calc((100% - 70px) / 2);
  color: #e3e6f0;
  font-size: 70px;
}
.up_input {
  display: inline-block;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.cropper_container {
  width: 100%;
}
.croppers {
  display: inline-block;
  width: 400px;
}
.preview {
  display: inline-block;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
  margin-left: 20px;
}
.footerBtn {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.list_img {
  width: 140px;
  height: 140px;
  border-radius: 5px;
  overflow: hidden;
  margin-left: 10px;
  position: relative;
  cursor: pointer;
}
.list_img_back {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 1;
  opacity: 0;
}
.list_img:hover .list_img_back {
  opacity: 0.5;
}
.list_img_item {
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
.img_replace {
  position: absolute;
  top: calc((100% - 34px) / 2);
  left: calc((100% - 34px) / 2);
  color: #fff;
  font-size: 34px;
}
.img_crop {
  display: flex;
  align-items: center;
}
</style>
<style>
.cropper_dia .el-dialog {
  width: 860px;
}
.list_img_item .image-slot {
  height: 100%;
  font-size: 40px;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
