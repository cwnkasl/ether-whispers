<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FEF9E7] relative overscroll-none overflow-hidden font-serif"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: -30 }"
      :enter="{ opacity: 1, y: 0, transition: { type: 'spring', delay: 100 } }"
      class="text-center mb-6 select-none z-10"
    >
      <h1 class="font-bold text-5xl text-black tracking-[0.2em] mb-5">今日尺素</h1>
      <p class="font-light text-slate-950 text-sm tracking-widest opacity-80">
        抽取一枚情绪底色，画下此刻感受
      </p>
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 200, type: 'spring' } }"
      class="flex gap-4 sm:gap-6 mb-8 z-10"
    >
      <button
        v-for="mood in moodPalette"
        :key="mood.name"
        @click="selectedMood = mood"
        class="w-10 h-10 rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 border-4 flex items-center justify-center"
        :style="{
          backgroundColor: mood.hex,
          borderColor: selectedMood.name === mood.name ? '#000' : 'transparent',
        }"
        :title="mood.name"
      ></button>
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 300, type: 'spring' } }"
      class="w-full max-w-3xl aspect-[3/2] rounded-2xl shadow-2xl relative overflow-hidden group border border-slate-200 transition-all duration-700 z-10"
      :style="{ backgroundColor: selectedMood.paperColor }"
    >
      <div
        class="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0"
        style="
          background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 100% 30px;
        "
      ></div>

      <div class="absolute top-6 left-8 z-0 text-2xl text-slate-950/80 select-none tracking-widest">
        &nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
      </div>

      <div
        class="absolute inset-0 flex flex-col items-center justify-center text-slate-950 pointer-events-none transition-opacity duration-700 select-none z-0"
        :class="{ 'opacity-0': hasDrawn }"
      >
        <Icon icon="ph:rabbit-thin" class="w-12 h-12 mb-3 text-slate-950/70" />
        <span class="font-light text-sm tracking-[0.3em]">提笔忘忧...</span>
      </div>

      <canvas
        ref="canvasRef"
        class="w-full h-full relative z-10 transition-opacity duration-[2500ms] ease-out touch-none"
        :class="[
          activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair',
          isFading ? 'opacity-0 pointer-events-none' : 'opacity-100',
        ]"
        @pointerdown="startDrawing"
        @pointermove="draw"
        @pointerup="stopDrawing"
        @pointerleave="stopDrawing"
      ></canvas>

      <transition name="frame-plane">
        <div
          v-if="showPlaneAnimation"
          class="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        >
          <Icon
            icon="ph:paper-plane-tilt-thin"
            class="w-24 h-24 text-black/85 frame-paper-plane-actor"
          />
        </div>
      </transition>

      <div
        class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-5 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60"
      >
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <button
            v-for="color in penColors"
            :key="color.name"
            @click="useTool('pen', color.hex)"
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-sm transition-transform duration-300 hover:scale-110 active:scale-90 border-2"
            :class="[
              activeTool === 'pen' && activeColor === color.hex
                ? 'border-slate-400 scale-110'
                : 'border-transparent',
            ]"
            :style="{ backgroundColor: color.hex }"
          ></button>
        </div>

        <div class="w-px h-6 bg-slate-300/60 rounded-full"></div>

        <button
          @click="useTool('eraser')"
          class="flex items-center justify-center p-2 rounded-full transition-all duration-300"
          :class="
            activeTool === 'eraser'
              ? 'bg-slate-200 text-black shadow-inner'
              : 'text-slate-500 hover:text-black hover:bg-slate-100'
          "
        >
          <Icon icon="ph:eraser-thin" class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div class="w-px h-6 bg-slate-300/60 rounded-full"></div>

        <button
          @click="confirmDrawing"
          class="flex items-center justify-center px-6 py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-slate-800 hover:shadow-lg active:scale-95 group"
        >
          <Icon
            icon="ph:paper-plane-tilt-thin"
            class="w-4 h-4 mr-1.5 transition-transform group-hover:translate-x-1"
          />
          <span class="tracking-[0.2em] pl-[0.2em] whitespace-nowrap">封缄</span>
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-8 scale-95"
    >
      <div
        v-if="toast.show"
        class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div
          class="bg-white/90 backdrop-blur-xl px-10 py-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col items-center gap-5"
        >
          <Icon :icon="toast.icon" class="w-14 h-14 text-slate-800 animate-pulse" />
          <span class="font-medium text-slate-900 tracking-[0.4em] text-sm">{{
            toast.message
          }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const hasDrawn = ref(false)
const showPlaneAnimation = ref(false)
const isFading = ref(false)

const moodPalette = [
  { name: '平静灰', hex: '#E5E7EB', paperColor: '#F3F4F6' },
  { name: '治愈蓝', hex: '#BAE6FD', paperColor: '#E0F2FE' },
  { name: '温柔粉', hex: '#FECDD3', paperColor: '#FFE4E6' },
  { name: '生机绿', hex: '#A7F3D0', paperColor: '#D1FAE5' },
]
const selectedMood = ref(moodPalette[0])

const activeTool = ref<'pen' | 'eraser'>('pen')
const activeColor = ref('#334155')

const penColors = [
  { name: '墨灰', hex: '#334155' },
  { name: '珊瑚', hex: '#ff8b7e' },
  { name: '麦穗', hex: '#f4c059' },
  { name: '芽绿', hex: '#88d49e' },
  { name: '晴空', hex: '#7ab8f5' },
  { name: '香芋', hex: '#c49add' },
]

const toast = ref({ show: false, message: '', icon: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, icon: string) => {
  toast.value = { show: true, message, icon }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value.show = false), 2200)
}

