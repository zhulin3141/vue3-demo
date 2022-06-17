<template>
  <div ref="provinceRankingBarChart" style="width: 100%; height: 350px"></div>
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, getCurrentInstance, onMounted, watch } from "vue";
import * as echarts from "echarts/core";
let chart: echarts.ECharts;

export default defineComponent({
  props: {
    data: {
      type: Object,
      default() {
        return {
          provinceList: [],
          valueList: [],
        };
      },
    },
  },
  setup(props:any) {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    const initChart = () => {
      if (null != chart) {
        chart.dispose();
      }
      chart = echarts.init(proxy?.$refs.provinceRankingBarChart as HTMLElement);
      setOptions();
    };

    const setOptions = () => {
      var salvProValue = props.data.valueList;
      var salvProMax = [];
      for (let i = 0; i < salvProValue.length; i++) {
        salvProMax.push(salvProValue[0]);
      }
      let option = {
        grid: {
          left: "2%",
          right: "2%",
          bottom: "2%",
          top: "2%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params: any) {
            return params[0].name + " : " + params[0].value;
          },
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              color: "#fff",
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: props.data.provinceList,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              color: "#ffffff",
              fontSize: "12",
            },
            data: salvProValue,
          },
        ],
        series: [
          {
            name: "值",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              borderRadius: 30,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "rgb(2,163,254,1)",
                },
                {
                  offset: 1,
                  color: "rgb(125,64,255,1)",
                },
              ]),
            },
            barWidth: 20,
            data: salvProValue,
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 20,
            barGap: "-100%",
            data: salvProMax,
            itemStyle: {
              color: "rgba(24,31,68,1)",
              borderRadius: 30,
            },
          },
        ],
      };
      chart?.setOption(option);
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