<template>
  <div class="table_list_contaniner">
    <!-- table表格 -->
    <el-table :size="size" v-bind="options" :border="border" :data="dataSource" v-loading="loading" style="width: 100%"
      ref="multipleTableRefs" :header-cell-style="{ background: '#F5F7FA' }" @select-all="handleSelectAll"
      @sort-change="handleSortChange" @expand-change="handleExpandchange" @selection-change="handleSelectionChange">
      <!-- 表格数据 -->
      <template v-for="(column, index) in columns">
        <!---复选框, 序号 (START)-->
        <el-table-column :key="index" :prop="column.prop" :align="column.align" :label="column.label" :type="column.type"
          :width="column.width" :max-width="column.maxWidth" :min-width="column.minWidth" :sortable="column.sortable"
          v-bind="column.props"
          v-if="column.type === 'index' || column.type === 'selection' || column.type === 'expand'" />

        <el-table-column :key="index + 1" :prop="column.prop" :label="column.label" :align="column.align"
          :width="column.width" :sortable="column.sortable" :max-width="column.maxWidth" :min-width="column.minWidth"
          v-bind="column.props" v-else-if="!column.isShow || (column.isShow && column.isShow())"
          :show-overflow-tooltip="!column.render && !column.slot && !column.children && !column.formatter && !column.newjump">
          <template #default="scope">
            <template v-if="column.render">
              <component :is="column.render" :row="scope.row" :index="index" />
            </template>

            <template v-else-if="column.slot">
              <slot :slotName="column.slot" :row="scope.row" :index="index" />
            </template>

            <!-- 操作按钮 -->
            <template v-else-if="column.children">
              <template v-for="(btn, key) in column.children">
                <span :key="key" v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))">
                  <el-button :icon="btn.icon" :plain="btn.plain" style="padding: 6px" :loading="scope.row?.loading"
                    :size="btn.size || 'small'" :text="btn.text ? false : true" :type="btn.type ? btn.type : 'primary'"
                    :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                    @click="btn.method(scope.row, scope.$index)">{{ btn.label }}</el-button>
                </span>
              </template>
            </template>

            <template v-else>
              <template v-if="column.formatter">
                <span v-html="column.formatter(scope.row, column, scope.$index)"
                  @click="column?.click && column?.click(scope.row, scope.$index)" />
              </template>
              <template v-else-if="column.newjump">
                <router-link class="newjump" v-bind="{ target: '_blank', ...column.target }"
                  :to="column.newjump(scope.row, column, scope.$index)">{{ scope.row[column.prop] || column.content }}
                </router-link>
              </template>
              <template v-else>
                <span :style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
                  @click="column?.click && column?.click(scope.row, scope.$index)">
                  {{ scope.row[column.prop] || column.content || '--' }}
                  {{ `${scope.row[column.prop] && column.unit ? column.unit : ''}` }}
                </span>
              </template>
            </template>
          </template>

          <!-- 自定义表头 -->
          <template #header="scope">
            <component v-if="column.headerRender" :is="column.headerRender" :column="scope.column"
              :index="scope.$index" />
            <slot name="customHeader" :column="column" v-else-if="column.headerSlot" :slotName="column.headerSlot"
              :index="scope.$index" />
            <span v-else>{{ column.label }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页部分 -->
    <div :class="['footer_box', { pagination: !isFooterExtend }]">
      <div style="display: flex; align-items: center" v-if="isFooterExtend">
        <el-checkbox style="margin: 0 20px 0 1.2em" v-model="checkedAllSelect" @change="handleChangeSelected" />
        <el-button size="small" @click="handleDeactivate" :plain="!multipleSelection.length"
          :disabled="!multipleSelection.length" :type="multipleSelection.length ? '' : 'info'">停用</el-button>
        <el-button size="small" @click="handleEnable" :plain="!multipleSelection.length"
          :disabled="!multipleSelection.length" :type="multipleSelection.length ? '' : 'info'">启用</el-button>
      </div>
      <el-pagination small background :total="dataAllTotal" v-if="pagination" @size-change="handleSizeChange"
        :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="paginationInfo.curPage" :page-size="paginationInfo.pageSize"
        @current-change="handleChangePage"
        :layout="options?.pageExtendLayout || 'total, sizes, prev, pager, next, jumper'" />
    </div>
  </div>
</template>

<script lang="ts" , setup>
import axios from 'axios'
import { ElTable, ElMessage } from 'element-plus'
import { ref, reactive, onBeforeMount, watch, toRaw } from 'vue'

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
    customTotal?: string,
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
  'update:dataSource'
])

const errorMessage = {
  400: '请求错误',
  401: "无权限访问",
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

const dataSource = ref<object[]>([])

const loading = ref<boolean>(false)

const dataAllTotal = ref<number>(0)

const paginationInfo = reactive({
  curPage: 1,
  pageSize: 10
})

const checkedAllSelect = ref(false)

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
    dataSource.value = toRaw(props.modelValue)
    if (props.dataTotal) {
      dataAllTotal.value = props.dataTotal
    }
    return emit('update:dataSource', dataSource.value)
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
    const methodParmas = (method || 'get').toLocaleLowerCase() === 'get' ? { params: { ...pagination, ...(params || {}) } } : { ...pagination, ...(params || {}) }
    const response: any = ajax ? await ajax(httpApi, { ...pagination, ...(params || {}) }, method || 'get') : await axios[method || 'get'](httpApi, convertParams(methodParmas))
    const res: any = ajax ? response : response.data || {}
    loading.value = false
    if (res?.code === 0) {
      dataSource.value = classA && classB ? res?.data[classA][classB] : classA ? res?.data[classA] : res?.data?.data || []
      dataAllTotal.value = customTotal ? res?.data[customTotal] : res?.data?.totalCnt || 0
      emit('update:dataSource', dataSource.value)
      if (checkedAllSelect.value === true) {
        checkedAllSelect.value = false
      }
    } else {
      !ajax ? ElMessage.error(res.message) : void null
    }
  } catch (err) {
    loading.value = false
    if (!ajax) {
      const { response: { status } } = err
      errorMessage[status] ? ElMessage.error(errorMessage[status]) : void null
    } 
    throw new Error(err)
  }
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
  element: multipleTableRefs,
  fetch: getDataList,
  checkAll: handleChangeSelected
})
</script>

<script lang="ts">
export default { name: "TableList" };
</script>

<style lang="scss" scoped>
:deep(.el-button--small) {
  font-size: 13px;
}

.table_list_contaniner {
  overflow: hidden;
}

.table-header {
  padding-top: 10px;

  .table-header_button {
    text-align: right;
    float: right;
    margin-bottom: 12px;
    line-height: 40px;
  }
}

.newjump {
  text-decoration: none;
  color: dodgerblue;
}

.footer_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: space-between;
}

.pagination {
  float: right;
}
</style>
