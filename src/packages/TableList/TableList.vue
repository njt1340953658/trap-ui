<template>
  <div class="table_list_contaniner">
    <el-form @submit.prevent ref="formFeildValRef" :model="formFeildVal" :rules="rules" label-width="0px">
      <el-table
        :size="size"
        v-bind="options"
        :border="border"
        :data="formFeildVal.dataSource"
        v-loading="loading"
        style="width: 100%"
        ref="multipleTableRefs"
        :header-cell-style="{ background: '#F5F7FA' }"
        @select-all="handleSelectAll"
        @sort-change="handleSortChange"
        @expand-change="handleExpandchange"
        @selection-change="handleSelectionChange"
      >
        <!-- 单元格数据 -->
        <template v-for="(column, index) in columns">
          <!---复选框, 序号 (START)-->
          <el-table-column
            :key="index"
            :prop="column.prop"
            :align="column.align"
            :label="column.label"
            :type="column.type"
            :width="column.width"
            :max-width="column.maxWidth"
            :min-width="column.minWidth"
            :sortable="column.sortable"
            v-bind="column.props"
            v-if="column.type === 'index' || column.type === 'selection' || column.type === 'expand'"
          />

          <el-table-column
            :key="index + 1"
            :prop="column.prop"
            :label="column.label"
            :align="column.align"
            :width="column.width"
            :sortable="column.sortable"
            :max-width="column.maxWidth"
            :min-width="column.minWidth"
            v-bind="column.props"
            v-else-if="!column.isShow || (column.isShow && column.isShow())"
            :show-overflow-tooltip="!column.render && !column.slot && !column.children && !column.formatter && !column.newjump"
          >
            <template #default="scope">
              <!-- render渲染 -->
              <template v-if="column.render">
                <component :is="column.render" :row="scope.row" :index="index" />
              </template>

              <!-- 表单信息 -->
              <el-form-item
                :rules="rules?.[column.prop]"
                v-else-if="scope.row.isShowEdit && !column.children && !column.closeEdit"
                :prop="'dataSource.' + scope.$index + '.' + column.prop"
              >
                <el-select
                  clearable
                  style="width: 100%"
                  v-bind="column.form"
                  v-if="column.formType === 'select'"
                  v-model="scope.row[column.prop]"
                  :placeholder="column.placeholder || '请选择'"
                >
                  <el-option v-for="option in selectDataList" :key="option.value" :value="option.value" :label="option.label" />
                </el-select>
                <el-input
                  v-else
                  clearable
                  v-bind="column.form"
                  v-model.trim="scope.row[column.prop]"
                  :placeholder="column.placeholder || '请输入'"
                />
                <div v-if="isShowTopsText && scope.row.isShowEdit" class="tips">{{ column.tips || '&nbsp;' }}</div>
              </el-form-item>

              <!-- slot插槽 -->
              <template v-else-if="column.slot">
                <slot :slotName="column.slot" :row="scope.row" :index="index" />
              </template>

              <!-- 操作按钮 -->
              <template v-else-if="column.children">
                <template v-for="(btn, key) in column.children">
                  <span :key="key" v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))">
                    <el-button
                      :icon="btn.icon"
                      :plain="btn.plain"
                      style="padding: 6px"
                      :loading="scope.row?.loading"
                      :size="btn.size || 'small'"
                      :text="btn.text ? false : true"
                      :type="btn.type ? btn.type : 'primary'"
                      :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                      @click="btn.method(scope.row, scope.$index)"
                      >{{ btn.label }}</el-button
                    >
                  </span>
                </template>
              </template>

              <!-- 单元格文本 -->
              <template v-else>
                <template v-if="column.formatter">
                  <span
                    v-html="column.formatter(scope.row, column, scope.$index)"
                    @click="column?.click && column?.click(scope.row, scope.$index)"
                  />
                </template>
                <template v-else-if="column.newjump">
                  <router-link
                    class="newjump"
                    v-bind="{ target: '_blank', ...column.target }"
                    :to="column.newjump(scope.row, column, scope.$index)"
                    >{{ scope.row[column.prop] || column.content }}
                  </router-link>
                </template>
                <template v-else>
                  <span
                    :style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
                    @click="column?.click && column?.click(scope.row, scope.$index)"
                  >
                    {{ scope.row[column.prop] || column.content || '--' }}
                    {{ `${scope.row[column.prop] && column.unit ? column.unit : ''}` }}
                  </span>
                </template>
                <div v-if="isShowTopsText && scope.row.isShowEdit" class="tips">&nbsp;</div>
              </template>
            </template>

            <!-- 自定义表头 -->
            <template #header="scope">
              <component v-if="column.headerRender" :is="column.headerRender" :column="scope.column" :index="scope.$index" />
              <slot
                name="customHeader"
                :column="column"
                v-else-if="column.headerSlot"
                :slotName="column.headerSlot"
                :index="scope.$index"
              />
              <span v-else>{{ column.label }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <!-- 分页部分 -->
      <div class="footer_box">
        <div style="display: flex; align-items: center">
          <template v-if="isFooterExtend">
            <el-checkbox style="margin: 0 20px 0 1.2em" v-model="checkedAllSelect" @change="handleChangeSelected" />
            <el-button
              size="small"
              @click="handleDeactivate"
              :plain="!multipleSelection.length"
              :disabled="!multipleSelection.length"
              :type="multipleSelection.length ? '' : 'info'"
              >停用</el-button
            >
            <el-button
              size="small"
              @click="handleEnable"
              :plain="!multipleSelection.length"
              :disabled="!multipleSelection.length"
              :type="multipleSelection.length ? '' : 'info'"
              >启用</el-button
            >
          </template>
          <slot v-else name="customFooter" />
        </div>
        <el-pagination
          small
          background
          :total="dataAllTotal"
          v-if="pagination"
          @size-change="handleSizeChange"
          :page-sizes="[5, 10, 20, 30, 50, 100]"
          :current-page="paginationInfo.curPage"
          :page-size="paginationInfo.pageSize"
          @current-change="handleChangePage"
          :layout="options?.pageExtendLayout || 'total, sizes, prev, pager, next, jumper'"
        />
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" , setup>
import axios from 'axios'
import { ref, reactive, onBeforeMount, watch, toRaw, computed } from 'vue'
import { type FormInstance, type FormRules, ElTable, ElMessage } from 'element-plus'

const getToken = document.cookie.split('=')

axios.defaults.headers['Authorization'] = 'Bearer ' + getToken[getToken.length - 1]

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

interface httpRequest {
  httpApi?: string
  method?: string
  params?: object
  response?: any
  ajax?: Function
}

const props = withDefaults(
  defineProps<{
    size?: string
    columns: Record<string, any>[]
    border?: boolean
    options?: any
    httpRequest?: httpRequest
    pagination?: boolean
    isFooterExtend?: boolean
    modelValue?: object[]
    dataTotal?: number
    customTotal?: string
    rules?: FormRules
    selectDataList?: Record<string, any>[]
  }>(),
  {
    border: false,
    pagination: true,
    isFooterExtend: true,
    dataTotal: 0
  }
)

const emit = defineEmits([
  'selection-change',
  'current-change',
  'size-change',
  'sort-change',
  'expand-change',
  'on-deactivate',
  'on-enable',
  'update:modelValue'
])

const errorMessage = {
  400: '请求错误',
  401: '无权限访问',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP 版本不受支持'
}

const multipleSelection = ref<object[]>([])

const multipleTableRefs = ref<InstanceType<typeof ElTable>>()

const loading = ref<boolean>(false)

const dataAllTotal = ref<number>(0)

const paginationInfo = reactive({
  curPage: 1,
  pageSize: 10
})

const checkedAllSelect = ref<boolean>(false)

const formFeildValRef = ref<FormInstance>(null)

const formFeildVal = reactive<Record<string, any>>({ dataSource: [] })

const isShowTopsText = computed(() => toRaw(props.columns).some((item) => item.tips))

const convertParams = (props) => {
  const newParams = {}
  for (const index in props) {
    const item = props[index]
    const type = typeof item
    if (item || item === 0) {
      if (item && type === 'string') {
        newParams[index] = item.replace(/(^\s+)|(\s+$)/g, '')
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        newParams[index] = convertParams(item)
      } else {
        newParams[index] = item
      }
    }
  }
  return newParams
}

// 复选框全选和全不选
const handleSelectAll = (val) => {
  if (JSON.stringify(val) === '[]') {
    checkedAllSelect.value = false
  } else {
    checkedAllSelect.value = true
  }
}

// 复选框选中项
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  checkedAllSelect.value = false
  emit('selection-change', Array.from(multipleSelection.value))
}

