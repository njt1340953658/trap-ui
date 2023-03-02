<template>
  <div class="v-charts" ref="chartRef" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core'
import { useCharts, chartsResize } from './useCharts'
import { PropType, toRefs, shallowRef, onMounted, watch } from 'vue'

const props = defineProps({
  theme: String,
  delay: [String, Boolean],
  isWatch: [String, Boolean, Object],
  options: {
    type: Object as PropType<echarts.EChartsCoreOption>,
    default: () => ({})
  },
})

const { theme, options } = toRefs(props)

const chartRef = shallowRef()

const { charts, setOptions, initChart } = useCharts({ theme, el: chartRef, options })

onMounted(async () => {
  await initChart()
  setOptions(options.value)
})

watch(
  options,
  () => {
    setOptions(options.value)
  },
  {
    deep: true
  }
)

watch(
  () => props.isWatch,
  () => {
    chartsResize.handleResize()
  },
  {
    deep: true,
    immediate:true
  }
)

defineExpose({
  chartRef: chartRef,
  $charts: charts
})
</script>

<script lang="ts">
export default { name: "v-charts" };
</script>

<style lang="scss" scoped>
.v-charts {
  width: 100%;
  height: 100%;
  clear: both;
  min-height: 360px;
}
</style>
