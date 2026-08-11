import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMobileStore = defineStore('mobile', () => {
  const isMobile = ref(false)

  function checkMobile() {
    const width = window.innerWidth
    isMobile.value = width < 768
  }
  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile)
  // 初始化检查
  checkMobile()

  return {
    isMobile,
  }
})
