import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum DeviceType {
  Mobile,
  Desktop
}

export const useAppStore = defineStore('app', () => {
  const device = ref<DeviceType>(DeviceType.Desktop)
  
  const toggleDevice = (value: DeviceType) => {
    device.value = value
  }

  return { device, toggleDevice }
})
