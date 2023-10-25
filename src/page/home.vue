<template>
    <div>
        <span @click="getTableData1">login</span> 
        <span @click="getSelect">select</span>

        <bg-table ref="bgTable" :headers="headers" :rows="tableRows" :select="true" height="100%"></bg-table>
    </div>
</template>

<script>
import { reactive, toRefs,onBeforeMount,onMounted,ref } from 'vue'
export default {
    setup(){
        const bgTable = ref(null)
        const state = reactive({
            bgTable,
            headers:[
                {
                    label: "类型",
                    prop: "certificateTypeDesc",
                },
                {
                    label: "业务ID",
                    prop: "businessId",
                },
                {
                    label: "申请主体",
                    prop: "businessId1",
                }
            ],
            dataTable:[
                {
                    certificateTypeDesc:111,
                    businessId:111,
                    businessId1:111,
                    id:1,
                },
                {
                    certificateTypeDesc:111,
                    businessId:111,
                    businessId1:111,
                    id:2,
                },
                {
                    certificateTypeDesc:111,
                    businessId:111,
                    businessId1:111,
                    id:3,
                },
                {
                    certificateTypeDesc:111,
                    businessId:111,
                    businessId1:111,
                    id:4,
                },
                {
                    certificateTypeDesc:111,
                    businessId:111,
                    businessId1:111,
                    id:5,
                },
                {
                    certificateTypeDesc:222,
                    businessId:22,
                    businessId1:222,
                    id:6,
                },
                {
                    certificateTypeDesc:2222,
                    businessId:2222,
                    businessId1:2222,
                    id:7,
                },
                {
                    certificateTypeDesc:2222,
                    businessId:2222,
                    businessId1:2222,
                    id:8,
                },
                {
                    certificateTypeDesc:2222,
                    businessId:2222,
                    businessId1:2222,
                    id:9,
                },
                {
                    certificateTypeDesc:2222,
                    businessId:2222,
                    businessId1:2222,
                    id:10,
                },
            ],
            tableRows:[],
            nowPage:1

        })

        onBeforeMount(() => {
            getTableData()
        })

        onMounted(() => {
            console.log(state.bgTable);
        })

        const getTableData=()=>{
            state.tableRows=[]
            state.dataTable.forEach((e,idx) => {
                if(idx>=(state.nowPage-1)*5&&idx<state.nowPage*5){
                    state.tableRows.push(e)
                }
            });
        }

        const getTableData1=()=>{
            console.log(1111);
            if(state.nowPage==1){
                state.nowPage = 2
            }else{
                state.nowPage = 1
            }
            getTableData()
        }

        const getSelect=()=>{
            let select = state.bgTable.dealSelectData()
            console.log(select);
        }

        return {
          ...toRefs(state),
          getTableData,
          getTableData1,
          getSelect,
        }
    }
    
};
</script>

<style scoped>

</style>
