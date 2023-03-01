<template>
  <div :style="{ display: 'flex', 'overflow-x': deviceInfo.mobile ? 'scroll' : void null }">
    <!-- 扩展性内容 -->
    <slot name="pre_form_content" />

    <el-form
      :inline="true"
      :rules="rules"
      :model="formSearch"
      ref="formSearchRef"
      @submit.prevent
      v-if="search && search.length > 0"
      v-bind="{ 'label-width': '110px', ...options?.formProps }"
    >
      <template :key="index" v-for="(item, index) in search">
        <el-form-item :prop="item.value" v-bind="item.labelProps" :label="item.label ? item.label + '：' : void null">
          <el-select
            clearable
            style="width: 100%"
            v-bind="item.props"
            v-if="item.type === 'select'"
            v-model="formSearch[item.value]"
            :placeholder="`请选择${item.placeholder || item.label}`"
          >
            <el-option v-for="option in item.children" :key="option.value" :value="option.value" :label="option.label" />
          </el-select>
          <el-select-v2
            clearable
            style="width: 100%"
            v-bind="item.props"
            :options="item.children"
            v-else-if="item.type === 'select-v2'"
            v-model="formSearch[item.value]"
            :placeholder="`请选择${item.placeholder || item.label}`"
          />
          <el-date-picker
            clearable
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-bind="item.props || { type: 'date' }"
            v-else-if="item.type === 'picker'"
            v-model="formSearch[item.value]"
          />
          <el-row type="flex" :gutter="5" v-else-if="item.type === 'datePicker'">
            <el-col :span="12">
              <el-date-picker
                clearable
                :editable="false"
                placeholder="选择开始日期"
                value-format="yyyy-MM-dd"
                v-bind="item.props || { type: 'date' }"
                v-model="formSearch[item.startDate]"
                :disabled-date="(time) => startPickerOptions(time, formSearch[item.endDate])"
              />
            </el-col>
            <el-col :span="12">
              <el-date-picker
                clearable
                :editable="false"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd"
                v-bind="item.props || { type: 'date' }"
                v-model="formSearch[item.endDate]"
                :disabled-date="(time) => endPickerOptions(time, formSearch[item.startDate])"
              />
            </el-col>
          </el-row>
          <el-input
            v-else
            clearable
            v-bind="item.props"
            :type="item.inputType || 'text'"
            v-model.trim="formSearch[item.value]"
            :placeholder="`请输入${item.placeholder || item.label}`"
            :maxlength="item.maxlength"
            @keyup.enter="handleSearch"
            :oninput="handleChangeInput(item)"
          >
            <template #append v-if="item.vSlot">
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item v-if="isShowSearch" label-width="0">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button v-if="isShowReset" @click="handleReset(formSearchRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <slot name="next_form_content" />
  </div>
</template>

<script lang="ts" setup>
import useResize from '@/hooks/useResize'
import { useAppStore, DeviceType } from '@/store/modules/app'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, onMounted, watch, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    search: Record<string, any>[]
    rules?: FormRules
    options?: any
    reset?: boolean
    isShowSearch?: boolean
    isShowReset?: boolean
    value?: any
  }>(),
  {
    isShowReset: true
  }
)

useResize()

const appStore = useAppStore()

const formSearch = reactive({})

const formSearchRef = ref<FormInstance>()

const emit = defineEmits(['handleSearch', 'handleReset'])

// 搜索查询按钮
const handleSearch = () => {
  if (props.rules) {
    return formSearchRef.value.validate((valid) => {
      if (!valid) return false
      emit('handleSearch', Object.assign({}, formSearch))
    })
  }
  emit('handleSearch', Object.assign({}, formSearch))
}

// 搜索重置按钮
const handleReset = (formName: FormInstance | undefined) => {
  formName.resetFields()
  props.reset ? Object.assign(formSearch, props.value) : {}
  emit('handleReset')
  if (props.reset) return false
  handleSearch()
}

// input为number校验
const handleChangeInput = (item) => {
  return item.inputType === 'number' ? handleOnInput(formSearch[item.value], item.value, item.rulesLength, item.maxlength) : null
}

// input渲染长度校验
const handleOnInput = (val, label, rulesLength, maxlength) => {
  if (val && Number(val) <= 0) {
    formSearch[label] = 0
  }
  if (rulesLength && val && val.length > maxlength) {
    formSearch[label] = formSearch[label].slice(0, maxlength)
  }
}

const startPickerOptions = computed(() => (time: any, value: any) => {
  const endDateVal = new Date(value).getTime()
  if (endDateVal) {
    return time.getTime() > endDateVal - 0
  }
})

const endPickerOptions = computed(() => (time: any, value: any) => {
  const startDateVal = new Date(value).getTime()
  if (startDateVal) {
    return time.getTime() < startDateVal - 8.64e7 - 1
  }
})

const deviceInfo = computed(() => {
  return {
    mobile: appStore.device === DeviceType.Mobile
  }
})

onMounted(() => {
  if (props.value) {
    Object.assign(formSearch, props.value)
  }
})

watch(
  () => props.value,
  (newval) => {
    if (newval) return Object.assign(formSearch, props.value)
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
}
</style>
