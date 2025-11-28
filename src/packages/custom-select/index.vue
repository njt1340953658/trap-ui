<template>
  <div
    tabindex="1"
    ref="customSelectRef"
    @click="handleClickDiv"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="containerStyle"
    :class="['custom-select_contaniner-i', isShowDropdown && 'custom-select_background']"
  >
    <div>
      <span v-if="modelLabel" class="custom-tag">
        <span>{{ modelLabel }}</span>
        <i
          class="custom_tag_delete"
          @mouseenter="handleIconMouseEnter"
          @mouseleave="handleIconMouseLeave"
          @click.stop="handleDeleteIcon"
          v-if="!disabledAll"
        >
          <svg
            v-if="!isShowIconDeleteText"
            t="1678090923023"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6709"
            width="11"
            height="11"
          >
            <path
              d="M263.802377 224.219482a7.964444 7.964444 0 0 1 11.263425 0l236.934198 236.934198 236.934198-236.934198a7.964444 7.964444 0 0 1 11.263425 0l39.582895 39.582895a7.964444 7.964444 0 0 1 0 11.263425l-236.934198 236.934198 236.934198 236.934198a7.964444 7.964444 0 0 1 0 11.263425l-39.582895 39.582895a7.964444 7.964444 0 0 1-11.263425 0l-236.934198-236.934198-236.934198 236.934198a7.964444 7.964444 0 0 1-11.263425 0l-39.582895-39.582895a7.964444 7.964444 0 0 1 0-11.263425l236.934198-236.934198-236.934198-236.934198a7.964444 7.964444 0 0 1 0-11.263425l39.582895-39.582895z"
              fill="#8a8a8a"
              p-id="6710"
            />
          </svg>
          <svg
            v-else
            t="1678091410677"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6936"
            width="22"
            height="22"
          >
            <path
              d="M479.072 512l-98.72-98.72c-9.152-9.152-9.088-23.84 0-32.928 9.152-9.152 23.84-9.088 32.928 0l98.72 98.72 98.72-98.72c9.152-9.152 23.84-9.088 32.928 0 9.152 9.152 9.088 23.84 0 32.928l-98.72 98.72 98.72 98.72c9.152 9.152 9.088 23.84 0 32.928-9.152 9.152-23.84 9.088-32.928 0l-98.72-98.72-98.72 98.72c-9.152 9.152-23.84 9.088-32.928 0-9.152-9.152-9.088-23.84 0-32.928l98.72-98.72zM512 837.824c179.936 0 325.824-145.888 325.824-325.824s-145.888-325.824-325.824-325.824c-179.936 0-325.824 145.888-325.824 325.824s145.888 325.824 325.824 325.824z"
              fill="#B7B8B9"
              p-id="6937"
            />
          </svg>
        </i>
      </span>
      <span v-if="modelLabel && modelValue?.length > 1" class="custom-tag">+ {{ modelValue.length - 1 }}</span>
      <span v-if="!modelLabel" class="cus_placeholder">{{ placeholder }}</span>
    </div>
    <i
      class="arrow-top-icon"
      v-if="disabledAll || !isShowIconRemove || !modelLabel"
      :class="[!isShowDropdown && 'arrow-top-icon-active']"
    >
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        />
      </svg>
    </i>
    <i class="remove-icon" @click.stop="handleRemove" v-if="isShowIconRemove && modelLabel && !disabledAll">
      <svg
        t="1678084213981"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4480"
        width="11"
        height="11"
      >
        <path
          d="M512 32c265.097 0 480 214.903 480 480S777.097 992 512 992 32 777.097 32 512 246.903 32 512 32z m0 64C282.25 96 96 282.25 96 512s186.25 416 416 416 416-186.25 416-416S741.75 96 512 96z m169.706 246.294c12.496 12.497 12.496 32.758 0 45.255L557.256 512l124.45 124.452c12.496 12.497 12.496 32.758 0 45.255-12.497 12.496-32.758 12.496-45.255 0L512 557.254 387.549 681.706c-12.497 12.496-32.758 12.496-45.255 0-12.496-12.497-12.496-32.758 0-45.255l124.452-124.452-124.452-124.45c-12.496-12.497-12.496-32.758 0-45.255 12.497-12.496 32.758-12.496 45.255 0l124.452 124.45 124.45-124.45c12.497-12.496 32.758-12.496 45.255 0z"
          fill="#8a8a8a"
          p-id="4481"
        />
      </svg>
    </i>
  </div>
  <transition>
    <div
      v-if="isShowDropdown"
      ref="cusSelectDropdown"
      class="cus_select_background"
      :style="dropdownStyle"
    >
      <div v-if="multilevel" style="padding: 5px 20px">
        <div :key="key" v-for="(opt, key) in cusDataListChecked" class="multilevel_box">
          <el-checkbox
            style="width: 60px"
            v-model="opt.checkAll"
            @change="handleCheckAllChange($event, opt)"
            :indeterminate="opt.isIndeterminate"
            :disabled="disabledHandleFn(opt)"
          >
            {{ opt[props.label] }}
          </el-checkbox>
          <el-checkbox-group
            v-if="opt.children"
            v-model="opt.checkList"
            @change="handleCheckedCitiesChange($event, opt)"
            style="display: inline-block; padding-left: 20px"
          >
            <el-checkbox
              style="width: 60px"
              :value="item[props.value]"
              :key="index + Math.random()"
              :disabled="disabledHandleFn(opt)"
              v-for="(item, index) in opt.children"
              :label="labelValue ? item[props.value] : item[props.label]"
            >
              {{ item[props.label] }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="cus_select_contaniner" v-else>
        <div class="cus_select_left">{{ CONSTANTS.DEFAULT_REGION }}</div>
        <div class="cus_select_right">
          <el-checkbox-group v-model="checkList" @change="handleCheckGroup" style="display: inline-block; padding-left: 20px">
            <el-checkbox
              :key="index"
              :value="item[props.value]"
              style="width: 60px"
              v-for="(item, index) in dataSource"
              :label="labelValue ? item[props.value] : item[props.label]"
            >
              {{ item[props.label] }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span data-popper-arrow="" class="el-popper__arrow" :style="{ position: 'absolute', left: CONSTANTS.ARROW_LEFT + 'px' }" />
    </div>
  </transition>
</template>
<script setup lang="ts">
import { createPopper } from '@popperjs/core'
import { ref, onMounted, nextTick, watch, onUnmounted, toRaw, onBeforeMount, computed } from 'vue'

interface TreeNode {
  [key: string]: any
  children?: TreeNode[]
  checkAll?: boolean
  isIndeterminate?: boolean
  checkList?: any[]
}

interface SelectOption {
  [key: string]: any
  label?: string
  value?: any
}

const CONSTANTS = {
  DEFAULT_LABEL: '默认',
  DEFAULT_REGION: '中国',
  WIDTH: {
    SELECTED: 166,
    DEFAULT: 100
  },
  ARROW_LEFT: 140,
  Z_INDEX: 99999
} as const

const props = withDefaults(
  defineProps<{
    height?: string | number
    dataSource?: SelectOption[]
    modelValue?: any[]
    placeholder?: string
    multilevel?: boolean
    disabled?: boolean
    disabledAll?: boolean
    label?: string
    value?: string
    labelValue?: boolean
  }>(),
  {
    height: 25,
    disabled: false,
    multilevel: false,
    dataSource: (): SelectOption[] => [],
    modelValue: (): any[] => [],
    placeholder: '请选择',
    disabledAll: false,
    label: 'label',
    value: 'value',
    labelValue: false
  }
)

const emit = defineEmits(['update:modelValue'])

const customSelectRef = ref()

const cusSelectDropdown = ref()

const cusDataListChecked = ref<TreeNode[]>([])

const checkList = ref<string[]>([])

const popperOffsetWidth = ref<number>(0)

const isShowDropdown = ref<boolean>(false)

const modelLabel = ref<string>('')

const isShowIconRemove = ref<boolean>(false)

const isShowIconDeleteText = ref<boolean>(false)

const containerStyle = computed(() => ({
  width: modelLabel.value && props.modelValue?.length ? `${CONSTANTS.WIDTH.SELECTED}px` : `${CONSTANTS.WIDTH.DEFAULT}px`,
  height: `${props.height}px` || '25px'
}))

const dropdownStyle = computed(() => ({
  minWidth: `${popperOffsetWidth.value}px`,
  zIndex: CONSTANTS.Z_INDEX
}))

const getLabelFromValue = (value: any, dataSource: SelectOption[]): string => {
  if (!value || !dataSource?.length) return ''
  const item = dataSource.find((item) => item[props.value] === value)
  return item?.[props.label] || ''
}

const disabledHandleFn = computed(() => (opt: TreeNode) => {
  if (props.disabledAll) return true
  return props.disabled && checkList.value.length ? !opt.checkList?.length : false
})

const handleClickDiv = () => {
  isShowDropdown.value = !isShowDropdown.value
}

const handleCheckGroup = (value: any[]) => {
  if (!props.labelValue && value?.length) {
    const valueList = value.map((labelVal: any) => {
      const item = props.dataSource.find((item) => item[props.label] === labelVal)
      return item ? item[props.value] : labelVal
    })
    modelLabel.value = getLabelFromValue(valueList[0], props.dataSource)
    emit('update:modelValue', valueList)
  } else {
    modelLabel.value = getLabelFromValue(value[0], props.dataSource)
    emit('update:modelValue', value)
  }
}

const handleMouseEnter = () => {
  isShowIconRemove.value = true
}

const handleMouseLeave = () => {
  isShowIconRemove.value = false
}

const handleRemove = () => {
  modelLabel.value = ''
  checkList.value = []
  if (isShowDropdown.value) {
    isShowDropdown.value = false
  }
  if (props.multilevel) {
    cusDataListChecked.value = addCheckProperties(props.dataSource)
  }
  emit('update:modelValue', [])
}

const handleDeleteIcon = () => {
  isShowDropdown.value = false
  if (checkList.value.length > 0) {
    checkList.value = checkList.value.slice(1)
  }

  if (props.multilevel) {
    cusDataListChecked.value = findTreeChecked(cusDataListChecked.value)
    emit('update:modelValue', checkList.value)
    return
  }

  const remainingCheckValue = toRaw(checkList.value)[0]
  
  if (!props.labelValue && remainingCheckValue) {
    const item = props.dataSource.find((item) => item[props.label] === remainingCheckValue)
    const remainingValue = item ? item[props.value] : remainingCheckValue
    modelLabel.value = remainingValue ? getLabelFromValue(remainingValue, props.dataSource) : ''
    const valueList = checkList.value.map((labelVal: any) => {
      const dataItem = props.dataSource.find((item) => item[props.label] === labelVal)
      return dataItem ? dataItem[props.value] : labelVal
    })
    emit('update:modelValue', valueList)
  } else {
    modelLabel.value = remainingCheckValue ? getLabelFromValue(remainingCheckValue, props.dataSource) : ''
    emit('update:modelValue', checkList.value)
  }
}

const handleIconMouseEnter = () => {
  isShowIconDeleteText.value = true
}

const handleIconMouseLeave = () => {
  isShowIconDeleteText.value = false
}

const handlerDocClick = (event: MouseEvent): void => {
  const isSelf = customSelectRef.value?.contains(event.target) || cusSelectDropdown.value?.contains(event.target)
  if (!isSelf) {
    isShowDropdown.value = false
  }
}

const handleCheckAllChange = (checked: any, option: TreeNode): void => {
  const isChecked = Boolean(checked)
  const allCity = option.children
    ? option.children.map((item: any) => item[props.value])
    : [option[props.value]]
  
  option.checkList = isChecked ? allCity : []
  option.isIndeterminate = false
  
  if (!props.disabled) {
    syncCheckListFromTree()
  } else {
    checkList.value = option.checkList
    const newLabelArr = option.children
      ? option.children.filter((item: any) => checkList.value.includes(item[props.value]))
      : checkList.value?.length
      ? [{ [props.label]: CONSTANTS.DEFAULT_LABEL }]
      : []
    modelLabel.value = newLabelArr?.[0]?.[props.label] || ''
  }
  
  emit('update:modelValue', checkList.value)
}

const handleCheckedCitiesChange = (value: any[], option: TreeNode): void => {
  const checkedCount = value.length
  const allCity = option.children
    ? option.children.map((item: any) => item[props.value])
    : [option[props.value]]
  
  option.checkAll = checkedCount === allCity.length
  option.isIndeterminate = checkedCount > 0 && checkedCount < allCity.length
  option.checkList = value
  
  if (!props.disabled) {
    syncCheckListFromTree()
  } else {
    checkList.value = option.checkList
    const newLabelArr = option.children
      ? option.children.filter((item: any) => checkList.value.includes(item[props.value]))
      : checkList.value?.length
      ? [{ [props.label]: CONSTANTS.DEFAULT_LABEL }]
      : []
    modelLabel.value = newLabelArr?.[0]?.[props.label] || ''
  }
  
  emit('update:modelValue', checkList.value)
}

const syncCheckListFromTree = () => {
  if (props.disabled) return
  
  const allCheckedValues: any[] = []
  let firstLabel = ''
  const firstNode = cusDataListChecked.value[0]
  const hasDefault = firstNode && !firstNode.children && firstNode.checkList?.includes('default')
  
  if (hasDefault) {
    allCheckedValues.push('default')
  }
  
  cusDataListChecked.value.forEach((node) => {
    if (!node.children?.length) return
    
    node.children.forEach((child: any) => {
      const checkValue = child[props.value]
      const isChecked = node.checkAll || node.checkList?.includes(checkValue)
      
      if (isChecked) {
        allCheckedValues.push(child[props.value])
        if (!firstLabel) {
          firstLabel = child[props.label]
        }
      }
    })
  })
  
  checkList.value = allCheckedValues
  if (hasDefault) {
    modelLabel.value = CONSTANTS.DEFAULT_LABEL
  } else if (firstLabel) {
    modelLabel.value = firstLabel
  }
}

const addCheckProperties = (treeData: TreeNode[]): TreeNode[] => {
  if (!treeData?.length) return []
  
  return treeData.map((node) => {
    const newNode: TreeNode = { ...node }
    newNode.checkAll = false
    newNode.isIndeterminate = false
    newNode.checkList = []
    
    if (node.children?.length) {
      newNode.children = addCheckProperties(node.children)
    }
    
    return newNode
  })
}

const findTreeChecked = (treeData: TreeNode[]): TreeNode[] => {
  if (!treeData?.length || !checkList.value?.length) {
    treeData.forEach((node, index) => {
      if (node.children?.length) {
        node.checkList = []
        node.checkAll = false
        node.isIndeterminate = false
      } else if (index === 0) {
        node.checkList = []
        node.checkAll = false
        node.isIndeterminate = false
      }
    })
    return treeData
  }

  const checkedValues = toRaw(checkList.value)
  const hasDefault = checkedValues.some((item) => item === 'default')
  let firstLabel = ''

  treeData.forEach((node, index) => {
    if (node.children?.length) {
      const childValues = node.children.map((item: any) => item[props.value])
      const checkedChildren = checkedValues.filter((v) => childValues.includes(v))
      
      node.checkList = checkedChildren.length > 0 ? [...checkedChildren] : []
      const checkedCount = node.checkList.length
      const totalCount = childValues.length
      node.checkAll = checkedCount === totalCount && totalCount > 0
      node.isIndeterminate = checkedCount > 0 && checkedCount < totalCount
      
      if (!firstLabel && checkedChildren.length > 0) {
        const firstChecked = node.children.find((item: TreeNode) => 
          checkedChildren.includes(item[props.value])
        )
        firstLabel = firstChecked?.[props.label] || ''
      }
    } else {
      if (index === 0) {
        node.isIndeterminate = false
        node.checkAll = hasDefault
        node.checkList = hasDefault ? ['default'] : []
      } else {
        node.checkList = []
        node.checkAll = false
        node.isIndeterminate = false
      }
    }
  })

  modelLabel.value = hasDefault ? CONSTANTS.DEFAULT_LABEL : firstLabel
  return [...treeData]
}

watch(
  [customSelectRef, cusSelectDropdown],
  () => {
    if (customSelectRef.value && cusSelectDropdown.value) {
      createPopper(customSelectRef.value, cusSelectDropdown.value, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [80, 8]
            }
          }
        ]
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const handleModelValueChange = async (newval) => {
  if (!newval || !newval.length) {
    checkList.value = []
    modelLabel.value = ''
    if (props.multilevel && cusDataListChecked.value.length) {
      cusDataListChecked.value = addCheckProperties(props.dataSource)
    }
    return
  }

  const valueArray = Array.isArray(newval) ? [...newval] : [newval]

  if (props.multilevel) {
    checkList.value = valueArray
    if (!props.dataSource?.length) return
    if (!cusDataListChecked.value.length) {
      cusDataListChecked.value = addCheckProperties(props.dataSource)
    }
    await nextTick()
    const updatedTree = findTreeChecked(cusDataListChecked.value)
    cusDataListChecked.value = updatedTree
    return
  }

  if (!props.labelValue) {
    const labelList = valueArray.map((val: any) => {
      const item = props.dataSource.find((item) => item[props.value] === val)
      return item ? item[props.label] : val
    })
    checkList.value = labelList
  } else {
    checkList.value = valueArray
  }
  
  modelLabel.value = getLabelFromValue(valueArray[0], props.dataSource)
}

watch(() => props.modelValue, handleModelValueChange, {
  deep: true,
  immediate: true
})

const initTreeData = () => {
  if (props.multilevel && props.dataSource?.length) {
    cusDataListChecked.value = addCheckProperties(props.dataSource)
    if (props.modelValue?.length) {
      checkList.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue]
      cusDataListChecked.value = findTreeChecked(cusDataListChecked.value)
    }
  }
}

onBeforeMount(() => {
  initTreeData()
})

watch(
  () => props.dataSource,
  (newDataSource) => {
    if (props.multilevel && newDataSource?.length) {
      cusDataListChecked.value = addCheckProperties(newDataSource)
      if (props.modelValue?.length) {
        checkList.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue]
        nextTick(() => {
          cusDataListChecked.value = findTreeChecked(cusDataListChecked.value)
        })
      }
    }
  },
  {
    deep: true,
    immediate: false
  }
)

onMounted(async () => {
  await nextTick()
  popperOffsetWidth.value = customSelectRef.value.offsetWidth
  document.addEventListener('click', handlerDocClick, true)
  if (props.multilevel && props.modelValue.length) {
    cusDataListChecked.value = findTreeChecked(cusDataListChecked.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handlerDocClick, true)
})
</script>

<script lang="ts">
export default { name: 'CustomSelect' }
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.custom-select_contaniner-i {
  width: 100%;
  height: 25px;
  padding: 7px 9px;
  padding-left: 5px;
  border-radius: 4px;
  line-height: 1;
  cursor: pointer;
  position: relative;
  user-select: none;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 13px;
  flex-grow: 1;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  color: var(--el-input-text-color, var(--el-text-color-regular));
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

.custom-tag {
  color: var(--el-color-info);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 18px;
  padding: 0 9px;
  line-height: 1;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  background-color: var(--el-fill-color);
}

.custom_tag_delete {
  width: 18px;
  margin-left: 5px;
  font-size: 0px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--el-color-info);
}

.custom-tag:first-child {
  margin-right: 6px;
  padding-right: 4px;
}

.arrow-top-icon {
  width: 14px;
  transform: rotateX(-180deg);
  color: var(--el-text-color-placeholder);
}

.remove-icon {
  margin-top: 2px;
  color: var(--el-text-color-placeholder);
}

.arrow-top-icon-active {
  transform: rotateX(0deg);
}

.custom-select:hover {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}

.custom-select:focus {
  outline: none;
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.custom-select_background {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: transparent;
}

/*滚动条的轨道*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 2px rgba(#000000, 0.04);
}

/*滚动条的上下两端的按钮*/
::-webkit-scrollbar-button {
  height: 0;
  background-color: transparent;
}

.cus_select_contaniner {
  padding: 5px 10px;
  display: flex;
}

.cus_select_left {
  width: 60px;
  margin-top: 5px;
}

.cus_select_right {
  flex: 1;
  width: 480px;
}

.cus_select_background {
  min-height: 200px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  .multilevel_box {
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #e4e7ed;
  }
  .multilevel_box:last-child {
    border-bottom: none;
  }
}

.cus_placeholder {
  color: var(--el-text-color-placeholder);
}

.el-popper__arrow {
  top: -5px;
}

.el-popper__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: -1;
}

.el-popper__arrow::before {
  border: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color-overlay);
  right: 0;
  border-bottom-color: transparent !important;
  border-right-color: transparent !important;
}
</style>
