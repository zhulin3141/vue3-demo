<script setup lang="ts">
import ProvinceRank from "./components/ProvinceRank.vue";
import BasicProportion from "./components/BasicProportion.vue";
import CurrentConfirmedCompare from "./components/CurrentConfirmedCompare.vue";

import apiService from "./api";
import { onMounted, ref } from "vue";

onMounted(() => {
  queryProvinceDataList();
  queryBasicData();
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

let defaultDataConfig: any = ref([]);

let rate: Object = ref({});

let confirmSingleBarChartData: any = ref({
  dateList: [],
  currentConfirmedCountList: [],
  confirmedCountList: [],
});

const queryProvinceDataList = () => {
  apiService.getProvinceDataList().then((res: any) => {
    // 设置累计排名数据
    setProvinceRankingData(res.data.data);
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
    basicData = res.data.data;
    setBasicData(res.data.data);
  });
};

const setBasicData = (data: any) => {
  // 重新生成，否则视图不更新
  // let config = initBasicConfig(data)
  // defaultDataConfig = config
  // 处理治愈率和死亡率
  rate = {
    curedRate: data.curedRate / 100,
    deadRate: data.deadRate / 100,
  };
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
        <div>累计排名（TOP 10）</div>
        <province-rank
          :data="top10ProvinceData"
          style="width: 100%; height: 380px"
        />
      </div>
      <div class="chart-card" style="margin: 15px 20px">
        <div>占比</div>
        <basic-proportion
          :data="basicData"
          style="width: 100%; height: 120px"
        />
      </div>
      <div class="chart-card">
        <div>最近一周累计治愈</div>
        <current-confirmed-compare
          :data="confirmSingleBarChartData"
          style="width: 100%; height: 310px"
        />
      </div>
    </div>
    <div id="r-wrapper">
      <div id="info-wrapper">
        <div class="chart-card more">现有确诊 <i></i><span>0</span></div>
        <div class="chart-card less">累计确诊 <i></i><span>0</span></div>
        <div class="chart-card">境外输入 <i></i><span>0</span></div>
        <div class="chart-card">无症状感染者 <i></i><span>0</span></div>
        <div class="chart-card">累计治愈 <i></i><span>0</span></div>
        <div class="chart-card">累计死亡 <i></i><span>0</span></div>
      </div>

      <div id="m-wrapper">
        <div id="map-wrapper"></div>
        <div></div>
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
}
#tip-info {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
#info-wrapper {
  & i {
    width: 0;
    height: 0;
    border-color: transparent transparent transparent;
    border-style: solid;
    border-width: 5px;
    position: relative;
    top: 11px;
  }

  & .more span {
    color: @more-color;
  }
  & .less span {
    color: @less-color;
  }
  & .big i {
    border-color: transparent transparent @more-color;
    top: -13px;
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
      padding: 5px 20px;
      float: left;
    }
  }
}
</style>
