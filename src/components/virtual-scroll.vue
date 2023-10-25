<template>
    <div class="virtual-box">
      <div class="virtual-content" @scroll="load_data($event)">
        <div class="virtual-long-content" :style="{height:data.length*minHeight+'px'}">
          <div class="virtual-min-box" :ref="'virtual'+index" :style="{top:get_top(index),height:minHeight+'px'}" :data-set="index" v-for="(item,index) in now_arr" :key="index">
              <slot :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    props: {
        minHeight:{
            type:Number,
            default:50
        },
        data:{
            type:Array,
            default:()=>[]
        }
    },
    components: {

    },
    data() {
        return {
            now_arr:[],
            now_data:0,
        };
    },
    watch: {

    },
    computed: {

    },
    created() {
        for(let i=0;i<=20;i++){
            this.now_arr.push(this.data[i])
        }
    },
    mounted() {

    },
    methods: {
        load_data(e){
            console.log(e.target.scrollTop);//滚动距离
            this.now_arr = []
            this.now_data = Math.ceil(e.target.scrollTop/this.minHeight)//滚动的数据数量
            console.log(this.now_data);
            let start = 0 //起始数据index
            let end = this.now_data+20 //终止数据index
            if(this.now_data-10>0){
                start = this.now_data-10
            }
            if(end>=this.data.length){
                end = this.data.length
            }
            for(let i=start;i<end;i++){
                this.now_arr.push(this.data[i])
            }
        },
        get_top(index){
            let start = 0
            if(this.now_data-10>0){
                start = this.now_data-10
            }
            return this.minHeight*(index+start)+'px'
        }
    },
};
</script>

<style scoped>
.virtual-content{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
}
.virtual-long-content{
    width: 100%;
    position: relative;
}
.virtual-min-box{
    width: 100%;
    /* height: 50px; */
    position: absolute;
    left: 0;
    /* line-height: 50px; */
    color: #000;
    text-align: center;
}
</style>
