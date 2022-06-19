import { createApp } from 'vue'
import App from './App.vue'
import './utils/mockServe'
import '@/plugins/echart.ts'

const app = createApp(App)
app.mount('#app')
