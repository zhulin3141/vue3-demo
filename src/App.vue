<script setup lang="ts">
import ProvinceRank from "./components/ProvinceRank.vue";
import BasicProportion from "./components/BasicProportion.vue";
import CurrentConfirmedCompare from "./components/CurrentConfirmedCompare.vue";
import BasicDataItemLabel from "./components/BasicDataItemLabel.vue";
import BasicTrendChart from "./components/BasicTrendChart.vue";
import DataMap from "./components/DataMap.vue";

import apiService from "./api";
import { onMounted, ref } from "vue";

onMounted(() => {
  queryProvinceDataList();
  queryBasicData();
  queryTrendDataList();
});

let top10ProvinceData: any = ref({
  provinceList: [],
  valueList: [],
});

let basicData: any = ref({
  currentConfirmedCount: 0,
  currentConfirmedIncr: 0,
  confirmedCount: 0,
  confirmedIncr: 0,
  curedCount: 0,
  curedIncr: 0,
  deadCount: 0,
  deadIncr: 0,
  sure: 0,
  sureAdd: 0,
  importedCount: 0,
  importedIncr: 0,
  noInFectCount: 0,
  noInFectIncr: 0,
  suspectCount: 0,
  suspectIncr: 0,
  updateTime: "-",
});

let trendDataList = ref([]);

let rate: Object = ref({});

let confirmSingleBarChartData: any = ref({
  dateList: [],
  currentConfirmedCountList: [],
  confirmedCountList: [],
});

