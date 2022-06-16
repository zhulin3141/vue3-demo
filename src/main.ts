import { createApp } from 'vue'
import App from './App.vue'
import * as echarts from 'echarts'
import "./utils/mockServe"

const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.mount('#app')