<template>
  <div class="fixed bottom-8 right-8 z-40 font-serif">
    <button
      v-motion
      :initial="{ scale: 0, rotate: -90 }"
      :enter="{
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 200, damping: 15, delay: 500 },
      }"
      @click="openArchive"
      class="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
    >
      <Icon
        icon="ph:notebook-thin"
        class="w-7 h-7 transition-transform group-hover:-translate-y-1"
      />
    </button>
  </div>

  <transition name="sheet">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col justify-end touch-none font-serif">
      <div
        class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500"
        @click="closeArchive"
      ></div>

      <div
        class="relative w-full h-[85vh] bg-[#FEF9E7]/95 backdrop-blur-3xl rounded-t-[3rem] border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden"
      >
        <div class="w-12 h-1.5 bg-slate-300/60 rounded-full mx-auto mt-6 mb-4"></div>

        <div class="px-10 pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 class="font-bold text-4xl text-black tracking-[0.2em] mb-2">情绪档案</h2>
            <p class="font-light text-slate-900 text-sm tracking-widest opacity-60">
              最近七日的内心起伏
            </p>
          </div>
          <button @click="closeArchive" class="p-2 rounded-full hover:bg-black/5 transition-colors">
            <Icon icon="ph:x-thin" class="w-8 h-8 text-black" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto overscroll-none hide-scrollbar px-10 pb-12">
          <div class="w-full h-52 my-6 relative bg-white/20 rounded-3xl p-4">
            <div ref="chartRef" class="w-full h-full"></div>
          </div>

          <div class="mt-10">
            <h3
              class="font-medium text-xl text-black tracking-[0.3em] mb-8 flex items-center gap-3"
            >
              <Icon icon="ph:images-square-thin" class="w-6 h-6" />
              往昔画卷
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div v-for="record in doodleRecords" :key="record.id" class="flex flex-col group">
                <div
                  class="aspect-[16/9] rounded-2xl mb-4 overflow-hidden relative shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl border border-slate-200/50"
                  :style="{ backgroundColor: record.paperColor }"
                >
                  <div
                    class="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply z-0"
                    style="
                      background-image: linear-gradient(#94a3b8 1px, transparent 1px);
                      background-size: 100% 20px;
                    "
                  ></div>

                  <img
                    :src="record.imgUrl"
                    class="w-full h-full object-cover relative z-10 p-2 mix-blend-darken"
                  />
                </div>

                <div class="flex justify-between items-center px-2">
                  <span class="font-bold text-lg text-black tracking-[0.1em]">{{
                    record.date
                  }}</span>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-slate-500 tracking-widest opacity-80">{{
                      record.moodLabel
                    }}</span>
                    <div
                      class="w-3.5 h-3.5 rounded-full shadow-inner ring-2 ring-white"
                      :style="{ backgroundColor: record.moodHex }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import * as echarts from 'echarts'

const isOpen = ref(false)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const doodleRecords = [
  {
    id: 4,
    date: '五月八日',
    moodHex: '#BAE6FD',
    paperColor: '#E0F2FE',
    moodLabel: '沉静',
    imgUrl: new URL('../assets/images/doodle_04.png', import.meta.url).href,
  },
  {
    id: 3,
    date: '五月七日',
    moodHex: '#A7F3D0',
    paperColor: '#D1FAE5',
    moodLabel: '欣然',
    imgUrl: new URL('../assets/images/doodle_03.png', import.meta.url).href,
  },
  {
    id: 2,
    date: '五月五日',
    moodHex: '#FECDD3',
    paperColor: '#FFE4E6',
    moodLabel: '愉悦',
    imgUrl: new URL('../assets/images/doodle_02.png', import.meta.url).href,
  },
  {
    id: 1,
    date: '五月三日',
    moodHex: '#CBD5E1',
    paperColor: '#F1F5F9',
    moodLabel: '微澜',
    imgUrl: new URL('../assets/images/doodle_01.png', import.meta.url).href,
  },
]

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option = {
    grid: { top: 20, right: 30, bottom: 30, left: 30 },
    xAxis: {
      type: 'category',
      data: ['5.3', '5.5', '5.7', '5.8'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontFamily: 'Source Han Serif SC, SimSun, serif',
        fontSize: 14,
        margin: 15,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        data: [3, 8, 7, 5],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 5,
          shadowBlur: 15,
          shadowColor: 'rgba(186, 230, 253, 0.4)',
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f4c059' },
            { offset: 0.5, color: '#BAE6FD' },
            { offset: 1, color: '#ff8b7e' },
          ]),
        },
        itemStyle: {
          color: '#fff',
          borderColor: '#BAE6FD',
          borderWidth: 3,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(186, 230, 253, 0.2)' },
            { offset: 1, color: 'rgba(186, 230, 253, 0)' },
          ]),
        },
      },
    ],
  }
  chartInstance.setOption(option)
}

const openArchive = async () => {
  isOpen.value = true
  await nextTick()
  initChart()
}

const closeArchive = () => {
  isOpen.value = false
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

const handleResize = () => {
  if (chartInstance) chartInstance.resize()
}
window.addEventListener('resize', handleResize)
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) chartInstance.dispose()
})
</script>

<style scoped>
.font-serif {
  font-family:
    'Source Han Serif SC', 'Source Han Serif CN', 'Noto Serif CJK SC', 'SimSun', 'STSong', serif;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.8s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from .relative,
.sheet-leave-to .relative {
  transform: translateY(100%);
}
.sheet-enter-from .absolute,
.sheet-leave-to .absolute {
  opacity: 0;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