// 底部复选框全选中
const handleChangeSelected = (val) => {
  if (val) {
    multipleTableRefs.value.toggleAllSelection()
  } else {
    multipleTableRefs.value.clearSelection()
  }
}

// 列表排序
const handleSortChange = (row) => {
  emit('sort-change', row)
}

// 某行的折叠事件触发
const handleExpandchange = (row, expandedRows) => {
  emit('expand-change', row, expandedRows)
}

// 改变分页触发事件
const handleChangePage = (current = 1) => {
  paginationInfo.curPage = current
  emit('current-change', current)
  getDataList()
}

// 改变分页条数
const handleSizeChange = (page = 10) => {
  paginationInfo.pageSize = page
  emit('size-change', page)
  getDataList()
}

// 停用
const handleDeactivate = () => {
  emit('on-deactivate', Array.from(multipleSelection.value))
}

// 启用
const handleEnable = () => {
  emit('on-enable', Array.from(multipleSelection.value))
}

// 获取列表数据
const getDataList = async () => {
  if (props.modelValue) {
    formFeildVal.dataSource = toRaw(props.modelValue)
    if (props.dataTotal) {
      dataAllTotal.value = props.dataTotal
    }
    return emit('update:modelValue', formFeildVal.dataSource)
  }
  const { httpApi, method, params, response, ajax } = props.httpRequest || {}
  const { classA, classB, customTotal, customPage } = response || {}
  if (!httpApi) return false
  const pagination = customPage
    ? {
        [customPage]: paginationInfo.curPage,
        pageSize: paginationInfo.pageSize
      }
    : { ...paginationInfo }
  try {
    loading.value = true
    const methodParmas =
      (method || 'get').toLocaleLowerCase() === 'get'
        ? { params: { ...pagination, ...(params || {}) } }
        : { ...pagination, ...(params || {}) }
    const response: any = ajax
      ? await ajax(httpApi, { ...pagination, ...(params || {}) }, method || 'get')
      : await axios[method || 'get'](httpApi, convertParams(methodParmas))
    const res: any = ajax ? response : response.data || {}
    loading.value = false
    if (res?.code === 0) {
      formFeildVal.dataSource = classA && classB ? res?.data[classA][classB] : classA ? res?.data[classA] : res?.data?.data || []
      dataAllTotal.value = customTotal ? res?.data[customTotal] : res?.data?.totalCnt || 0
      emit('update:modelValue', formFeildVal.dataSource)
      if (checkedAllSelect.value === true) {
        checkedAllSelect.value = false
      }
    } else {
      !ajax ? ElMessage.error(res.message) : void null
    }
  } catch (err) {
    loading.value = false
    if (!ajax) {
      const {
        response: { status }
      } = err
      errorMessage[status] ? ElMessage.error(errorMessage[status]) : void null
    }
    throw new Error(err)
  }
}

