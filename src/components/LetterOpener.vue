<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md font-serif touch-none"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-[90vw] max-w-md h-[70vh] select-none touch-none"
      :class="[
        isOpened ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        { 'scale-105': isOpened },
      ]"
      @pointerdown="startDrag"
      @pointermove="onDrag"
      @pointerup="endDrag"
      @pointerleave="endDrag"
      @pointercancel="endDrag"
    >
      <div
        class="absolute inset-2 rounded-xl shadow-inner overflow-hidden transition-all duration-[2000ms] z-10 bg-[#FDFBF7]"
        :style="{ opacity: isOpened && !isSending ? 1 : isSending ? 0 : offsetY / 150 }"
        :class="{ 'scale-95': isSending }"
      >
        <div
          class="absolute inset-0 opacity-40 pointer-events-none z-0"
          style="
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 100% 32px;
          "
        ></div>

        <transition name="fade" mode="out-in">
          <div v-if="!isReplying" class="w-full h-full p-8 flex flex-col relative z-10">
            <div class="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
              <span class="text-xs text-slate-400 tracking-widest">来自某颗匿名星球</span>
              <span class="text-sm font-bold text-slate-800 tracking-widest">{{
                currentLetter.date
              }}</span>
            </div>

            <div class="flex-1 overflow-y-auto hide-scrollbar">
              <p
                class="text-slate-700 text-[15px] leading-[32px] tracking-[0.15em] text-justify whitespace-pre-wrap"
              >
                {{ currentLetter.content }}
              </p>
            </div>

            <div
              class="pt-6 mt-4 flex justify-between items-center bg-gradient-to-t from-[#FDFBF7] to-transparent"
            >
              <div
                class="px-4 py-1.5 bg-slate-100/80 rounded-full text-xs text-slate-500 tracking-widest border border-slate-200/50"
              >
                #{{ currentLetter.topicTag }}
              </div>

              <button
                @click="startReply"
                class="flex items-center justify-center px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-md"
              >
                <Icon icon="ph:pen-nib-line-thin" class="w-[18px] h-[18px] mr-2" />
                <span class="tracking-[0.2em] pl-[0.2em]">提笔回信</span>
              </button>
            </div>
          </div>

          <div v-else class="w-full h-full p-8 flex flex-col relative z-10">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm font-bold text-slate-800 tracking-widest"
                >致 匿名星球的旅人</span
              >
              <button
                @click="isReplying = false"
                class="text-slate-400 hover:text-black transition-colors"
                :class="{ 'pointer-events-none opacity-0': isSending }"
              >
                <Icon icon="ph:x-thin" class="w-5 h-5" />
              </button>
            </div>

            <div class="mb-4 p-3 bg-slate-100/50 rounded-lg border-l-2 border-slate-300">
              <p class="text-xs text-slate-500 tracking-widest line-clamp-2 leading-relaxed">
                "{{ currentLetter.content }}"
              </p>
            </div>

            <textarea
              v-model="replyContent"
              placeholder="落笔写下你的回应，文字自有温度..."
              :readonly="isSending"
              class="flex-1 w-full bg-transparent resize-none outline-none text-slate-700 text-[15px] leading-[32px] tracking-[0.15em] placeholder:text-slate-300 hide-scrollbar"
            ></textarea>

            <div class="pt-4 flex justify-end">
              <button
                @click="sendReply"
                class="flex items-center justify-center px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md"
                :class="{
                  'opacity-0 pointer-events-none translate-y-4': isSending,
                  'opacity-50 pointer-events-none': !replyContent.trim() && !isSending,
                  'active:scale-95': replyContent.trim() && !isSending,
                }"
              >
                <Icon icon="ph:paper-plane-tilt-thin" class="w-[18px] h-[18px] mr-2" />
                <span class="tracking-[0.2em] pl-[0.2em]">封缄寄出</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <transition name="frame-plane">
        <div
          v-if="isSending"
          class="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-2xl"
        >
          <Icon
            icon="ph:paper-plane-tilt-thin"
            class="w-24 h-24 text-black/85 frame-paper-plane-actor"
          />
        </div>
      </transition>

      <div
        class="absolute inset-0 bg-[#F9F7F2] rounded-2xl shadow-xl z-30 transition-all duration-[2000ms] pointer-events-none"
        :style="{
          clipPath: 'polygon(0 0, 100% 0, 100% 51%, 0 51%)',
          transform: isOpened
            ? 'translateY(-120%) rotate(-5deg)'
            : `translateY(${-offsetY * 0.2}px)`,
          transitionDuration: isDragging ? '0ms' : isSending ? '2000ms' : '700ms',
          opacity: isSending ? 0 : 1,
        }"
      >
        <div
          class="absolute top-8 right-8 w-14 h-18 bg-white/60 border-2 border-dashed border-slate-300 flex items-center justify-center rotate-3"
        >
          <Icon icon="ph:envelope-simple-thin" class="w-8 h-8 text-slate-400" />
        </div>
      </div>

      <div
        class="absolute inset-0 bg-[#F9F7F2] rounded-2xl shadow-xl z-20 transition-all duration-[2000ms] pointer-events-none"
        :style="{
          clipPath: 'polygon(0 51%, 100% 51%, 100% 100%, 0 100%)',
          transform: isOpened ? 'translateY(120%) rotate(5deg)' : `translateY(${offsetY}px)`,
          transitionDuration: isDragging ? '0ms' : isSending ? '2000ms' : '700ms',
          opacity: isSending ? 0 : 1,
        }"
      >
        <div
          class="absolute top-0 left-0 right-0 h-32 flex flex-col items-center justify-center -translate-y-16 transition-opacity duration-300"
          :class="isOpened || isDragging ? 'opacity-0' : 'opacity-100'"
        >
          <div class="w-20 h-1.5 bg-slate-400/30 rounded-full mb-3"></div>
          <span class="text-[10px] text-slate-400 tracking-[0.6em] uppercase"
            >向下划动 拆封见信</span
          >
        </div>
      </div>
    </div>

    <button
      @click="$emit('close')"
      class="absolute top-8 left-10 p-3 transition-all z-[60]"
      :class="isSending ? 'opacity-0 pointer-events-none' : 'text-white/50 hover:text-white'"
    >
      <Icon icon="ph:arrow-left-thin" class="w-10 h-10" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['close'])

