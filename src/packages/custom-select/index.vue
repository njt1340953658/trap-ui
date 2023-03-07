<template>
  <div tabindex="1" ref="customSelectRef" :class="['custom-select_contaniner-i', isShowDropdown && 'custom-select_background']"
    @click="handleClickDiv" @mouseenter="handelMouseEnter" @mouseleave="handleMouseLeave"
    :style="{ width: modelLabel && modelValue?.length ? '166px' : '100px' }">
    <div>
      <span v-if="modelLabel" class="custom-tag">
        <span>{{ modelLabel }}</span>
        <i class="custom_tag_delete" @mouseenter="handelIconMouseEnter" @mouseleave="handleIconMouseLeave"
          @click.stop="handleDeleteIcon">
          <svg v-if="!ishShowIconDeleteText" t="1678090923023" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="6709" width="11" height="11">
            <path
              d="M263.802377 224.219482a7.964444 7.964444 0 0 1 11.263425 0l236.934198 236.934198 236.934198-236.934198a7.964444 7.964444 0 0 1 11.263425 0l39.582895 39.582895a7.964444 7.964444 0 0 1 0 11.263425l-236.934198 236.934198 236.934198 236.934198a7.964444 7.964444 0 0 1 0 11.263425l-39.582895 39.582895a7.964444 7.964444 0 0 1-11.263425 0l-236.934198-236.934198-236.934198 236.934198a7.964444 7.964444 0 0 1-11.263425 0l-39.582895-39.582895a7.964444 7.964444 0 0 1 0-11.263425l236.934198-236.934198-236.934198-236.934198a7.964444 7.964444 0 0 1 0-11.263425l39.582895-39.582895z"
              fill="#8a8a8a" p-id="6710"></path>
          </svg>
          <svg v-else t="1678091410677" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="6936" width="22" height="22">
            <path
              d="M479.072 512l-98.72-98.72c-9.152-9.152-9.088-23.84 0-32.928 9.152-9.152 23.84-9.088 32.928 0l98.72 98.72 98.72-98.72c9.152-9.152 23.84-9.088 32.928 0 9.152 9.152 9.088 23.84 0 32.928l-98.72 98.72 98.72 98.72c9.152 9.152 9.088 23.84 0 32.928-9.152 9.152-23.84 9.088-32.928 0l-98.72-98.72-98.72 98.72c-9.152 9.152-23.84 9.088-32.928 0-9.152-9.152-9.088-23.84 0-32.928l98.72-98.72zM512 837.824c179.936 0 325.824-145.888 325.824-325.824s-145.888-325.824-325.824-325.824c-179.936 0-325.824 145.888-325.824 325.824s145.888 325.824 325.824 325.824z"
              fill="#B7B8B9" p-id="6937"></path>
          </svg>
        </i>
      </span>
      <span v-if="modelLabel && modelValue?.length > 1" class="custom-tag">+ {{ modelValue.length - 1 }}</span>
      <span v-if="!modelLabel" class="cus_placeholder">{{ placeholder }}</span>
    </div>
    <i class="arrow-top-icon" v-if="!isShowIconRemove || !modelLabel"
      :class="[!isShowDropdown && 'arrow-top-icon-active']">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor"
          d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z">
        </path>
      </svg>
    </i>
    <i class="remove-icon" v-if="isShowIconRemove && modelLabel" @click.stop="handleRemove">
      <svg t="1678084213981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4480" width="11" height="11">
        <path
          d="M512 32c265.097 0 480 214.903 480 480S777.097 992 512 992 32 777.097 32 512 246.903 32 512 32z m0 64C282.25 96 96 282.25 96 512s186.25 416 416 416 416-186.25 416-416S741.75 96 512 96z m169.706 246.294c12.496 12.497 12.496 32.758 0 45.255L557.256 512l124.45 124.452c12.496 12.497 12.496 32.758 0 45.255-12.497 12.496-32.758 12.496-45.255 0L512 557.254 387.549 681.706c-12.497 12.496-32.758 12.496-45.255 0-12.496-12.497-12.496-32.758 0-45.255l124.452-124.452-124.452-124.45c-12.496-12.497-12.496-32.758 0-45.255 12.497-12.496 32.758-12.496 45.255 0l124.452 124.45 124.45-124.45c12.497-12.496 32.758-12.496 45.255 0z"
          fill="#8a8a8a" p-id="4481"></path>
      </svg>
    </i>
  </div>
  <transition>
    <div v-if="isShowDropdown" ref="cusSelectDropdown" class="cus_select_background"
      :style="{ minWidth: popperOffestWidth + 'px', zIndex: 99999 }">
      <div class="cus_select_contaniner">
        <div class="cus_select_left">中国</div>
        <div class="cus_select_right">
          <el-checkbox-group v-model="checkList" style="display:inline-block; padding-left: 20px"
            @change="handelCheckGroup">
            <el-checkbox :key="index" :label="item.value" v-for="(item, index) in dataSource" style="width: 60px;">{{
              item.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { createPopper } from '@popperjs/core';
import { ref, onMounted, nextTick, watch, onUnmounted, toRaw } from 'vue';

const props = withDefaults(
  defineProps<{
    dataSource: any
    modelValue?: any
    placeholder?: string
  }>(),
  {
    dataSource: [],
    modelValue: [],
    placeholder: '请选择'
  }
)

const emit = defineEmits(['update:modelValue']);

const customSelectRef = ref(null);

const cusSelectDropdown = ref(null)

const checkList = ref<string[]>([])

const popperOffestWidth = ref<number>(0)

const isShowDropdown = ref<boolean>(false);

const modelLabel = ref<string>('')

const isShowIconRemove = ref<boolean>(false)

const ishShowIconDeleteText = ref<boolean>(false)

const handleClickDiv = () => {
  isShowDropdown.value = !isShowDropdown.value
}

const handelCheckGroup = (value) => {
  const obj = props.dataSource.filter(item => item.value === value[0])[0]
  modelLabel.value = obj.label
  emit('update:modelValue', value)
}

const handelMouseEnter = () => {
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
  emit('update:modelValue', [])
}

const handleDeleteIcon = () => {
  isShowDropdown.value = false
  checkList.value.splice(0, 1)
  const info = toRaw(checkList.value)[0]
  const obj = props.dataSource.filter(item => item.value === info)[0]
  modelLabel.value = obj?.label || ''
}

const handelIconMouseEnter = () => {
  ishShowIconDeleteText.value = true
}

const handleIconMouseLeave = () => {
  ishShowIconDeleteText.value = false
}

// 点击某个DOM元素之外的方法
const handlerDocClick = event => {
  const isSelf = customSelectRef.value?.contains(event.target)
    || cusSelectDropdown.value?.contains(event.target)
  if (!isSelf) {
    isShowDropdown.value = false;
  }
}

watch([customSelectRef, cusSelectDropdown], () => {
  if (customSelectRef.value && cusSelectDropdown.value) {
    createPopper(customSelectRef.value, cusSelectDropdown.value, {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [80, 8],
          },
        },
      ],
    });
  }
}, {
  deep: true,
  immediate: true
})

