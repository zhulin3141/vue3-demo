<template>
  <div id="currentConfirmedComoareBarChart" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, watch } from "vue";
import * as echarts from "echarts";
let chart: any = null;

export default defineComponent({
  props: {
    title: String,
    data: {
      type: Object,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();

    const initChart = () => {
      if (null != chart) {
        chart.dispose();
      }
      chart = proxy.$echarts.init(
        document.getElementById("currentConfirmedComoareBarChart")
      );
      setOptions();
    };

    const setOptions = () => {
      let option = {
        title: {
          text: props.title,
          x: 'center',
          y: 0,
          textStyle: {
            color: '#B4B4B4',
            fontSize: 14,
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#7B7DDC'
            }
          }
        },
        legend: {
          data: ['累计治愈', '累计确诊'],
          textStyle: {
            color: '#B4B4B4'
          },
          top: '5%',
        },
        grid: {
          x: '12%',
          width: '82%',
          y: '12%',
        },
        xAxis: {
          data: props.data.dateList,
          axisLine: {
            lineStyle: {
              color: '#B4B4B4'
            }
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [{
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#B4B4B4',
            }
          },
          axisLabel: {
            formatter: '{value} ',
          }
        },
        {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#B4B4B4',
            }
          },
          axisLabel: {
            formatter: '{value} ',
          }
        }],
        series: [
          {
            name: '累计治愈',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#956FD4' },
                    { offset: 1, color: '#3EACE5' }
                  ]
                )
            },
            data: props.data.curedCountList
          },
          {
            name: '累计确诊',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(119,60,243,0.7)' },
                    { offset: 0.3, color: 'rgba(119,60,243,0.5)' },
                    { offset: 1, color: 'rgba(119,60,243,0)' }
                  ]
                )
            },
            z: -12,
            data: props.data.confirmedCountList
          },
        ]
      }

      chart.setOption(option);
    };

    watch(
      () => props.data,
      (newList, oldList) => {
        if (oldList != newList) {
          setOptions();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      initChart();
    });

    return {};
  },
});
</script>

<style scoped>
</style>