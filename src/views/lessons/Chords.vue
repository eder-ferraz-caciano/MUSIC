<script setup lang="ts">
import { ref, computed } from 'vue'
import Fretboard from '../../components/Fretboard.vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../../store/progress'
import { ChevronLeft, Play, Music, CheckCircle } from 'lucide-vue-next'
import { audio } from '../../utils/audio'
import { chordDefinitions } from '../../data/chords'

const router = useRouter()
const store = useProgressStore()

const chordKeys = Object.keys(chordDefinitions)
const currentChord = ref<string>(chordKeys[0]!)
const shapeIdx = ref(0)
const playingNote = ref<{ string: number, fret: number } | null>(null)
const playSpeedMs = ref(250)

const activeDef = computed(() => chordDefinitions[currentChord.value]!)
const activeShape = computed(() => activeDef.value?.shapes[shapeIdx.value])

const selectChord = (key: string) => {
  currentChord.value = key
  shapeIdx.value = 0
}

const maxFret = computed(() => {
  if (!activeShape.value) return 15
  const m = Math.max(...activeShape.value.notes.map((n: any) => n.fret))
  return Math.max(m + 2, 12)
})

const playCurrentChord = async () => {
  await audio.init()
  if (!activeShape.value) return
  const notes = [...activeShape.value.notes].sort((a, b) => b.string - a.string)
  let t = 0
  for (const n of notes) {
    setTimeout(() => {
      playingNote.value = { string: n.string, fret: n.fret }
      const toneNote = audio.getFretNote(n.string, n.fret)
      audio.playNote(toneNote, '8n')
      setTimeout(() => {
        if (playingNote.value?.string === n.string && playingNote.value?.fret === n.fret) {
          playingNote.value = null
        }
      }, playSpeedMs.value - 20)
    }, t * playSpeedMs.value)
    t++
  }
}

const completeLesson = () => {
  store.markLessonComplete('chords')
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 p-4 sm:p-12 pb-24 font-sans w-[85%] mx-auto">
    <button @click="router.push('/dashboard')" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
      <ChevronLeft class="w-5 h-5" />
      Voltar
    </button>

    <h1 class="text-3xl sm:text-4xl font-black mb-4 flex items-center gap-3">
      <Music class="w-8 h-8 text-amber-500" /> Formação de Acordes e Variações
    </h1>
    <p class="text-zinc-400 max-w-3xl mb-10">
      Um acorde é a execução de três ou mais notas simultâneas (Tônica + Terça + Quinta). 
      Cada acorde pode ser tocado em <strong>múltiplos shapes (CAGED)</strong> ao longo do braço inteiro!
      Selecione o acorde e navegue pelos shapes.
    </p>

    <div class="grid lg:grid-cols-4 gap-6 mb-12">
      
      <!-- Chord Selector Sidebar -->
      <div class="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 class="font-bold text-amber-500 mb-3 tracking-wide uppercase text-xs">Biblioteca CAGED</h3>
        <div class="flex flex-col gap-1 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
          <button 
            v-for="(data, key) in chordDefinitions" 
            :key="key"
            @click="selectChord(key as string)"
            class="text-left px-3 py-2.5 rounded-lg border transition-all text-xs font-bold"
            :class="currentChord === key ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-white'"
          >
            {{ data.name }}
          </button>
        </div>
      </div>

      <!-- Main Display -->
      <div v-if="activeDef" class="lg:col-span-3 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
        
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="relative z-10">
          <!-- Header -->
          <h2 class="text-2xl font-black mb-2">{{ activeDef.name }}</h2>
          <p class="text-zinc-400 mb-4 border-l-2 border-amber-500 pl-4 py-1 bg-zinc-950/30 text-sm font-medium">
            {{ activeDef.desc }}
          </p>

          <!-- Shape Selector -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-bold text-zinc-500 uppercase">Shapes no braço</span>
              <span class="text-xs text-zinc-600">({{ activeDef.shapes.length }} posições)</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="(shape, idx) in activeDef.shapes" :key="idx"
                @click="shapeIdx = idx"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                :class="shapeIdx === idx ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-zinc-950 text-zinc-400 hover:text-white'"
              >{{ shape.name }}</button>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <div class="flex items-center gap-2 bg-zinc-800/50 rounded-full px-4 py-2 border border-zinc-700">
              <span class="text-xs text-zinc-400 font-bold uppercase hidden sm:inline">Velocidade</span>
              <select v-model="playSpeedMs" class="bg-transparent text-sm font-bold text-amber-500 outline-none cursor-pointer">
                <option :value="50">Rápido (Strum)</option>
                <option :value="250">Normal</option>
                <option :value="600">Lento (Didático)</option>
              </select>
            </div>
            <button 
              @click="playCurrentChord"
              class="flex items-center gap-2 text-sm text-yellow-950 bg-amber-500 hover:bg-amber-400 px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105"
            >
              <Play fill="currentColor" class="w-4 h-4" />
              Ouvir e Ver
            </button>
          </div>

          <!-- Shape description -->
          <p v-if="activeShape" class="text-xs text-zinc-500 mb-4 italic">{{ activeShape.desc }}</p>
          
          <!-- Fretboard -->
          <Fretboard v-if="activeShape" :activeNotes="activeShape.notes" :frets="maxFret" :playingNote="playingNote" :interactiveNotes="true" />

          <p class="mt-6 text-zinc-500 text-xs">
            🟣 Tônica (Raiz) | 🔵 Terça | ⚫ Quinta | 🟡 Sétima.
            Clique em qualquer casa para ouvir a nota individualmente!
          </p>
        </div>
      </div>
    </div>

    <!-- Conclusion Button -->
    <div class="flex justify-end">
      <button 
        @click="completeLesson"
        class="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all"
      >
        <CheckCircle class="w-5 h-5" />
        Concluir Acordes
      </button>
    </div>

  </div>
</template>
