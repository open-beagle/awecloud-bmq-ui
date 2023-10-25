<template>
  <div id="app">
    <el-config-provider size="large">
      <bg-menu></bg-menu>
      <div class="container" v-if="!['/404','/login'].includes($route.path)">
        <bg-nav title="" :list="navList" v-if="show||navShow" class="con-nav" />
        <div class="bg-main view">
          <router-view />
        </div>
      </div>
      <div class="container" v-else-if="$route.path=='/login'">
        <div class="bg-main view">
          <login></login>
        </div>
      </div>
      <div class="container" v-else-if="$route.path=='/404'">
        <div class="bg-main view">
          <page404></page404>
        </div>
      </div>
    </el-config-provider>
  </div>
</template>

<script>
import bgMenu from '@/components/bg-menu.vue'
import login from '@/page/login/index.vue'
import page404 from '@/page/404.vue'
export default {
  components:{
    bgMenu, 
    login,
    page404,
  },
  computed:{
    msgBoxFlag(){
      return this.$store.state.msgBoxFlag
    },
    userInfo() {
      return this.$store.state.userInfo || {};
    },
    navList(){
      return this.$store.state.menu||[]
    },
    navShow(){
      return false||!['/','/404','/login'].includes(this.$route.path)
    }
  },
  watch:{
    msgBoxFlag(n,o){
      this.readFlag = !this.readFlag
    }
  },
  data(){
    return{
      readFlag:false,
      show:false,
    }
  },
  created(){

  }
}
</script>
<style>
#app{
  height: 100%;
}
.container{
  width: 100%;
  height: calc(100% - 56px);
  overflow: hidden;
}
.con-nav{
  float: left;
}
.view{
  height: 100%;
  overflow-y: auto;
}
</style>
