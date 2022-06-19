import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  VisualMapComponent,
  GeoComponent
} from 'echarts/components'
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts'

echarts.use([
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  VisualMapComponent,
  GeoComponent,
  LineChart,
  BarChart,
  PieChart,
  MapChart
])
