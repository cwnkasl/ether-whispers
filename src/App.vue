<template>
  <div
    class="h-screen w-screen overflow-hidden overscroll-none fixed inset-0 font-serif bg-[#FEF9E7]"
  >
    <router-view v-slot="{ Component }">
      <transition name="whisper" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <div class="fixed top-8 left-8 z-50">
      <button
        @click="showUserMenu = !showUserMenu"
        class="p-3 bg-white/60 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/80"
        :class="{ 'bg-white shadow-lg scale-105': showUserMenu }"
      >
        <Icon
          icon="ph:cat-thin"
          class="w-8 h-8 transition-colors duration-300"
          :class="showUserMenu ? 'text-black' : 'text-slate-600 group-hover:text-black'"
        />
      </button>

      <transition name="fade-slide-down">
        <div
          v-if="showUserMenu"
          class="absolute top-16 left-0 w-72 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/80 overflow-hidden p-6 flex flex-col gap-6"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold tracking-[0.2em] text-slate-800">自我档案</span>
            <button
              @click="showUserMenu = false"
              class="text-slate-400 hover:text-black transition-colors"
            >
              <Icon icon="ph:x-thin" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <div
              class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 focus-within:border-slate-300 focus-within:bg-white transition-all shadow-inner"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#FEF9E7] border border-orange-100 flex items-center justify-center shrink-0"
              >
                <Icon icon="ph:cat-thin" class="w-6 h-6 text-orange-400" />
              </div>
              <input
                type="text"
                v-model="userName"
                placeholder="在此输入你的昵称..."
                class="bg-transparent w-full outline-none text-sm tracking-widest text-slate-800 placeholder:text-slate-400 font-serif"
              />
            </div>
            <div
              class="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 focus-within:border-slate-300 focus-within:bg-white transition-all shadow-inner"
            >
              <Icon icon="ph:signature-thin" class="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                v-model="userSignature"
                placeholder="写下一句此刻的心境..."
                class="bg-transparent w-full outline-none text-xs tracking-widest text-slate-600 placeholder:text-slate-400 font-serif"
              />
            </div>
          </div>

          <div class="w-full h-px bg-slate-100"></div>

          <div class="flex flex-col gap-2.5">
            <span class="text-xs text-slate-400 tracking-widest mb-1 pl-1">疗愈探索</span>

            <button
              @click="openFeature('daily')"
              class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/80 text-orange-700 hover:bg-orange-100 transition-colors group border border-orange-100/50"
            >
              <div class="flex items-center gap-3">
                <Icon icon="ph:calendar-heart-thin" class="w-5 h-5" /><span
                  class="text-sm tracking-[0.15em] font-medium mr-[-0.15em]"
                  >今日推荐</span
                >
              </div>
              <Icon
                icon="ph:caret-right-thin"
                class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              @click="openFeature('ai')"
              class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 transition-colors group border border-indigo-100/50"
            >
              <div class="flex items-center gap-3">
                <Icon icon="ph:sparkle-thin" class="w-5 h-5" /><span
                  class="text-sm tracking-[0.15em] font-medium mr-[-0.15em]"
                  >灵犀倾听</span
                >
              </div>
              <Icon
                icon="ph:caret-right-thin"
                class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              @click="openFeature('meditation')"
              class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/80 text-teal-700 hover:bg-teal-100 transition-colors group border border-teal-100/50"
            >
              <div class="flex items-center gap-3">
                <Icon icon="ph:waves-thin" class="w-5 h-5" /><span
                  class="text-sm tracking-[0.15em] font-medium mr-[-0.15em]"
                  >声学冥想</span
                >
              </div>
              <Icon
                icon="ph:caret-right-thin"
                class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              @click="openFeature('support')"
              class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/80 text-rose-700 hover:bg-rose-100 transition-colors group border border-rose-100/50"
            >
              <div class="flex items-center gap-3">
                <Icon icon="ph:users-three-thin" class="w-5 h-5" /><span
                  class="text-sm tracking-[0.15em] font-medium mr-[-0.15em]"
                  >专业支援</span
                >
              </div>
              <Icon
                icon="ph:caret-right-thin"
                class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </transition>
    </div>

    <PostmanFAB />
    <button
      @click="showLetter = true"
      class="fixed bottom-[6.5rem] right-8 z-40 w-14 h-14 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black transition-all duration-300 hover:scale-110 active:scale-95 group"
    >
      <Icon
        icon="ph:mailbox-thin"
        class="w-7 h-7 transition-transform group-hover:-translate-y-1"
      />
    </button>

    <LetterOpener v-if="showLetter" @close="showLetter = false" />
    <DailyResonance
      v-if="showDaily"
      @close="showDaily = false"
      @go-meditation="triggerMeditation"
      @go-ai="triggerAI"
    />
    <CompanionAI v-if="showAI" @close="showAI = false" />
    <MeditationHealing v-if="showMeditation" @close="showMeditation = false" />

    <ProfessionalSupport v-if="showSupport" @close="showSupport = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

import PostmanFAB from './components/PostmanFAB.vue'
import LetterOpener from './components/LetterOpener.vue'
import DailyResonance from './components/DailyResonance.vue'
import CompanionAI from './components/CompanionAI.vue'
import MeditationHealing from './components/MeditationHealing.vue'
import ProfessionalSupport from './components/ProfessionalSupport.vue' // 引入新组件

const showUserMenu = ref(false)
const userName = ref('匿名旅人')
const userSignature = ref('')

const showLetter = ref(false)
const showDaily = ref(false)
const showAI = ref(false)
const showMeditation = ref(false)
const showSupport = ref(false) // 新增状态

const openFeature = (type: string) => {
  showUserMenu.value = false
  setTimeout(() => {
    if (type === 'daily') showDaily.value = true
    if (type === 'ai') showAI.value = true
    if (type === 'meditation') showMeditation.value = true
    if (type === 'support') showSupport.value = true // 绑定跳转逻辑
  }, 300)
}

const triggerMeditation = () => {
  showDaily.value = false
  setTimeout(() => {
    showMeditation.value = true
  }, 300)
}
const triggerAI = () => {
  showDaily.value = false
  setTimeout(() => {
    showAI.value = true
  }, 300)
}
</script>

<style>
.font-serif {
  font-family: 'Source Han Serif SC', 'SimSun', serif;
}
.whisper-enter-active,
.whisper-leave-active {
  transition: opacity 0.6s ease;
}
.whisper-enter-from,
.whisper-leave-to {
  opacity: 0;
}
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
  transform-origin: top left;
}
</style>
