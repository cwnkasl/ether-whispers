<template>
  <div
    class="fixed inset-0 z-40 flex items-center justify-center bg-[#FEF9E7]/80 backdrop-blur-sm font-serif touch-none"
  >
    <div
      class="relative w-[85vw] max-w-sm aspect-[3/4] perspective-1000 group cursor-pointer"
      @click="isFlipped = !isFlipped"
    >
      <div
        class="w-full h-full relative transition-transform duration-[800ms] preserve-3d cubic-bezier"
        :class="{ 'rotate-y-180': isFlipped }"
      >
        <div
          class="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center overflow-hidden"
        >
          <div class="absolute top-0 w-full h-8 flex justify-center gap-6 pt-4">
            <div class="w-2 h-4 bg-slate-200 rounded-full shadow-inner"></div>
            <div class="w-2 h-4 bg-slate-200 rounded-full shadow-inner"></div>
            <div class="w-2 h-4 bg-slate-200 rounded-full shadow-inner"></div>
          </div>

          <div class="flex flex-col items-center mt-4">
            <span class="text-slate-400 text-sm tracking-[0.4em] mb-2 uppercase">Today</span>
            <span class="text-7xl font-bold text-slate-800 tracking-tighter mb-4">08</span>
            <span class="text-xl text-slate-600 tracking-[0.5em] ml-2">五月</span>
          </div>

          <div class="mt-12 px-8 py-3 bg-slate-50 rounded-full border border-slate-100">
            <span class="text-slate-500 text-sm tracking-widest animate-pulse">轻触翻转卡片</span>
          </div>
        </div>

        <div
          class="absolute inset-0 backface-hidden rotate-y-180 bg-[#F3F8FF] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-blue-100 flex flex-col items-center p-8 overflow-hidden"
        >
          <div
            class="absolute inset-0 opacity-40 pointer-events-none z-0"
            style="
              background-image: linear-gradient(#bae6fd 1px, transparent 1px);
              background-size: 100% 30px;
            "
          ></div>

          <div class="flex-1 flex flex-col items-center justify-center z-10 w-full">
            <div
              class="w-24 h-24 mb-6 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              <Icon icon="ph:cloud-sun-thin" class="w-12 h-12 text-blue-400" />
            </div>
            <h3 class="text-2xl font-bold text-slate-800 tracking-widest mb-4">今日宜：放空</h3>
            <p class="text-slate-600 text-center text-sm leading-loose tracking-widest opacity-80">
              心里的乌云再重<br />
              也会有一阵清风将其吹散<br />
              给自己三分钟，什么都不去想
            </p>
          </div>

          <div class="w-full flex flex-col gap-3 z-10">
            <button
              @click.stop="$emit('go-meditation')"
              class="w-full py-4 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-white flex items-center justify-center gap-3 text-slate-700 hover:bg-white transition-colors active:scale-[0.98]"
            >
              <Icon icon="ph:waves-thin" class="w-6 h-6 text-blue-500" />
              <span class="tracking-widest font-medium">听白噪音静心</span>
            </button>

            <button
              @click.stop="$emit('go-ai')"
              class="w-full py-4 bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-white hover:bg-black transition-colors active:scale-[0.98]"
            >
              <Icon icon="ph:robot-thin" class="w-6 h-6 text-slate-200" />
              <span class="tracking-widest font-medium">找伴聊聊天</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="$emit('close')"
      class="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 transition-colors z-50"
    >
      <Icon icon="ph:x-thin" class="w-8 h-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

defineEmits(['close', 'go-meditation', 'go-ai'])

const isFlipped = ref(false)
</script>

<style scoped>
.font-serif {
  font-family: 'Source Han Serif SC', 'SimSun', serif;
}

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.cubic-bezier {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
