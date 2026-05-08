import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEmotionStore = defineStore('emotion', () => {
  // 当前的情绪标签，默认为平静
  const currentMood = ref('平静')
  // 当前主题色类名（对应在 Tailwind 中配置的颜色）
  const currentTheme = ref('bg-healing-sand')

  // 修改心情与全局背景的核心方法
  const setMood = (mood: string, themeClass: string) => {
    currentMood.value = mood
    currentTheme.value = themeClass

    // 直接操纵 body 的 class，配合在 main.css 里写的 transition 实现背景色渐变
    document.body.className = `${themeClass} text-slate-700 antialiased`
  }

  return { currentTheme, currentMood, setMood }
})
