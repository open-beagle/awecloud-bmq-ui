import { reactive, toRefs,useAttrs } from 'vue'
export function selectTableMixin(){
  const state = reactive({
    nowSelectData:[],
    allSelectData:{}
  })

  const attrs = useAttrs()
// const nowSelectData = reactive([])
// const allSelectData = reactive({})

const selectData = (val)=>{
  console.log(val);
  state.nowSelectData = val
  console.log('allSelectData');
  console.log(state.allSelectData);
  console.log(Object.keys(state.allSelectData).length);
}

const initSelectTableData = (data)=>{
  return new Promise((reslove,reject)=>{
    data.forEach(e => {
      if(state.allSelectData[e[attrs.rowKey||'id']]){
        delete state.allSelectData[e[attrs.rowKey||'id']]
        state.nowSelectData.push(e)
      }
    });
    
    console.log(state.nowSelectData);
    reslove(state.nowSelectData)
  })
}

const runPage=()=>{//翻页数据推进
  state.nowSelectData.forEach(e => {
    state.allSelectData[e[attrs.rowKey||'id']] = e
  });
  state.nowSelectData = []
}

const clearTable=()=>{//清除选中数据,在页面状态更新时使用
  state.allSelectData={}
  state.nowSelectData=[]
  clearSelection();
}

const dealSelectData=()=>{//最后提交处理数据
  state.nowSelectData.forEach(e => {
    state.allSelectData[e[attrs.rowKey||'id']] = e
  });
  return state.allSelectData
}

const { nowSelectData, allSelectData } = toRefs(state)

return{
  nowSelectData,
  allSelectData,
  selectData,
  initSelectTableData,
  runPage,
  clearTable,
  dealSelectData
}

}

// export const selectTableMixin = {

//     data(){
//         return{
//             nowSelectData:[],//声明现在选中数组
//             allSelectData:{},//全部选中数据obj
//         }
//     },
//     methods: {
//         selectData(val){//选中赋值
//             console.log(val);
//             this.nowSelectData = val
//             console.log('allSelectData');
//             console.log(this.allSelectData);
//             console.log(Object.keys(this.allSelectData).length);
//         },
//         initSelectTableData(data){//初始化选中table数据
//             data.forEach(e => {
//                 if(this.allSelectData[e.id]){
//                   delete this.allSelectData[e.id]
//                   this.nowSelectData.push(e)
//                 }
//               });
              
//               console.log(this.nowSelectData);
//               if(this.nowSelectData.length){
//                 setTimeout(()=>{
//                   this.toggleRowArrSelection(this.nowSelectData)
//                 })
//               }
//         },
//         runPage(){//翻页数据推进
//             this.nowSelectData.forEach(e => {
//               this.allSelectData[e.id] = e
//             });
//             this.nowSelectData = []
//         },
//         clearTable(){//清除选中数据,在页面状态更新时使用
//           this.allSelectData={}
//           this.nowSelectData=[]
//           this.clearSelection();
//         },
//         dealSelectData(){//最后提交处理数据
//             this.nowSelectData.forEach(e => {
//               this.allSelectData[e.id] = e
//             });

//             return this.allSelectData
//         }
//     },
// }