<template>
  <div ref="provinceRankingBarChart" style="width: 100%; height: 350px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'

let chart: echarts.ECharts

const provinceRankingBarChart = ref()
const props = defineProps({
  data: {
    type: Object,
    default() {
      return {
        provinceList: [],
        valueList: []
      }
    }
  },
  theme: String
})

const initChart = () => {
  chart = echarts.init(provinceRankingBarChart.value as HTMLElement)
  setOptions()
}

const themeStyle = {
  dark: {
    firstLineColor: 'rgb(2,163,254)',
    secondLineColor: 'rgb(125,64,255)',
    bgColor: 'rgba(24,31,68,1)',
  },
  light: {
    firstLineColor: '#6a6efd',
    secondLineColor: '#a4a6ff',
    bgColor: '#292fff',
  }
}

const setOptions = () => {
  var salvProValue = props.data.valueList
  var salvProMax = []
  for (let i = 0; i < salvProValue.length; i++) {
    salvProMax.push(salvProValue[0])
  }
  let option = {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '2%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params: any) {
        return params[0].name + ' : ' + params[0].value
      }
    },
    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: props.data.provinceList
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          color: '#ffffff',
          fontSize: '12'
        },
        data: salvProValue
      }
    ],
    series: [
      {
        name: '值',
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          borderRadius: 12,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: themeStyle[props.theme].firstLineColor
            },
            {
              offset: 1,
              color: themeStyle[props.theme].secondLineColor
            }
          ])
        },
        barWidth: 20,
        data: salvProValue
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: 20,
        barGap: '-100%',
        data: salvProMax,
        itemStyle: {
          color: themeStyle[props.theme].bgColor,
          borderRadius: 12
        }
      }
    ]
  }

  chart?.setOption(option)
}

watch(
  () => props.data,
  (newList, oldList) => {
    if (oldList != newList) {
      setOptions()
    }
  },
  { deep: true }
)

watch(
  () => props.theme,
  (newVal, oldVal) => {
    oldVal != newVal && setOptions()
  }
)

onMounted(() => {
  initChart()
})
</script>

<style scoped></style>
