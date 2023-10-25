<template>
    <div class="charts-box" id="line-charts-02121"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted,watch} from 'vue'
const props = defineProps({
    xarr: {
      type: Array,
      default:()=>[]
    },
    yarr1:{
        type: Array,
        default:()=>[]
    },
    yarr2:{
        type: Array,
        default:()=>[]
    },
})

watch(
  props,
  () => {
    initLineCharts()
  }
)
onMounted(()=>{
    initLineCharts()
})

let initLineCharts = ()=>{
    let myChart = echarts.init(document.getElementById("line-charts-02121"));
    let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['数据交易额', '数据交易量'],
                itemWidth:18,
                itemHeight:8,
                textStyle:{
                    color:'#fff'
                }
            },
            color:['#ebf18f','#0ea8fc'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLine:{
                    show:false
                },
                axisLabel:{
                    color:'#fff'
                },
                axisTick:{
                    show:false
                },
                data: props.xarr
            },
            yAxis: [
                {
                    name: '万元',
                    type: 'value',
                    splitLine:{
                            lineStyle:{
                            type:'dashed',
                            color:'rgba(255,255,255,0.2)'
                        }
                    },
                    axisLabel:{
                        color:'#fff'
                    },
                    nameTextStyle:{
                        color:'#fff',
                        align:'right'
                    }
                },
                {
                    name: '笔',
                    alignTicks: true,
                    type: 'value',
                    splitLine:{
                            lineStyle:{
                            type:'dashed',
                            color:'rgba(255,255,255,0.2)'
                        }
                    },
                    axisLabel:{
                        color:'#fff'
                    },
                    nameTextStyle:{
                        color:'#fff',
                        align:'left'
                    }
                }
            ],
            series: [
                {
                    name: '数据交易额',
                    type: 'line',
                    data: props.yarr1
                },
                {
                    name: '数据交易量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: props.yarr2
                }
            ]
        };
      // 绘制图表
      myChart.setOption(option);
      window.onresize = function () {//自适应大小
        myChart.resize();
      };
}
</script>
<script>
export default {
    
}
</script>

<style scoped>
.charts-box{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>