<template>
    <div class="charts-box" id="pie-charts-02121"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted,watch} from 'vue'
import img from './pie-base64.js'
const props = defineProps({
    data:{
        type:Object,
        default:()=>{}
    },
    imgStyle:{
        type:Object,
        default:()=>{}
    },
    color1:{
        type:Array,
        default:()=>null
    },
    color2:{
        type:Array,
        default:()=>null
    },
})

watch(
  props,
  () => {
    initPieCharts()
  }
)
onMounted(()=>{
    initPieCharts()
})

let get_color = (length,arr)=>{
        var temp = []
        for (let index = 0; index < length; index++) {
            temp.push(arr[index]) 
        }
        return temp
    }
let empty_name = (data)=>{
        var temp = []
        data.forEach(e => {
            temp.push({
                value:e.value,
                name:''
            })
        });
        return temp
    }

let initPieCharts = ()=>{
    let myChart = echarts.init(document.getElementById("pie-charts-02121"));
    let imgSrc1 = img
        
    let color1 = props.color1||[
            "rgba(2, 255, 222, 1)",
            "rgba(43, 196, 255, 1)",
            "rgba(247, 253, 149, 1)",
        ]
    let color2 = props.color2||[
        "rgba(2, 255, 222, 0.3)",
        "rgba(43, 196, 255, 0.3)",
        "rgba(247, 253, 149, 0.3)",
    ] 
    let option = {
        backgroundColor: "rgba(0,0,0,0)",
        graphic: {
          elements: [
            {
              type: "image",
              z: 6,
              style: {
                image: imgSrc1,
                width: props.imgStyle&&props.imgStyle.width?props.imgStyle.width:90,
                left: "22.5%",
                top:"38%",
              },
              left: "22.5%",
              top: props.imgStyle&&props.imgStyle.top?props.imgStyle.top:45,
            },
          ],
        },
        title: [
          {
            text: props.data.value,
            subtext: props.data.name,
            textAlign: "center",
            x: "34%",
            y: "30%",
            subtextStyle: {
              color: "#b2daff",
              fontSize: 16,
            },
            textStyle: {
              color: "#b2daff",
              fontSize: 40,
              fontWeight: "normal",
              fontFamily: "Digital-7Mono",
            },
          },
        ],
        legend: {
          right: 0,
          top:'center',
          textStyle: {
            color: "#b2daff",
            fontSize:16,
          },
          itemWidth: 8,
          itemHeight: 8,
          itemGap:20,
          icon:'circle',
          itemStyle:{
            borderWidth:0,
          },
          selectedMode:false,
          orient: 'vertical',
        },
        series: [
          {
            name: "",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            z:2,
            radius: ["58%", "70%"],
            center: ["35%", "50%"],
            color: get_color(props.data.data.length,color2),
            label: {
              normal: {
                position: "inner",
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            // itemStyle: {
            //   normal: {
            //     borderColor: "#172837",
            //     borderWidth: "2",
            //   },
            // },
            tooltip: {
              show: false,
            },
            data: empty_name(props.data.data),
          },
          {
            name: props.data.name,
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["70%", "75%"],
            center: ["35%", "50%"],
            color: get_color(props.data.data.length,color1),
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{d}%",
                textStyle: {
                  align: "center",
                  baseline: "middle",
                  fontSize: 14,
                  color: '#b2daff',
                  fontWeight: "100",
                },
              },
            },
            labelLine: {
              normal: {
                smooth: true,
                length: 10,
                lineStyle: {
                  width: 1.5,
                  color:'#b2daff'
                },
              },
            },
            // itemStyle: {
            //   normal: {
            //     borderColor: "#172837",
            //     borderWidth: "2",
            //   },
            // },
            data: props.data.data,
          },
        ],
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