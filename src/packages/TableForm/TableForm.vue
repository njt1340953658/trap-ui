<template>
  <el-form @submit.prevent ref="formFeildValRef" :model="formFeildVal" :rules="rules" label-width="0px">
    <el-table
      :size="size"
      :border="border"
      v-loading="loading"
      style="width: 100%"
      ref="multipleTableRefs"
      :data="formFeildVal.dataSource"
      :header-cell-style="{ background: '#F5F7FA' }"
      @sort-change="handleSortChange"
      @expand-change="handleExpandchange"
      @selection-change="handleSelectionChange"
    >
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
          :show-overflow-tooltip="!column.render && !column.slot && !column.children && !column.formatter"
        >
          <template #default="scope">
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
                <el-option v-for="option in selectChildren" :key="option.value" :value="option.value" :label="option.label" />
              </el-select>
              <el-input
                v-else
                clearable
                v-bind="column.form"
                v-model.trim="scope.row[column.prop]"
                :placeholder="column.placeholder || '请输入'"
              />
              <div v-if="isShowTopsText" class="tips">{{ column.tips || '&nbsp;' }}</div>
            </el-form-item>

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
              <span
                v-if="column.formatter"
                v-html="column.formatter(scope.row, column, scope.$index)"
                @click="column?.click && column?.click(scope.row, scope.$index)"
              />
              <span
                v-else
                :style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
                @click="column?.click && column?.click(scope.row, scope.$index)"
              >
                {{ scope.row[column.prop] || column.content || '--' }}
                {{ `${scope.row[column.prop] && column.unit ? column.unit : ''}` }}
              </span>
              <div v-if="isShowTopsText" class="tips">&nbsp;</div>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-form>
  <!-- 分页部分 -->
  <div class="footer_box">
    <div><slot name="customFooter" /></div>
    <el-pagination
      small
      background
      v-if="pagination"
      :total="dataTotal"
      @size-change="handleSizeChange"
      :page-sizes="[5, 10, 20, 30, 50, 100]"
      :current-page="pagination.curPage || 1"
      :page-size="pagination.pageSize || 10"
      @current-change="handleChangePage"
      :layout="options?.pageExtendLayout || 'total, sizes, prev, pager, next, jumper'"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, toRaw, computed } from 'vue'
import { ElTable } from 'element-plus'
import { type FormInstance, type FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    size?: any
    border?: boolean
    rules?: FormRules
    loading?: boolean
    modelValue?: object[]
    pagination?: any
    dataTotal?: number
    options?: any
    columns: Record<string, any>[]
    selectChildren?: Record<string, any>[]
  }>(),
  {
    border: false,
    loading: false,
    dataTotal: 0
  }
)

const emit = defineEmits([
  'selection-change',
  'current-change',
  'size-change',
  'sort-change',
  'expand-change',
  'update:modelValue'
])

const formFeildValRef = ref<FormInstance>()

const multipleTableRefs = ref<InstanceType<typeof ElTable>>()

const formFeildVal = reactive<Record<string, any>>({ dataSource: [] })

// 列表排序
const handleSortChange = (row) => {
  emit('sort-change', row)
}

// 某行的折叠事件触发
const handleExpandchange = (row, expandedRows) => {
  emit('expand-change', row, expandedRows)
}

// 复选框选中项
const handleSelectionChange = (val) => {
  emit('selection-change', Array.from(val))
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

// 改变分页触发事件
const handleChangePage = (current = 1) => {
  emit('current-change', current)
}

// 改变分页条数
const handleSizeChange = (page = 10) => {
  emit('size-change', page)
}

const isShowTopsText = computed(() => toRaw(props.columns).some((item) => item.tips))

watch(
  () => props.modelValue,
  (newVal) => {
    formFeildVal.dataSource = newVal
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit: handleSubmit,
  formEl: formFeildValRef,
  element: multipleTableRefs
})
</script>

<script lang="ts">
export default { name: "TableForm" };
</script>

<style scoped>
:deep(.el-button--small) {
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 0px;
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

.footer_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: space-between;
}
</style>
