<template>
  <div
    class="bg-menu"
    :class="{
      transparent: transparentBg,
      'is-front': isFront,
    }"
  >


    <!-- LOGO -->
    <router-link to="/msg" class="bg-logo">
      <img style="width:40px;height:40px;" :src="logo"/>
      <span>{{name}}</span>
    </router-link>

    <!-- 用户中心 -->
    <div class="user-center nav-item" v-if="userInfo&& userInfo.user">
      <span class="user-icon">
        <img style="width:24px;height:24px;border-radius:50%;vertical-align:middle;" :src="userInfo&&userInfo.headPortrait?userInfo.headPortrait:'/src/assets/imgs/home_ic_user.png'" />
      </span>
      <span class="user-name" v-if="userInfo && userInfo.user">
        {{ userInfo.name || userInfo.user }}
      </span>
      <span class="user-name" v-else>
        请登录
      </span>
      <div class="menu-virtual"></div>
      <div v-if="userInfo && userInfo.user" class="menu-list">
        <div
          v-for="(item, index) in user_arr"
          class="menu-item"
          :key="index + 700"
          @click="menuAction(item.path)"
        >
          {{ item.name }}
        </div>
        <div class="menu-item" @click="menuAction('logout')">
          退出登录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { clearCookie } from "../services/cookie.js";
import {resetRouter} from '../router/index'

export default {
  name: "BgMenu",
  components: {  },
  data() {
    return {
      documentScrollTop: 0,
      user_arr: [],
      cartList: [],
      showCart: true,
      showShopMenu: false,
      logo:'',
      name:''
    };
  },
  computed: {
    nameFlag(){
      return this.$store.state.nameFlag
    },
    userInfo() {
      return this.$store.state.userInfo || {};
    },
    unreadMsgCount() {
      return this.$store.state.unreadMessageCount;
    },
    transparentBg() {
      return (
        this.documentScrollTop < 180 &&
        (this.$route.name === "shopRecommend" ||
          this.$route.name === "shopSearch")
      );
    },
    isFront() {
      let path = this.$route.path;
      return false
    },
    menu_arr() {
      return [];
    },
    
  },
  watch: {
    nameFlag(n,o){
      this.getLogo()
    }
    // cartState() {
    //   this.getCartList();
    // },
    // routePath(val) {
    //   return "/"; // FIXME: 当前选中的路由
    // },
  },
  methods: {
    ...mapMutations(["setCartNum"]),
    navAction(path) {
      this.$router.push(path);
    },
    changezz(item){
      this.$trace.setOptionValue('appID',item.value)
    },
    getLogo(){
      this.$axios.get(`/msg/system/getPicAndSystemName`).then(res=>{
        if(res.data.code==200){
          let data = res.data.data
          this.name=data.systemName
          this.logo = data.picture
          document.title = this.name

          var link = document.querySelector("link[rel*='icon']")||document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = data.picture;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      })
    },
    menuAction(n) {
      if (n == "logout") {
        // window.location.href = "/msg/system/logout";
        this.$axios.get(`/msg/system/logout`).then(res=>{
          if(res.data.code=='200'){
            this.$router.push('/login')
            this.$store.commit('setUserInfo',null)
            clearCookie('bgToken')
            this.$message.success('退出成功')
            resetRouter()
          }else{
            this.$message.error('退出失败')
          }
        })
      } else if (n == "login") {
        let path = this.$route.path;
        window.location.href = `/login?redirect=${path}`;
      } else {
        this.$router.push(n);
      }
    },
    childMenuAction(v) {
      if(v.children&&v.children.length){
        if(v.children[0].children){
          this.pathToUrl(v.children[0].children[0].path)
        }else{
          this.pathToUrl(v.children[0].path)
        }
      }else{
        this.pathToUrl(v.path)
      }
    },
    pathToUrl(path){
      if(path.includes('http')){
        window.open(path,'_blank')
      }else{
        this.$router.push(path);
      }
    },
    intoCartDetail() {
      this.$router.push({ name: "shopCart" });
    },
    deleteItem(id) {
      this.$api.serviceShop.delShoppingCart([id]).then((response) => {
        if (response.data.success == 1) {
          this.$store.commit("setCartState");
        }
      });
    },
    shopMenuAction() {
      this.showShopMenu = false;
    },
    shopMenEventListener() {
      this.showShopMenu = false;
    },
    scrollAction() {
      this.documentScrollTop = document.documentElement.scrollTop || 0;
    },
    getFirstPath(item){
      if(item.path){
        if(item.children){
          if(item.children[0].children){
            if(item.children[0].children[0].children){
              return item.children[0].children[0].children[0].path
            }else{
              return item.children[0].children[0].path
            }
          }else{
            return item.children[0].path
          }
        }else{
          return item.path
        }
      }else{
        return ''
      }
    },
    
  },
  created() {
    console.log(this.userInfo);
    this.getLogo()
    if (this.userInfo) {
      // this.getUserDetail(this.userInfo.user_id)
    }else {
      // this.getUserInfo()
    }
  },
  mounted() {
    console.log(this.currentMenuIndex);

    this.$nextTick(this.scrollAction);
    window.addEventListener("scroll", this.scrollAction, true);
    window.addEventListener("click", this.shopMenEventListener);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollAction, true);
    window.removeEventListener("click", this.shopMenEventListener);
  },
};
</script>

