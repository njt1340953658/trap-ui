<template>
  <el-card class="custom_alert_warning">
    <SearchForm
      :rules="rules"
      :isShowSearch="true"
      :is-show-reset="false"
      style="margin-top: 16px"
      :search="search"
      @handleSearch="handleSearch"
    />
    <TableList ref="multipleTableRefs" :httpRequest="httpRequest" :is-footer-extend="false" :columns="columns()" />

    <v-charts :options="setOptions" />
  </el-card>
</template>

<script lang="ts" setup>
import { search, columns } from './list'
import type { FormRules } from 'element-plus'
import { ref, reactive, shallowRef, onBeforeMount  } from 'vue'

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
