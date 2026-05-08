<template>
  <div class="fixed inset-0 z-[60] bg-[#FCFAF5] flex flex-col font-serif overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out z-0"
      :class="isListeningDeeply ? 'opacity-100' : 'opacity-0'"
      style="
        background: radial-gradient(
          circle at 50% 80%,
          rgba(186, 230, 253, 0.15) 0%,
          transparent 60%
        );
      "
    ></div>

    <header
      class="flex justify-between items-center px-6 py-6 relative z-50 bg-gradient-to-b from-[#FCFAF5] via-[#FCFAF5]/90 to-transparent"
    >
      <button
        @click="$emit('close')"
        class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-full shadow-sm hover:bg-white text-slate-600 hover:text-black transition-all active:scale-95"
      >
        <Icon icon="ph:arrow-left-thin" class="w-5 h-5" />
        <span class="text-xs tracking-widest font-medium">返回</span>
      </button>

      <div class="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <span class="text-sm font-bold text-slate-800 tracking-[0.3em]">灵犀</span>
        <span class="text-[10px] text-slate-400 tracking-widest mt-1">24小时的情绪守望者</span>
      </div>

      <div class="w-[88px]"></div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 pb-32 hide-scrollbar relative z-10" ref="chatContainer">
      <div class="max-w-2xl mx-auto flex flex-col gap-10 pt-4">
        <transition-group name="fade-up">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex flex-col"
            :class="msg.role === 'user' ? 'items-end' : 'items-start'"
          >
            <div v-if="msg.role === 'ai'" class="max-w-[85%] pr-8">
              <Icon icon="ph:sparkle-thin" class="w-5 h-5 text-indigo-300 mb-3" />
              <p
                class="text-slate-700 text-[15px] leading-[32px] tracking-[0.1em] text-justify whitespace-pre-wrap"
                v-html="msg.content"
              ></p>
            </div>

            <div v-else class="max-w-[85%] pl-8 flex flex-col items-end">
              <p
                class="text-slate-500 text-[15px] leading-[32px] tracking-[0.1em] text-right whitespace-pre-wrap"
              >
                {{ msg.content }}
              </p>
              <div class="w-6 h-px bg-slate-200 mt-4"></div>
            </div>
          </div>
        </transition-group>

        <div v-if="isAiTyping" class="flex items-center gap-2 text-slate-400 pl-2">
          <Icon icon="ph:pencil-simple-thin" class="w-4 h-4 animate-bounce" />
          <span class="text-xs tracking-widest opacity-60">灵犀正在感知...</span>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FCFAF5] via-[#FCFAF5] to-transparent z-40"
    >
      <div
        class="max-w-2xl mx-auto relative flex items-end bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-2 pl-6"
      >
        <textarea
          v-model="inputText"
          @keydown.enter.prevent="sendMessage"
          placeholder="任何情绪，都可以向我倾诉..."
          class="flex-1 max-h-32 bg-transparent resize-none outline-none text-slate-700 text-sm leading-relaxed tracking-widest placeholder:text-slate-300 py-3 hide-scrollbar"
          rows="1"
        ></textarea>
        <button
          @click="sendMessage"
          class="w-10 h-10 shrink-0 ml-3 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center transition-all hover:bg-indigo-100 active:scale-95 shadow-sm border border-indigo-100/50"
          :class="{ 'opacity-30 pointer-events-none grayscale': !inputText.trim() }"
        >
          <Icon icon="ph:paper-plane-tilt-thin" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['close'])

const messages = ref([
  {
    role: 'ai',
    content: '今天的天空是灰色的，你的心境也是如此吗？\n无论发生什么，我都在这里听你说。',
  },
])

const inputText = ref('')
const isAiTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// 光晕判定逻辑
const isListeningDeeply = computed(() => inputText.value.length > 15)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isAiTyping.value) return

  const userMsg = inputText.value
  messages.value.push({ role: 'user', content: userMsg })
  inputText.value = ''
  scrollToBottom()

  isAiTyping.value = true
  scrollToBottom()

  // 模拟网络延迟和 AI 打字机流式输出 (这里未来可替换为真实的 AI API 调用)
  setTimeout(() => {
    isAiTyping.value = false
    const aiResponseFull =
      '我能感觉到这段文字背后的重量。\n不必强求自己立刻好起来，允许自己在此刻脆弱，这也是一种勇敢。'
    const aiMsgIndex = messages.value.push({ role: 'ai', content: '' }) - 1

    let charIndex = 0
    const typeWriter = setInterval(() => {
      if (charIndex < aiResponseFull.length) {
        messages.value[aiMsgIndex].content += aiResponseFull.charAt(charIndex)
        charIndex++
        scrollToBottom()
      } else {
        clearInterval(typeWriter)
      }
    }, 60)
  }, 1500)
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

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
