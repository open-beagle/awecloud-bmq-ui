<template>
    <div class="source_table">
        <edit-table @change="changeRow" :header="headerData" :tableData="tableData"></edit-table>
    </div>
</template>

<script>
import editTable from './edit-table.vue'
export default {
    props: {
      afterData:{
        type:Array,
        default:()=>[]
      }
    },
    components: {
        editTable
    },
    data() {
        return {
            headerData:[],
            priceType:[],
            priceTypeArr:[3,4]
        };
    },
    watch: {
      
    },
    computed: {
      tableData(){
        if(this.afterData.length==0){
          let temp = []
          if(this.priceTypeArr.includes(3)){//1预付费时长2预付费次数3后付费次数4后付费时长5一次性
            temp.push(
              {
                id:0,
                money:'',
                spcs_type:1,
                isSave:false,
                descript:'先用后付，用多少付多少',
              }
            )
          }
          if(this.priceTypeArr.includes(4)){
            temp.push(
              {
                id:0,
                money:'',
                spcs_type:2,
                isSave:false,
                descript:'先用后付，用多少付多少',
              }
            )
          }
          
          return temp
        }else{
          let temp = JSON.parse(JSON.stringify(this.afterData))
          let deleteTemp = []
          if(temp.length!==2){
            if(temp[temp.length-1].spcs_type==1&&this.priceTypeArr.includes(4)){
              temp.push(
                {
                  id:0,
                  money:'',
                  spcs_type:2,
                  isSave:false,
                  descript:'先用后付，用多少付多少',
                }
              )
            }else if(temp[temp.length-1].spcs_type==2&&this.priceTypeArr.includes(3)){
              temp.push(
                {
                  id:0,
                  money:'',
                  spcs_type:1,
                  isSave:false,
                  descript:'先用后付，用多少付多少',
                }
              )
            }
          }

          temp.forEach((e,index) => {
            if(e.spcs_type==1&&this.priceTypeArr.includes(3)){
              deleteTemp.push(e)
            }
            if(e.spcs_type==2&&this.priceTypeArr.includes(4)){
              deleteTemp.push(e)
            }
          });
          return deleteTemp
        }
      },
      disableTimes(){
        return !this.priceTypeArr.includes(3)
      },
      disableTime(){
        return !this.priceTypeArr.includes(4)
      },
    },
    created() {
      this.headerData=[
        {
          name:'计费方式',
          value:[
            // {
            //   type:'text',
            //   value:'后付费-计次'
            // }
            {
              type:'select',
              arr:[
                {
                  label:'后付费-计次',
                  value:1,
                  disabled:this.disableTimes
                },
                {
                  label:'后付费-计时',
                  value:2,
                  disabled:this.disableTime
                },
              ],
              disabled:true,
              placeholder:'选择计费方式',
              value:'spcs_type',
              check:this.checkType,
            }
          ]
        },
        {
          name:'单价',
          width:'280px',
          value:[
            {
              type:'input',
              value:'money',
              disabled:false,
              check:this.checkValue,
              show:this.timeTextShow,
              placeholder:'输入单价',
            },
            {
              type:'text',
              value:'元/次',
              show:this.timeTextShow,
            },
            {
              type:'input',
              default:10,
              value:'money',
              disabled:false,
              width:'100px',
              show:this.timeInputShow,
              check:this.checkValue,
              placeholder:'输入单价',
            },
            {
              type:'text',
              value:'元/',
              show:this.timeInputShow,
            },
            {
              type:'select',
              width:'100px',
              show:this.timeInputShow,
              check:this.checkTimeType,
              arr:[
                {
                  label:'月',
                  value:1,
                },
                {
                  label:'年',
                  value:2,
                },
                {
                  label:'天',
                  value:3,
                },
              ],
              disabled:false,
              value:'duration_unit'
            },
          ]
        },
        {
          name:'规格说明',
          value:[
            {
              type:'value',
              value:'descript'
            }
          ]
        },
        {
          name:'操作',
          value:[
            {
              type:'button',
              value:'保存',
              show:this.saveShow,
              callback:this.save
            }
          ]
        }
      ]
    },
    mounted() {

    },
    methods: {
        saveShow(scope){
          if(scope.row.isSave){
            return false
          }else{
            return true
          }
        },
        timeInputShow(scope){
            if(this.tableData[scope.$index].spcs_type==2){
                return true
            }else{
                return false
            }
        },
        timeTextShow(scope){
            if(this.tableData[scope.$index].spcs_type==1){
                return true
            }else{
                return false
            }
        },
        checkTime(value){
            let reg = /^\+?[1-9]\d*$/
            if(value){
                if(reg.test(value)){
                    return true
                }else{
                    this.$message.error('请输入正确时长')
                    return false
                }
            }else{
                this.$message.error('请输入时长')
                return false
            }
        },
        checkTimeType(value){
            if(value){
                return true
            }else{
                this.$message.error('请选择时长类型')
                return false
            }
        },
        checkValue(value){
            let reg = /(?:^[1-9]([0-9]{0,7})?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
            if(value){
                if(reg.test(value)){
                    return true
                }else{
                    this.$message.error('请输入正确价格')
                    return false
                }
            }else{
                this.$message.error('请输入单价')
                return false
            }
        },
        checkType(value){
            if(value){
                return true
            }else{
                this.$message.error('请选择类型')
                return false
            }
        },
        save(scope){
          if(this.tableData[scope.$index].spcs_type==1){
            if(!this.checkValue(scope.row.money)){
                return
            }
          }else{
            if(!this.checkValue(scope.row.money)){
                return
            }
            if(!this.checkTimeType(scope.row.duration_unit)){
                return
            }
          }
          this.tableData[scope.$index].isSave = true
          this.$message.success('此数据校验成功')
        },
        changeRow(val){
            console.log(val);
            this.tableData[val.$index].isSave = false
            if(val.check){
                if(val.check(this.tableData[val.$index][val.type])){
                  this.tableData[val.$index].descript = '先用后付，用多少付多少'
                }else{
                  return false
                }
            }
            console.log(this.tableData[val.$index]);
        },
    },
};
</script>

<style scoped>

</style>