watch(
  props.modelValue,
  (newval) => {
    if (!newval || !newval.length) return
    checkList.value = props.modelValue
    const obj = props.dataSource.filter(item => item.value === newval[0])[0]
    modelLabel.value = obj.label
  }, {
  deep: true,
  immediate: true
}
)

onMounted(async () => {
  await nextTick();
  popperOffestWidth.value = customSelectRef.value.offsetWidth
  document.addEventListener('click', handlerDocClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handlerDocClick, true)
})
</script>

<script lang="ts">
export default { name: "CustomSelect" };
</script>
 
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.custom-select_contaniner-i{
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


.custom-select_contaniner-i .custom-tag {
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

.custom-select_contaniner-i .custom_tag_delete {
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

.custom-select_contaniner-i .custom-tag:first-child {
  margin-right: 6px;
  padding-right: 4px;
}

.custom-select_contaniner-i .arrow-top-icon {
  width: 14px;
  transform: rotateX(-180deg);
  color: var(--el-text-color-placeholder);
}

.custom-select_contaniner-i .remove-icon {
  margin-top: 2px;
  color: var(--el-text-color-placeholder);
}

.custom-select_contaniner-i .arrow-top-icon-active {
  transform: rotateX(0deg);
}

.custom-select_contaniner-i .custom-select:hover {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}

.custom-select_contaniner-i .custom-select:focus {
  outline: none;
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.custom-select_contaniner-i .custom-select_background {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.custom-select_contaniner-i ::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: transparent;
}

/*滚动条的轨道*/
.custom-select_contaniner-i ::-webkit-scrollbar-track {
  background-color: transparent;
}

/*滚动条的滑块按钮*/
.custom-select_contaniner-i ::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 2px rgba(#000000, 0.04);
}

/*滚动条的上下两端的按钮*/
.custom-select_contaniner-i ::-webkit-scrollbar-button {
  height: 0;
  background-color: transparent;
}

.custom-select_contaniner-i .cus_select_contaniner {
  padding: 5px 10px;
  display: flex;
}

.custom-select_contaniner-i .cus_select_left {
  width: 60px;
  margin-top: 5px;
}

.custom-select_contaniner-i .cus_select_right {
  flex: 1;
  width: 480px;
}

.custom-select_contaniner-i .cus_select_background {
  min-height: 200px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
}

.custom-select_contaniner-i .cus_placeholder {
  color: var(--el-text-color-placeholder)
}
</style>