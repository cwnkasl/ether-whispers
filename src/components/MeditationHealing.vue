<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1C23] font-serif touch-none overflow-hidden text-slate-200"
  >
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"
      ></div>
    </div>

    <header class="absolute top-0 w-full flex justify-between items-center px-8 py-8 z-20">
      <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
        <Icon icon="ph:x-thin" class="w-8 h-8" />
      </button>
      <span class="text-sm tracking-[0.4em] text-slate-400">声学疗愈空间</span>
      <div class="w-8"></div>
    </header>

    <div
      class="relative w-full max-w-md px-8 z-10 flex flex-col items-center h-[60vh] justify-center"
    >
      <transition name="fade-slide" mode="out-in">
        <div v-if="phase === 'pre-test'" class="w-full flex flex-col items-center text-center">
          <Icon icon="ph:leaf-thin" class="w-12 h-12 text-slate-400 mb-6" />
          <h2 class="text-2xl tracking-widest mb-4 text-white">开始前，深呼吸</h2>
          <p class="text-slate-400 text-sm tracking-[0.2em] mb-12">请滑动指尖，评估此刻的压力值</p>

          <div class="w-full px-4 mb-8">
            <input
              type="range"
              min="1"
              max="10"
              v-model="preStress"
              class="w-full h-1 bg-slate-700 rounded-full appearance-none outline-none custom-slider"
            />
            <div class="flex justify-between text-xs text-slate-500 tracking-widest mt-4">
              <span>平静 (1)</span>
              <span class="text-white text-lg font-bold">{{ preStress }}</span>
              <span>紧绷 (10)</span>
            </div>
          </div>

          <button
            @click="phase = 'meditating'"
            class="px-8 py-3 bg-white text-black rounded-full text-sm tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            进入声学空间
          </button>
        </div>

        <div v-else-if="phase === 'meditating'" class="w-full flex flex-col items-center">
          <h2 class="text-xl tracking-widest text-slate-300 mb-12 opacity-80">3分钟快速充能</h2>

          <div class="relative w-48 h-48 flex items-center justify-center mb-16">
            <div
              class="absolute inset-0 border border-blue-400/30 rounded-full animate-ripple"
              style="animation-delay: 0s"
            ></div>
            <div
              class="absolute inset-0 border border-blue-400/20 rounded-full animate-ripple"
              style="animation-delay: 1.5s"
            ></div>
            <div
              class="absolute inset-0 border border-blue-400/10 rounded-full animate-ripple"
              style="animation-delay: 3s"
            ></div>

            <button
              @click="isPlaying = !isPlaying"
              class="relative z-10 w-20 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <Icon
                :icon="isPlaying ? 'ph:pause-thin' : 'ph:play-thin'"
                class="w-8 h-8"
                :class="{ 'ml-1': !isPlaying }"
              />
            </button>
          </div>

          <p
            class="text-slate-400 text-sm tracking-[0.3em] mb-12 h-6 transition-opacity"
            :class="isPlaying ? 'opacity-100' : 'opacity-40'"
          >
            {{ isPlaying ? '闭上眼睛，跟随白噪音的频率...' : '已暂停' }}
          </p>

          <button
            @click="phase = 'post-test'"
            class="text-xs text-slate-500 tracking-[0.2em] border-b border-slate-700 pb-1 hover:text-slate-300 transition-colors"
          >
            提前结束疗愈
          </button>
        </div>

        <div
          v-else-if="phase === 'post-test'"
          class="w-full flex flex-col items-center text-center"
        >
          <Icon icon="ph:drop-thin" class="w-12 h-12 text-blue-300 mb-6" />
          <h2 class="text-2xl tracking-widest mb-4 text-white">欢迎回来</h2>
          <p class="text-slate-400 text-sm tracking-[0.2em] mb-12">现在的感觉如何？</p>

          <div class="w-full px-4 mb-8">
            <input
              type="range"
              min="1"
              max="10"
              v-model="postStress"
              class="w-full h-1 bg-slate-700 rounded-full appearance-none outline-none custom-slider"
            />
            <div class="flex justify-between text-xs text-slate-500 tracking-widest mt-4">
              <span>平静 (1)</span>
              <span class="text-white text-lg font-bold">{{ postStress }}</span>
              <span>紧绷 (10)</span>
            </div>
          </div>

          <button
            @click="finishHealing"
            class="px-8 py-3 bg-blue-500/20 border border-blue-400/50 text-blue-200 rounded-full text-sm tracking-[0.2em] hover:bg-blue-500/30 transition-all active:scale-95"
          >
            记录并封存
          </button>
        </div>

        <div v-else-if="phase === 'result'" class="w-full flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <span class="text-3xl font-bold text-blue-300">{{
              stressDelta > 0 ? `-${stressDelta}` : stressDelta
            }}</span>
          </div>
          <h2 class="text-xl tracking-widest mb-4 text-white">情绪已平复</h2>
          <p class="text-slate-400 text-sm tracking-[0.15em] leading-loose">
            本次疗愈让你的压力值降低了 {{ stressDelta > 0 ? stressDelta : 0 }} 分。<br />
            这些数据已悄悄存入你的情绪档案。
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['close'])

type Phase = 'pre-test' | 'meditating' | 'post-test' | 'result'
const phase = ref<Phase>('pre-test')

const preStress = ref(7)
const postStress = ref(4)
const isPlaying = ref(true)

// 计算压力差值 (Delta数据)
const stressDelta = computed(() => preStress.value - postStress.value)

const finishHealing = () => {
  phase.value = 'result'

  // 模拟数据写入全局状态库的延迟
  setTimeout(() => {
    emit('close')
  }, 3500)
}
</script>

<style scoped>
.font-serif {
  font-family: 'Source Han Serif SC', 'SimSun', serif;
}

/* 渐隐滑动切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 呼吸光圈动画 */
@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
.animate-ripple {
  animation: ripple 4.5s infinite cubic-bezier(0.21, 0.53, 0.56, 0.8);
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1) translate(-50%, -50%);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1) translate(-45%, -45%);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}

/* 自定义原生滑块样式 (极简风格) */
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  transition: transform 0.2s;
}
.custom-slider::-webkit-slider-thumb:active {
  transform: scale(1.3);
}
</style>
