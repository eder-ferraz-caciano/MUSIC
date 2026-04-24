<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '../store/progress'
import { BookOpen, LayoutDashboard, GraduationCap, Music2, Grid3x3 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useProgressStore()

const NAV = [
    { label: 'Dicionário',  route: '/',               icon: BookOpen,        match: ['/', '/dictionary'] },
    { label: 'Painel',      route: '/dashboard',      icon: LayoutDashboard, match: ['/dashboard'] },
    { label: 'Introdução',  route: '/lesson/intro',   icon: GraduationCap,   match: ['/lesson/intro'] },
    { label: 'Acordes',     route: '/lesson/chords',  icon: Music2,          match: ['/lesson/chords'] },
    { label: 'Escalas',     route: '/lesson/scales',  icon: Grid3x3,         match: ['/lesson/scales'] },
]

const isActive = (match: string[]) => match.includes(route.path)

const goPainel = () => router.push(store.userName ? '/dashboard' : '/welcome')

const userInitial = computed(() =>
    store.userName ? store.userName.charAt(0).toUpperCase() : ''
)
</script>

<template>
  <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex items-center gap-3 flex-wrap">
      <button @click="router.push('/')" class="flex items-center gap-2 shrink-0">
        <BookOpen class="w-6 h-6 text-purple-400" />
        <h1 class="text-lg sm:text-xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Master Strings
        </h1>
      </button>

      <nav class="flex items-center gap-1 flex-wrap">
        <button v-for="n in NAV" :key="n.route"
          @click="n.route === '/dashboard' ? goPainel() : router.push(n.route)"
          class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          :class="isActive(n.match)
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'">
          <component :is="n.icon" class="w-4 h-4" />
          <span class="hidden md:inline">{{ n.label }}</span>
        </button>
      </nav>

      <div v-if="store.userName" class="ml-auto flex items-center gap-2 shrink-0">
        <span class="hidden sm:block text-xs text-zinc-400">{{ store.userName }}</span>
        <span class="block bg-zinc-800 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold text-zinc-300">
          {{ userInitial }}
        </span>
      </div>
      <button v-else
        @click="router.push('/welcome')"
        class="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500 text-white hover:bg-purple-400 transition-all">
        Entrar
      </button>
    </div>
  </header>
</template>
