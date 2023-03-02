<template>
  <el-card class="custom_alert_warning">
    <SearchForm :rules="rules" :isShowSearch="true" :is-show-reset="false" style="margin-top: 16px" :search="search"
      @handleSearch="handleSearch" />
    <TableList ref="multipleTableRefs" :httpRequest="httpRequest" :is-footer-extend="false" :columns="columns()" />

    <el-button @click="handleClick">测试</el-button>
    <div class="box">
      <div :style="{width: width + 'px'}" class="left">测试</div>
      <v-charts :isWatch="isActiveName" :options="setOptions" />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { search, columns } from './list'
import type { FormRules } from 'element-plus'
import { ref, reactive, shallowRef, onBeforeMount } from 'vue'

const option = {
  xAxis: {
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      data: [23, 24, 18, 25, 27, 28, 25],
    },
  ],
};

const width = ref(200)

const isActiveName = ref<boolean>(false)

const setOptions = shallowRef<Record<string, any>>({})

const multipleTableRefs = ref(null)

const httpRequest = reactive({
  httpApi: '',
  method: 'get',
  params: {},
  response: {
    classA: 'list',
    customPage: 'page'
  }
})

const rules = reactive<FormRules>({
  domain_id: { required: true, message: '域名信息不能为空', trigger: 'blur' },
  start_time: { required: true, message: '日期信息不能为空', trigger: 'blur' }
})

const handleClick = () => {
  isActiveName.value = !isActiveName.value
  width.value = isActiveName.value ? 50 : 200
}

// 检索条件
const handleSearch = (searchVal) => {
  if (searchVal.start_time) {
    searchVal.start_time = searchVal.start_time / 1000
  }
  httpRequest.params = searchVal
  httpRequest.httpApi = '/admin/api/updispatch/domain-list'
}

onBeforeMount(() => {
  setOptions.value = option
})

</script>

<style lang="scss" scoped>
.box {
  margin-top: 10px;
  display: flex;
  .left {
    background-color: burlywood;
  }
}
</style>