const initBasicConfig = (data: any = null) => {
  let currentConfirmedCount = data ? [data.currentConfirmedCount] : 0;
  let confirmedCount = data ? [data.confirmedCount] : 0;
  let importedCount = data ? [data.importedCount] : 0;
  let noInFectCount = data ? [data.noInFectCount] : 0;
  let deadCount = data ? [data.deadCount] : 0;
  let curedCount = data ? [data.curedCount] : 0;

  let formatter: any = {};

  const getNumberStyle = (
    color = "#E8EAF6",
    fontSize = 30,
    fontWeight = "bolder"
  ) => {
    return {
      fontSize: fontSize,
      fill: color,
      fontWeight: fontWeight,
    };
  };

  return {
    confirmedCount: {
      number: [confirmedCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle(),
    },
    currentConfirmedCount: {
      number: [currentConfirmedCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle("#2E8EEA"),
    },
    importedCount: {
      number: [importedCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle(),
    },
    noInFectCount: {
      number: [noInFectCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle(),
    },
    deadCount: {
      number: [deadCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle("#D32E58"),
    },
    curedCount: {
      number: [curedCount],
      content: "{nt}",
      formatter,
      style: getNumberStyle(),
    },
  };
};

let defaultDataConfig = ref(initBasicConfig());

let basicIncrTrendData = ref({
  dateList: [],
  importedIncrDataList: [],
  currentConfirmedIncrDataList: [],
});

let mapDataList = ref([]);

const queryProvinceDataList = () => {
  apiService.getProvinceDataList().then((res: any) => {
    // 设置累计排名数据
    setProvinceRankingData(res.data.data);
    setMapData(res.data.data);
  });
};

const setProvinceRankingData = (areaList: any) => {
  let provinceList = [];
  let dataValueList = [];
  for (let i = 0; i < 10; i++) {
    provinceList.push(areaList[i].provinceLabel);
    dataValueList.push(areaList[i].confirmedCount);
  }
  let data = {
    provinceList: provinceList,
    valueList: dataValueList,
  };
  top10ProvinceData.value = data;
};

const queryBasicData = () => {
  apiService.getOverall().then((res: any) => {
    basicData.value = res.data.data;
    setBasicData(res.data.data);
    defaultDataConfig.value = initBasicConfig(res.data.data);
  });
};

const setBasicData = (data: any) => {
  // 处理治愈率和死亡率
  rate = {
    curedRate: data.curedRate / 100,
    deadRate: data.deadRate / 100,
  };
};

const queryTrendDataList = () => {
  apiService.getDailyList().then((res: any) => {
    trendDataList.value = res.data.data;
    setBasicIncrTrendData(res.data.data);
  });
};

const setBasicIncrTrendData = (data: any) => {
  let dateList = [];
  let currentConfirmedIncrList = [];
  let importedIncrList = [];
  let sevenDayDateList = [];
  // 仅显示一周条数据
  let confirmedCountList = [];
  let curedCountList = [];
  // 仅获取7条数据
  let count = 7;
  let noInFectDataList = [];
  for (let i = data.currentConfirmedIncrList.length - 1; i >= 0; i--) {
    dateList.push(data.currentConfirmedIncrList[i][0]);
    currentConfirmedIncrList.push(data.currentConfirmedIncrList[i][1]);
  }
  for (let i = data.importedIncrList.length - 1; i >= 0; i--) {
    importedIncrList.push(data.importedIncrList[i][1]);
  }
  for (let i = data.noInFectCountList.length - 1; i >= 0; i--) {
    noInFectDataList.push(data.noInFectCountList[i][1]);
  }
  for (let i = count; i >= 0; i--) {
    if (confirmedCountList.length >= count) {
      break;
    }
    sevenDayDateList.push(data.confirmedCountList[i][0]);
    confirmedCountList.push(data.confirmedCountList[i][1]);
  }
  for (let i = count; i >= 0; i--) {
    if (curedCountList.length >= count) {
      break;
    }
    curedCountList.push(data.curedCountList[i][1]);
  }

  basicIncrTrendData.value = {
    dateList: dateList,
    importedIncrDataList: importedIncrList,
    currentConfirmedIncrDataList: currentConfirmedIncrList,
    noInFectDataList: noInFectDataList,
  };

  confirmSingleBarChartData.value = {
    dateList: sevenDayDateList,
    curedCountList: curedCountList,
    confirmedCountList: confirmedCountList,
  };
};

const setMapData = (dataList: any) => {
  let list = dataList.map((item: any) => {
    return {
      name: item.provinceLabel,
      value: item.confirmedCount,
    };
  });

  mapDataList.value = list;
};
</script>

<template>
  <div class="header">
    <h1>全国新冠肺炎疫情数据大屏</h1>
    <div id="tip-info">
      此数据为实时真实数据，数据来源：腾讯新闻<br />
      更新时间：2021-07-15 20:39:11
    </div>
  </div>

  <div class="middle">
    <div id="l-wrapper">
      <div class="chart-card">
        <div><h4>累计排名（TOP 10）</h4></div>
        <province-rank
          :data="top10ProvinceData"
          style="width: 100%; height: 380px"
        />
      </div>
      <div class="chart-card" style="margin: 15px 20px">
        <div><h4>占比</h4></div>
        <basic-proportion
          :data="basicData"
          style="width: 100%; height: 120px"
        />
      </div>
      <div class="chart-card">
        <div><h4>最近一周累计治愈</h4></div>
        <current-confirmed-compare
          :data="confirmSingleBarChartData"
          style="width: 100%; height: 310px"
        />
      </div>
    </div>
    <div id="r-wrapper">
      <div id="info-wrapper">
        <basic-data-item-label
          label="现有确诊"
          :config="defaultDataConfig.currentConfirmedCount"
          :inCrValue="basicData.currentConfirmedIncr"
        />
        <basic-data-item-label
          label="累计确诊"
          :config="defaultDataConfig.confirmedCount"
          :inCrValue="basicData.confirmedIncr"
        />
        <!-- 境外输入 -->
        <basic-data-item-label
          label="境外输入"
          :config="defaultDataConfig.importedCount"
          :inCrValue="basicData.importedIncr"
        />
        <!-- 无症状感染者 -->
        <basic-data-item-label
          label="无症状感染者"
          :config="defaultDataConfig.noInFectCount"
          :inCrValue="basicData.noInFectIncr"
        />
        <!-- 累计治愈 -->
        <basic-data-item-label
          label="累计治愈"
          :config="defaultDataConfig.curedCount"
          :inCrValue="basicData.curedIncr"
        />
        <!-- 死亡人数 -->
        <basic-data-item-label
          label="累计死亡"
          :config="defaultDataConfig.deadCount"
          :inCrValue="basicData.deadIncr"
        />
      </div>

      <div id="m-wrapper">
        <div id="map-wrapper">
          <data-map
            title=""
            :list="mapDataList"
          />
        </div>
        <div class="new-trader-wrapper chart-card">
          <div><h4>新增趋势</h4></div>
          <basic-trend-chart
            :data="basicIncrTrendData"
            style="width: 100%; height: 320px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@more-color: green;
@less-color: red;

body {
  background-color: #060612;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #bcbcbf;
}
.chart-card {
  background: #0f142b;
  border-radius: 10px;
  margin: 0 20px;
  padding: 7px 0;
  & .numbers {
    font-size: 25px;
    font-weight: bold;
    color: #494ef1;
    padding: 12px 0;
  }
  & h4 {
    margin: 5px 0 15px;
  }
}
#tip-info {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
#info-wrapper {
  display: flex;
  padding-right: 20px;
  .chart-card {
    margin: 0 0 0 12px;
  }
  & i {
    width: 0;
    height: 0;
    border-color: transparent transparent transparent;
    border-style: solid;
    border-width: 5px;
    position: relative;
    top: 13px;
  }
  & span{
    padding: 0 5px;
  }
  & .more span {
    color: @more-color;
  }
  & .less span {
    color: @less-color;
  }
  & .more i {
    border-color: transparent transparent @more-color;
    top: -11px;
  }
  & .less i {
    border-color: @less-color transparent transparent;
  }
}

.middle {
  display: flex;
  justify-content: space-between;

  #l-wrapper {
    width: 295px;
  }

  #r-wrapper {
    flex: 1;

    #info-wrapper .chart-card {
      padding: 10px 20px;
      float: left;
      flex: 1 1 auto;
    }

    #m-wrapper {
      display: flex;
      margin: 20px 0;
      #map-wrapper {
        flex: 1;
        position: relative;
      }
      .new-trader-wrapper {
        width: 250px;
        height: 362px;
      }
    }
  }
}
</style>
