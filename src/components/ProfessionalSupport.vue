<template>
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md font-serif touch-none"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-[90vw] max-w-md h-[80vh] bg-[#FCFAF5] rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all"
    >
      <div
        class="px-8 py-6 flex justify-between items-center border-b border-slate-200/60 bg-white/50 backdrop-blur-sm z-10"
      >
        <div>
          <h2 class="text-xl font-bold text-slate-800 tracking-widest mb-1">专业心理支援</h2>
          <p class="text-xs text-slate-400 tracking-[0.15em]">真实的温度，接住你的坠落</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
        >
          <Icon icon="ph:x-thin" class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar p-6">
        <div
          class="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-100 relative overflow-hidden group cursor-pointer hover:bg-rose-100/80 transition-colors"
        >
          <Icon
            icon="ph:phone-call-thin"
            class="absolute -right-4 -bottom-4 w-24 h-24 text-rose-600/10 transition-transform group-hover:scale-110 group-hover:-rotate-12"
          />
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span class="text-sm font-bold text-rose-700 tracking-widest"
                >24小时危机干预热线</span
              >
            </div>
            <p class="text-xs text-rose-600/80 tracking-widest leading-relaxed mb-4">
              如果你此刻感到极度绝望或有伤害自己的念头，请立刻拨打全国免费心理危机援助热线：<br />
              <strong class="text-rose-700 text-sm mt-1 block tracking-[0.1em]"
                >400-161-9995</strong
              >
            </p>
            <button
              class="px-4 py-1.5 bg-rose-500 text-white rounded-full text-xs tracking-widest shadow-sm hover:bg-rose-600 transition-colors active:scale-95"
            >
              立即呼叫
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3 mb-6">
          <div class="h-px flex-1 bg-slate-200"></div>
          <span class="text-xs text-slate-400 tracking-[0.2em]">在线专业咨询师</span>
          <div class="h-px flex-1 bg-slate-200"></div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            v-for="counselor in counselors"
            :key="counselor.id"
            class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex gap-4">
              <div
                class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden"
              >
                <img
                  v-if="counselor.avatar"
                  :src="counselor.avatar"
                  class="w-full h-full object-cover grayscale opacity-80"
                />
                <Icon v-else icon="ph:user-thin" class="w-6 h-6 text-slate-400" />
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-bold text-slate-800 tracking-widest">{{ counselor.name }}</h3>
                  <span
                    class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-sm tracking-widest"
                  >
                    {{ counselor.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 tracking-widest mb-3">{{ counselor.title }}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in counselor.tags"
                    :key="tag"
                    class="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 tracking-widest"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-400 tracking-widest"
                    >¥{{ counselor.price }}/50分钟</span
                  >
                  <button
                    @click="bookSession(counselor)"
                    class="px-5 py-2 bg-black text-white rounded-full text-xs font-medium tracking-[0.1em] hover:bg-slate-800 transition-colors active:scale-95"
                    :class="{
                      'bg-slate-200 text-slate-400 pointer-events-none':
                        counselor.status === '咨询中',
                    }"
                  >
                    {{ counselor.status === '空闲' ? '预约连线' : '稍后重试' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="fade-toast">
        <div
          v-if="toast.show"
          class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-white/20 backdrop-blur-[2px]"
        >
          <div
            class="bg-white/95 backdrop-blur-xl px-10 py-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center gap-5 text-center transform transition-all"
          >
            <Icon icon="ph:paper-plane-tilt-thin" class="w-12 h-12 text-slate-800 animate-pulse" />
            <p class="font-medium text-slate-800 tracking-[0.2em] text-sm leading-loose">
              已向 {{ toast.counselorName }} 发送请求<br />
              <span class="text-xs text-slate-500 block mt-1 tracking-widest opacity-80"
                >请稍候，真实的温度将很快回应你</span
              >
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

defineEmits(['close'])

const counselors = ref([
  {
    id: 1,
    name: '林晓书',
    title: '国家二级心理咨询师 / 叙事流派',
    status: '空闲',
    tags: ['同辈焦虑', '职场压力', '自我认同'],
    price: '299',
    avatar: '',
  },
  {
    id: 2,
    name: '苏叶',
    title: '临床心理学硕士 / CBT认知行为',
    status: '咨询中',
    tags: ['重度抑郁', '亲密关系', '睡眠障碍'],
    price: '399',
    avatar: '',
  },
  {
    id: 3,
    name: '陈清风',
    title: '资深心理社工 / 人本主义',
    status: '空闲',
    tags: ['原生家庭', '丧失与哀伤', '情绪调节'],
    price: '199',
    avatar: '',
  },
])

// 沉浸式提示状态管理
const toast = ref({ show: false, counselorName: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const bookSession = (counselor: any) => {
  toast.value = {
    show: true,
    counselorName: counselor.name,
  }

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2500) // 2.5秒后平滑消失
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

/* 提示弹窗的平滑淡入淡出与缩放动画 */
.fade-toast-enter-active,
.fade-toast-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.fade-toast-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.fade-toast-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
