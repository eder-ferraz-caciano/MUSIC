<script setup lang="ts">
import { useProgressStore } from '../store/progress'
import { useRouter } from 'vue-router'
import { PlayCircle, CheckCircle, BookOpen } from 'lucide-vue-next'
import TopNav from '../components/TopNav.vue'

const store = useProgressStore()
const router = useRouter()

const user = store.userName

if (!user) {
  router.push('/welcome')
}

const modules = [
  { id: 'intro', title: 'Introdução', description: 'O Básico do Instrumento e Teoria', route: '/lesson/intro' },
  { id: 'chords', title: 'Formação de Acordes', description: 'Acordes Básicos e Avançados', route: '/lesson/chords' },
  { id: 'scales', title: 'Escalas Musicais', description: 'Mapeando o braço da Guitarra', route: '/lesson/scales' }
]

</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans relative">
    <TopNav />

    <!-- Main Content -->
    <main class="w-[85%] mx-auto py-12 px-4 sm:px-0">
      <h2 class="text-2xl font-bold mb-8 text-zinc-200">Sua Trilha de Aprendizado</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="mod in modules"
          :key="mod.id"
          class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)] group relative overflow-hidden"
        >
          <!-- Complete Status -->
          <div v-if="store.isLessonComplete(mod.id)" class="absolute top-4 right-4 text-green-400 text-sm flex items-center gap-1 font-medium bg-green-400/10 px-3 py-1 rounded-full">
            <CheckCircle class="w-4 h-4" />
            <span>Concluído</span>
          </div>

          <div class="mt-4">
            <h3 class="text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">{{ mod.title }}</h3>
            <p class="text-zinc-500 mt-2 min-h-12">{{ mod.description }}</p>

            <button
              @click="router.push(mod.route)"
              class="mt-6 flex items-center gap-2 font-semibold text-sm transition-all text-zinc-300 hover:text-white"
            >
              <span v-if="store.isLessonComplete(mod.id)">Revisar Módulo</span>
              <span v-else>Iniciar Módulo</span>
              <PlayCircle class="w-5 h-5 text-purple-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Reference section -->
      <h2 class="text-2xl font-bold mt-16 mb-8 text-zinc-200">Referência</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <div
          class="bg-gradient-to-br from-purple-600/10 via-zinc-900 to-zinc-900 border border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/70 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)] group relative overflow-hidden cursor-pointer"
          @click="router.push('/dictionary')"
        >
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <BookOpen class="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">Dicionário de Acordes</h3>
                <p class="text-xs text-zinc-500">Consulte a qualquer momento</p>
              </div>
            </div>
            <p class="text-zinc-400 text-sm mb-4">
              165+ acordes (tríades, slash, power, 7ª, jazz, dissonantes) e
              55 progressões em 9 categorias — pop, blues, jazz, brasileira, funk, modal, reggae e mais.
            </p>
            <button class="flex items-center gap-2 font-semibold text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
              Abrir Dicionário
              <PlayCircle class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>
