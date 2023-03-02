import * as echarts from 'echarts/core'
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components'
import { BarChart, LineChart, PieChart, GaugeChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { ShallowRef, shallowRef, Ref, onBeforeUnmount, watch, useAttrs, shallowReactive } from 'vue'

interface ChartHookOption {
  theme?: Ref<string>
  el: ShallowRef<HTMLElement>
  options: any
}

/**
 *  视口变化时echart图表自适应调整
 */
class ChartsResize {
  #charts = new Set<echarts.ECharts>() // 缓存已经创建的图表实例
  #timeId = null
  constructor() {
    window.addEventListener('resize', this.handleResize.bind(this)) // 视口变化时调整图表
  }

  getCharts() {
    return [...this.#charts]
  }

  handleResize() {
    clearTimeout(this.#timeId)
    this.#timeId = setTimeout(() => {
      this.#charts.forEach((chart) => {
        chart.resize()
      })
    }, 350)
  }

  add(chart: echarts.ECharts) {
    this.#charts.add(chart)
  }

  remove(chart: echarts.ECharts) {
    this.#charts.delete(chart)
  }

  removeListener() {
    window.removeEventListener('resize', this.handleResize)
  }
}

export const chartsResize = new ChartsResize()

export const useCharts = ({ el, theme, options }: ChartHookOption) => {
  echarts.use([
    BarChart,
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    ToolboxComponent,
    MarkAreaComponent,
    MarkLineComponent,
    MarkPointComponent
  ])

  const charts = shallowRef<echarts.ECharts>()

  const setOptions = (opt: echarts.EChartsCoreOption) => {
    charts.value.setOption(opt)
  }

  const initChart = () => {
    charts.value = echarts.init(el.value, theme)
    charts.value.setOption(options)
    chartsResize.add(charts.value) // 将图表实例添加到缓存中
    initEvent() // 添加事件支持
  }

  /**
   * 初始化事件
   */
  const attrs = useAttrs()

  const initEvent = () => {
    Object.keys(attrs).forEach((attrKey) => {
      if (/^on/.test(attrKey)) {
        const cb = attrs[attrKey]
        attrKey = attrKey.replace(/^on(Chart)?/, '')
        attrKey = `${attrKey[0]}${attrKey.substring(1)}`
        typeof cb === 'function' && charts.value?.on(attrKey, cb as () => void)
      }
    })
  }

  onBeforeUnmount(() => {
    chartsResize.remove(charts.value) // 移除缓存
  })

  return {
    charts,
    setOptions,
    initChart,
    initEvent
  }
}

export const chartsOptions = <T extends echarts.EChartsCoreOption>(option: T) => shallowReactive<T>(option)
