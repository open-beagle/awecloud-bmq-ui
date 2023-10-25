<template>
    <div class="detail_box">
      <div class="detail_text text_clip" :style="index==data.length-1?last_width:unit_width" v-for="(item,index) in data" :key="'data'+index">
        <span>{{item.title}}</span>
        <!-- 拓展功能 -->
        <template v-if="item.slot">
            <span>
                <slot v-bind:item="item" :name="item.slot"></slot>
            </span>
        </template>
        <!-- 原有下载功能 -->
        <template v-else>
            <span v-if="!item.urls" :title="item.info" @click="down_file(item.url)" :style="item.url?{color:'#515fe7',cursor:'pointer'}:''">{{item.info}}</span>
            <span v-else :title="item.info">
                <span v-for="(it,idx) in item.urls" @click="down_file(it)" style="color:#515fe7;cursor:pointer;" :key="'urls'+idx">{{helper.downloadFileFormatNew(it)}}、</span>
            </span>
        </template>
      </div>
      <div class="bg" :style="{top:(2*index+1)*42+'px'}" v-for="(item,index) in bg_num" :key="'bg'+index"></div>
    </div>
</template>

<script>
import helper from './utils/index.js'
console.log(helper);
export default {
    props: {
        data:{
            type: Array,
            default: () => [],
        },
        layout:{
            line_num:4
        }
    },
    components: {

    },
    data() {
        return {
            helper,
            unit_width:0,
            last_width:0,
            bg_num:0,
        };
    },
    watch: {
        data:{
            handler: function(n, o) {
                if(this.layout.line_num){
                    this.unit_width = {width:100/this.layout.line_num +'%'}
                }
                if(this.layout.line_num&&n.length%this.layout.line_num!==0){//计算最后一个格子的宽度
                    this.last_width = {width:(this.layout.line_num-(n.length%this.layout.line_num)+1)/this.layout.line_num*100+'%'}
                }else{
                    this.last_width = {width:100/this.layout.line_num +'%'}
                }
                if(n.length<this.layout.line_num){
                    return
                }else{
                    this.bg_num = Math.floor((Math.ceil(n.length/this.layout.line_num))/2)
                }
            },
            immediate: true
        }
        
    },
    computed: {
       
    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        down_file(url){
            if(url){
                console.log(url);
                const a = document.createElement("a"); // 创建a标签
                a.setAttribute("download", ""); // download属性
                a.setAttribute("href", url); // href链接
                a.click(); // 自执行点击事件
            }
        }
    },
};
</script>

<style scoped>
.detail_box{
  width: 100%;
  border-bottom: 1px solid #e3e5ef;
  border-right: 1px solid #e3e5ef;
  overflow: hidden;
  position: relative;
}
.detail_box .detail_text{
  width: 25%;
  height: 42px;
  line-height: 42px;
  padding: 0 15px;
  border-left: 1px solid #e3e5ef;
  border-top: 1px solid #e3e5ef;
  float: left;
  position: relative;
  z-index: 1;
}
.detail_box .detail_text span:nth-of-type(1){
  color: #616f94;
}
.detail_box .detail_text span:nth-of-type(2){
  color: #404a62;
}
.bg{
    background-color:#f7f8f9;
    width: 100%;
    height: 42px;
    position: absolute;
}
</style>
