<template>
  <div ref="basicProportionChart" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    }
  }
})
let chart: echarts.ECharts
let basicProportionChart = ref()

const calculateProportion = (value: number, total: number) => {
  if (total == 0) {
    return 0
  } else {
    return ((value / total) * 100).toFixed(0)
  }
}

const initChart = () => {
  chart = echarts.init(basicProportionChart.value as HTMLElement)
  setOptions()
}

const setOptions = () => {
  let list = [
    {
      name: '现有确诊',
      value: calculateProportion(props.data.currentConfirmedCount, props.data.confirmedCount)
    },
    {
      name: '境外输入',
      value: calculateProportion(props.data.importedCount, props.data.confirmedCount)
    },
    {
      name: '累计治愈',
      value: calculateProportion(props.data.curedCount, props.data.confirmedCount)
    }
  ]

  let titleList: any[] = [],
    seriesList: any[] = []
  list.forEach((item, index) => {
    titleList.push({
      text: item.name,
      top: '75%',
      left: index * 30 + 12 + '%',
      textStyle: {
        fontWeight: 'normal',
        color: '#BCBCBF',
        fontSize: '12'
      }
    })
    //
    seriesList.push({
      name: item.name,
      type: 'pie',
      clockwise: true,
      radius: ['50%', '66%'],
      itemStyle: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      },
      emphasis: {
        scale: false
      },
      center: [index * 30 + 20 + '%', '35%'],
      data: [
        {
          value: item.value,
          name: item.name,
          label: {
            formatter: function (params: any) {
              return params.value + '%'
            },
            position: 'center',
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: '#FFF'
          },
          itemStyle: {
            color: {
              // 完成的圆环的颜色
              colorStops: [
                {
                  offset: 0,
                  color: '#D32E58' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F99266' // 100% 处的颜色
                }
              ]
            },
            label: {},
            labelLine: {
              show: false
            }
          }
        },
        {
          name: '',
          value: 100 - Number(item.value),
          label: {
            show: false
          }
        }
      ]
    })
  })
  let option = {
    title: titleList,
    color: ['rgba(7, 158, 254, .9)'],
    series: seriesList
  }

  chart.setOption(option)
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

onMounted(() => {
  initChart()
})
</script>

<style scoped></style>
