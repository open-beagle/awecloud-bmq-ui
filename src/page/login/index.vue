<template>
  <div class="login-bg">
    <div class="login-box">
      <p class="login-title">登录</p>
      <el-form :model="form" ref="form" class="login_forms">
        <el-form-item>
          <el-input v-model.trim="form.userid" autofocus="autofocus" placeholder="请输入账号" @keyup.enter="login_remember_info()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model.trim="form.password" placeholder="请输入密码" @keyup.enter="login_remember_info()">
            <!-- <span
                slot="suffix"
                :title="visible ? '显示密码' : '隐藏密码'"
                @click="changePass()"
                style="cursor: pointer"
                :class="visible ? 'eye_dis' : 'eye'"
              ></span> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="yzm" class="yzm">
          <div class="yzm_ctx">
            <el-input class="yzm_ipt" v-model.trim="form.yzm" placeholder="请输入验证码" :validate-event="false" @keyup.enter="login_remember_info()"></el-input>
            <img class="yzm_img" title="看不清？换一张" :src="imgSrc" @click="getImg()" />
          </div>
        </el-form-item>
        <div class="apaas_button">
          <el-button class="btn_sub" type="primary" @click.prevent="login_remember_info()">登 录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setCookie, clearCookie } from "../../services/cookie.js";
import menu from '../../router/function'
import {generateRoutes} from '../../router/index'
export default {
  props: {},
  components: {},
  data() {
    return {
      form: {
        userid: "",
        password: "",
        yzm: "",
      },
      imgSrc: "",
    };
  },
  watch: {},
  computed: {},
  created() {
    console.log(111);
    this.getImg();
  },
  mounted() {},
  methods: {
    getUser() {
      this.$axios.get(`/msg/system/getUserInfo`).then((res) => {
        if (res.data.code == 200) {
          this.$store.commit("setUserInfo", res.data.data);
          if (res.data.data.userType == 1) {
            //超管
            this.$store.commit("setMenu", menu.adminMenu);

            menu.menuToRouter(menu.adminMenu)

            this.$store.commit('setRoute',menu.adminMenu)
          }
          generateRoutes()
          this.$router.push("/");
        }
      });
    },
    login_remember_info() {
      if (!this.form.userid) {
        return this.$message.error("请输入账号");
      }
      if (!this.form.password) {
        return this.$message.error("请输入密码");
      }
      if (!this.form.yzm) {
        return this.$message.error("请输入验证码");
      }
      this.$axios
        .get(`/msg/system/checkCaptcha/${this.imgId}/${this.form.yzm}`)
        .then((res) => {
          if (res.data.code == 200) {
            this.login();
          } else {
            this.$message.error(res.data.desc);
          }
        });
    },
    login() {
      this.$axios
        .post(`/msg/system/login`, {
          userId: this.form.userid,
          userPassword: this.form.password,
        })
        .then((res) => {
          if (res.data.code == "200") {
            let data = res.data.data;
            console.log(data);
            setCookie("bgToken", data.name);

            this.getUser();
          } else {
            this.$message.error(res.data.desc);
          }
        });
    },
    getImg() {
      this.$axios.get(`/msg/system/getCaptcha`).then((res) => {
        if (res.data.code == 200) {
          this.imgId = res.data.data.key;
          this.imgSrc = res.data.data.image;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-bg {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/imgs/bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
.login-box {
  width: 480px;
  height: 401px;
  background-color: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 20, 53, 0.3);
  border-radius: 6px;
  padding: 40px;
}
.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #202531;
  text-align: center;
  margin-bottom: 40px;
}
.yzm_ipt {
  width: 240px;
}
.yzm_img {
  vertical-align: middle;
}
.btn_sub {
  width: 400px;
  height: 40px;
  /* line-height: 20px; */
  background-color: #2b4695;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  padding: 0;
  color: #ffffff;
  margin-top: 20px;
}
</style>
