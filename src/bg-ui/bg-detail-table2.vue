<template>
    <div class="out-detail">
        <div class="row-box" v-for="(item,index) in list" :style="{width:item.width}" :key="'row-box'+index">
            <p class="detail-module" v-if="!item.slot">
                <span :style="{width:itemWidth}">{{item.label}}</span>
                <span class="text_clip" :title="item.value" v-if="!item.childSlot">{{item.value}}</span>
                <span v-else>
                    <slot :name="item.childSlot" :data="item"></slot>
                </span>
            </p>
            <template v-else>
                <slot :name="item.slot" :data="item"></slot>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list:{
            type:Array,
            default:()=>[]
        },
        itemWidth:{
            type:String,
            default:''
        }
    },
    components: {

    },
    data() {
        return {

        };
    },
    watch: {

    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
};
</script>

<style scoped>
.out-detail{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    border-right: solid 1px #dadee7;
    border-bottom: solid 1px #dadee7;
}
.row-box{
    width: 50%;
    flex-grow:1;
    text-align: left;
    line-height: 48px;
    min-height: 48px;
    border-left: solid 1px #dadee7;
    border-top: solid 1px #dadee7;
    font-size: 14px;
	color: #404a62;
}
.row-box .detail-module{
    height: 100%;
    display: flex;
}
.row-box .detail-module span{
    height: 100%;
    display: inline-block;
    padding-left: 15px;
    box-sizing: border-box;
}
.row-box .detail-module span:nth-of-type(1){
    background-color: #f7f7f9;
    min-width: 114px;
    border-right: solid 1px #dadee7;
}
.row-box .detail-module span:nth-of-type(2){
    flex-grow:1;
}
</style>