let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    useTool('pen', activeColor.value)
  }
}

const useTool = (tool: 'pen' | 'eraser', hex?: string) => {
  activeTool.value = tool
  if (!ctx) return
  if (tool === 'pen') {
    if (hex) activeColor.value = hex
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = activeColor.value
    ctx.lineWidth = 5
  } else {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = 28
  }
}

const startDrawing = (e: PointerEvent) => {
  if (isFading.value) return
  isDrawing = true
  hasDrawn.value = true
  draw(e)
}

const draw = (e: PointerEvent) => {
  if (!isDrawing || !ctx || !canvasRef.value) return
  e.preventDefault()
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const stopDrawing = () => {
  isDrawing = false
  if (ctx) ctx.beginPath()
}

const confirmDrawing = () => {
  if (!hasDrawn.value) {
    showToast('纸上空空，留下一笔吧', 'ph:pencil-simple-line-thin')
    return
  }

  showPlaneAnimation.value = true
  isFading.value = true

  setTimeout(() => {
    if (ctx && canvasRef.value) {
      const dpr = window.devicePixelRatio || 1
      ctx.clearRect(0, 0, canvasRef.value.width / dpr, canvasRef.value.height / dpr)
      hasDrawn.value = false
      isFading.value = false
      showPlaneAnimation.value = false
    }
    showToast('尺素已封缄，收入档案室', 'ph:archive-thin')
  }, 2500)
}

onMounted(() => {
  initCanvas()
  let resizeTimer: ReturnType<typeof setTimeout>
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(initCanvas, 200)
  })
})
</script>

<style scoped>
.font-serif {
  font-family:
    'Source Han Serif SC', 'Source Han Serif CN', 'Noto Serif CJK SC', 'SimSun', 'STSong', serif;
}

@keyframes planeFullDiagonalSlide {
  0% {
    left: -20%;
    bottom: -20%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 110%;
    bottom: 110%;
    opacity: 0;
  }
}

.frame-paper-plane-actor {
  animation: planeFullDiagonalSlide 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  position: absolute;
  transform: rotate(15deg);
}

.frame-plane-enter-active,
.frame-plane-leave-active {
  transition: opacity 0.3s ease;
}
.frame-plane-enter-from,
.frame-plane-leave-to {
  opacity: 0;
}
</style>
