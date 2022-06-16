<template>
  <div
    id="china-map"
    class="main-map-chart"
    style="width: 100%; height: 100%"
  />
</template>

<script lang="ts">
import { getCurrentInstance, onMounted, watch } from "vue";
import { EChartsOption } from "echarts/types/dist/shared";
import { EChartsType } from "echarts";
import "../assets/china.js";

let chart: EChartsType | null = null;

export default {
  props: {
    title: String,
    list: Array,
  },
  setup(props: any) {
    const { proxy } = getCurrentInstance();

    const initChart = () => {
      if (null != chart) {
        chart.dispose();
      }
      chart = proxy.$echarts.init(document.getElementById("china-map"));
      setOptions();
    };

    const setOptions = () => {
      let option: EChartsOption = {
        tooltip: {
          triggerOn: "click",
          formatter: (params: any, t: string, n: Function) => {
            return 0.5 == params.value
              ? params.name + "：有疑似病例"
              : params.seriesName + "<br />" + params.name + "：" + params.value;
          },
        },
        title: {
          text: props.title,
          top: 50,
          left: "center",
          textStyle: {
            fontWeight: "bolder",
            fontSize: 24,
            color: "#BCBCBF",
          },
        },
        visualMap: {
          min: 0,
          max: 1000,
          top: 10,
          left: 26,
          bottom: 40,
          showLabel: !0,
          textStyle: {
            color: "rgba(255,255,255,0.7)",
          },
          // 图例
          pieces: [
            {
              gt: 1500,
              label: "> 1500 人",
              color: "#5D0773",
            },
            {
              gte: 500,
              lte: 1500,
              label: "500 - 1500 人",
              color: "#26254F",
            },
            {
              gte: 200,
              lt: 500,
              label: "200 - 500 人",
              color: "#2D2D83",
            },
            {
              gt: 100,
              lt: 200,
              label: "100 - 200 人",
              color: "#2B4AD0",
            },
            {
              gt: 0,
              lt: 100,
              label: "< 100 人",
              color: "#394064",
            },
          ],
          show: !0,
        },
        geo: {
          map: "china",
          roam: true, // 开启缩放和平移
          scaleLimit: {
            min: 1, // 最小缩放
            max: 3, // 最大缩放
          },
          zoom: 1.23, // 当前视角的缩放比例
          top: 80,
          label: {
            show: !0,
            fontSize: "14",
            color: "rgba(255,255,255,0.7)",
          },
          itemStyle: {
            areaColor: "#323c48",
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)", // 外发光
            borderColor: "rgba(0, 0, 0, 0.2)",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#1E1D3C", // 悬浮区背景，就是鼠标移到区域上变的颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            name: "确诊病例",
            type: "map",
            geoIndex: 0,
            data: props.list,
          },
        ],
      };

      chart && chart.setOption(option);
    };

    watch(
      () => props.list,
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
  },
};
</script>