const currentLetter = ref({
  id: 'L-1024',
  date: '五月八日 夜',
  topicTag: '同辈焦虑',
  content:
    '最近总觉得喘不过气。看着朋友圈里身边的人都在按部就班地向前走，有人拿到心仪的Offer，有人遇到合适的人，而我好像还困在原地，什么都做不好。\n\n这种深深的无力感，不知道能和谁说。今天下班路上看着万家灯火，突然觉得这座城市很大，但没有一盏灯是为我亮的。如果你也曾经历过这样觉得被世界抛弃的瞬间，可以告诉我你是怎么走出来的吗？',
})

const isOpened = ref(false)
const isDragging = ref(false)
const offsetY = ref(0)
let startY = 0

const startDrag = (e: PointerEvent) => {
  if (isOpened.value) return
  isDragging.value = true
  startY = e.clientY
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
}

const onDrag = (e: PointerEvent) => {
  if (!isDragging.value || isOpened.value) return
  const diff = e.clientY - startY
  if (diff > 0) {
    offsetY.value = diff * 0.4
    if (diff > 100) triggerOpen()
  }
}

const endDrag = (e: PointerEvent) => {
  if (isOpened.value) return
  isDragging.value = false
  offsetY.value = 0
  startY = 0
  const el = e.currentTarget as HTMLElement
  if (el.hasPointerCapture(e.pointerId)) {
    el.releasePointerCapture(e.pointerId)
  }
}

const triggerOpen = () => {
  isDragging.value = false
  isOpened.value = true
  offsetY.value = 0
}

const isReplying = ref(false)
const replyContent = ref('')
const isSending = ref(false)

const startReply = () => {
  isReplying.value = true
}

const sendReply = () => {
  if (!replyContent.value.trim() || isSending.value) return
  isSending.value = true
  setTimeout(() => {
    emit('close')
  }, 2500)
}
</script>

<style scoped>
.font-serif {
  font-family: 'Source Han Serif SC', 'SimSun', serif;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