// 提交form列表
const handleSubmit = (callback?) => {
  formFeildValRef.value.validate(async (valid) => {
    if (!valid) return
    emit('update:modelValue', formFeildVal.dataSource)
    const data = toRaw(formFeildVal.dataSource || []).map((item) => {
      delete item.isShowEdit
      return { ...item }
    })
    callback(data)
  })
}

onBeforeMount(() => {
  if (props.modelValue) return getDataList()
  if (props.httpRequest && JSON.stringify(props.httpRequest) !== '{}') {
    getDataList()
  }
})

watch(
  () => props.httpRequest?.params,
  () => {
    paginationInfo.curPage = 1
    getDataList()
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === undefined) return
    getDataList()
  }
)

defineExpose({
  fetch: getDataList,
  submit: handleSubmit,
  formEl: formFeildValRef,
  element: multipleTableRefs,
  checkAll: handleChangeSelected
})
</script>

<script lang="ts">
export default { name: 'TableList' }
</script>

<style scoped>
:deep(.el-button--small) {
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 0px;
}

.table_list_contaniner {
  overflow: hidden;
}

.table-header {
  padding-top: 10px;
}

.table-header .table-header_button {
  text-align: right;
  float: right;
  margin-bottom: 12px;
  line-height: 40px;
}

.table_list_contaniner .newjump {
  text-decoration: none;
  color: dodgerblue;
}

.table_list_contaniner .footer_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
}

.table_list_contaniner .pagination {
  float: right;
}
</style>
