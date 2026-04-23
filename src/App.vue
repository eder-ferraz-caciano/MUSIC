<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { audio, PRESET_KEYS, PRESET_META } from './utils/audio'
import type { SoundPreset } from './utils/audio'

const open = ref(false)

const select = (preset: SoundPreset) => {
  audio.setPreset(preset)
  open.value = false
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-purple-500/30">
    <RouterView />

    <!-- Floating sound preset selector -->
    <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      <!-- Dropdown options -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div v-if="open" class="flex flex-col gap-1.5 mb-1">
          <button
            v-for="key in PRESET_KEYS"
            :key="key"
            @click="select(key)"
            class="flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xl"
            :class="audio.currentPreset.value === key
              ? 'bg-purple-500 text-white shadow-purple-500/40 ring-1 ring-purple-400'
              : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'"
          >
            <span class="text-sm">{{ PRESET_META[key].icon }}</span>
            {{ PRESET_META[key].label }}
          </button>
        </div>
      </transition>

      <!-- Toggle button showing current preset -->
      <button
        @click="open = !open"
        class="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl transition-all"
        :class="open
          ? 'bg-purple-500 text-white shadow-purple-500/40 ring-1 ring-purple-400'
          : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'"
        title="Mudar som da guitarra"
      >
        <span class="text-sm">{{ PRESET_META[audio.currentPreset.value].icon }}</span>
        <span>{{ PRESET_META[audio.currentPreset.value].label }}</span>
        <svg
          class="w-3 h-3 transition-transform duration-200"
          :class="open ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </div>
  </div>
</template>