<style lang="scss" scoped>
.bg-menu {
  width: 100%;
  height: 56px;
  background-color: #253b7e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  // 二级菜单公有样式
  .nav-item {
    font-size: 14px;
    color: #fff;
    cursor: pointer;

    > p {
      > i {
        font-size: 12px;
        line-height: 58px;
        color: #8899aa;
        margin-left: 5px;
      }
    }

    > .menu-virtual{
      width: 128px;
      height: 10px;
      position: absolute;
      top: 49px;
      left: -10px;
      z-index: 9;
      background-color: rgba(0,0,0,0);
    }

    > .menu-list {
      box-shadow: 0px 3px 6px 0px rgba(15, 19, 65, 0.05);
      background-color: #202531;
      border-radius: 4px;
      overflow: hidden;
      padding: 4px 0;
      position: absolute;
      top: 59px;
      left: -10px;
      z-index: 9;
      text-align: center;
      display: none;

      > .menu-item {
        width: 128px;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        padding: 0 30px;
        background-color: #202531;
        color: #fff;
        text-align: center;
        white-space: nowrap;

        > .width-num {
          display: inline-block;
          vertical-align: middle;
          min-width: 30px;
          background-color: #ff6a00;
          font-size: 10px;
          line-height: 16px;
          color: #fff;
          padding: 0 8px;
          margin-left: 5px;
          box-sizing: border-box;
          border-radius: 8px;
          text-align: center;
          overflow: hidden;
        }

        &:hover {
          background-color: #30374a;
          color: #fff;

          /* > .width-num {
            background-color: #fcefd6;
            color: #ff6a00;
          } */
        }
      }
    }

    &:hover {
      > .menu-list {
        display: block;
      }
    }
  }

  // 超市菜单
  > .bg-shop-menu {
    height: 100%;

    > .shop-menu-btn {
      width: 105px;
      height: 100%;
      background-color: #062a44;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      > span {
        font-size: 16px;
        line-height: 20px;
        color: #ffffff;
        margin-left: 10px;
      }
    }

    > .shop-menu {
      position: fixed;
      top: 58px;
      left: 0;
      width: 900px;
      height: calc(100vh - 58px);
    }
  }

  // LOGO
  > .bg-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    margin: 0 50px 0 20px;
    text-decoration: none;

    > span {
      font-size: 24px;
      font-weight: bolder;
      margin-left: 10px;
      background: linear-gradient(to bottom, #d6e0fc,#9cb0e5);
      -webkit-background-clip:text;
      color:transparent;
      line-height: 40px;
    }
  }

  // 主菜单
  > .main-menu {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 50px;

    > .nav-item {
      font-size: 16px;
      height: 58px;
      text-align: center;
      position: relative;

      > .menu-list {
        > .menu-item {
          cursor: pointer;
        }
      }

      /* > p.current {
        color: #ff6a00;
      } */

      + .nav-item {
        margin-left: 55px;
      }
    }
  }

  // 分割线
  > .shop-line {
    width: 1px;
    height: 24px;
    background-color: #536883;
    margin-right: 50px;
  }

  // 购物车
  > .shop-cart {
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 50px;

    &:hover {
      .cart-detail {
        display: block;
      }
    }

    > .cart-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > span {
        min-width: 36px;
        height: 18px;
        background-color: #ff6a00;
        border-radius: 9px;
        padding: 0 9px;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 18px;
        color: #ffffff;
        text-align: center;
        margin-left: 5px;
      }
    }

    > .cart-detail {
      width: 280px;
      background-color: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(15, 19, 65, 0.05);
      border-radius: 8px;
      position: absolute;
      top: 56px;
      left: -20px;
      display: none;
      z-index: 3;
      padding: 10px 20px;

      > .cart-title {
        color: #8890a7;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
      }

      > .cart-list {
        height: 80px;
        padding: 10px 0;
        display: flex;
        line-height: 26px;
        border-bottom: #f4f7fc 2px solid;

        &:nth-last-child(2) {
          border-bottom: 0;
        }

        > .shop_img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
        }

        > .shop_cell_msgs {
          width: calc(100% - 80px);
          margin-left: 10px;

          > .shop_cell_name {
            color: #2d3867;
            font-size: 14px;
            line-height: 24px;

            &:hover {
              color: #0d0807;
            }
          }

          > .shop_cell_msg {
            color: #8890a7;
            font-size: 12px;
            line-height: 18px;
          }

          > .over_one {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      > .cart-action {
        width: 100%;
        height: 50px;
        text-align: right;
        padding: 15px 0;
        line-height: 30px;

        > .el-button {
          background-color: #ff6a00;
          color: #fcefd6;
        }
      }

      &::before {
        content: "";
        width: 16px;
        height: 16px;
        background-color: #fff;
        position: absolute;
        top: -7px;
        left: 38px;
        transform: rotate(45deg);
      }
    }
  }

  // 用户中心
  > .user-center {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 1;
    margin-right: 50px;
    position: relative;

    > .user-icon {
      position: relative;
      margin-right: 10px;

      > .has_msg {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ff6a00;
        position: absolute;
        top: -5px;
        right: -5px;
      }
    }

    > .user-name {
      min-width: 4em;
      max-width: 8em;
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
    }
  }

  &.transparent {
    background-color: transparent;

    > .bg-shop-menu {
      > .shop-menu-btn {
        background-color: transparent;
      }
    }

    &::after {
      background-color: #2f607f;
    }
  }

  &.is-front {
    height: 40px;

    .bg-logo {
      display: none;
    }

    .nav-item {
      height: 40px;
      line-height: 40px;

      > p {
        > i {
          line-height: 40px;
        }
      }

      > .menu-list {
        top: 35px;
      }

      &.user-center {
        line-height: 1;

        .user-icon {
          > .has_msg {
            top: 0;
          }
        }
      }
    }
  }
}
</style>
