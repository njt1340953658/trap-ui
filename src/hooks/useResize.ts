import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore, DeviceType } from '@/store/modules/app'

/** 参考 Bootstrap 的响应式设计 WIDTH = 992 */
const WIDTH = 992

/** 根据大小变化重新布局 */
export default () => {
  const appStore = useAppStore()

  const _isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const _resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = _isMobile()
      appStore.toggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
    }
  }

  onBeforeMount(() => {
    window.addEventListener('resize', _resizeHandler)
  })

  onMounted(() => {
    if (_isMobile()) {
      appStore.toggleDevice(DeviceType.Mobile)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', _resizeHandler)
  })
}
