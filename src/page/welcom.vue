<template>
    <div style="width:100%;height:calc(100% - 10px);background-color:#fff;text-align:center;">
        <img src="../assets/imgs/welcom.png" alt="" style="margin-top:150px;">
        <p style="font-size:18px;">欢迎进入消息组件中心管理系统~</p>
    </div>
</template>

<script>
export default {
    created(){
        setTimeout(()=>{
            this.$router.push('/msg')
        },1000)
    }
}
</script>

<style scoped>

</style>