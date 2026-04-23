<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Fretboard from '../../components/Fretboard.vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../../store/progress'
import { ChevronLeft, CheckCircle, Play } from 'lucide-vue-next'
import { audio } from '../../utils/audio'
import { buildScalesForRoot, ROOT_NOTES, scaleTemplateKeys } from '../../data/scales'

const router = useRouter()
const store = useProgressStore()

const rootNote = ref(9) // Default A (Lá)
const scaleType = ref<string>(scaleTemplateKeys[0]!)
const shapeIdx = ref(0)
const playingNote = ref<{ string: number, fret: number } | null>(null)
const playSpeedMs = ref(300)

// Regenerate scales when root changes
const scales = computed(() => buildScalesForRoot(rootNote.value))
const activeDef = computed(() => scales.value[scaleType.value]!)
const activeShape = computed(() => activeDef.value?.shapes[shapeIdx.value])

const selectedRootLabel = computed(() => ROOT_NOTES.find(r => r.value === rootNote.value)?.label ?? '')

const selectScale = (key: string) => {
  scaleType.value = key
  shapeIdx.value = 0
}

// Reset shape index when root changes
watch(rootNote, () => { shapeIdx.value = 0 })

const maxFret = computed(() => {
  if (!activeShape.value) return 15
  const m = Math.max(...activeShape.value.notes.map((n: any) => n.fret))
  return Math.max(m + 2, 12)
})

const playScaleSequence = async () => {
  await audio.init()
  if (!activeShape.value) return
  const notes = [...activeShape.value.notes].sort((a, b) => b.string !== a.string ? b.string - a.string : a.fret - b.fret)
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
  store.markLessonComplete('scales')
  router.push('/dashboard')
}

// ── Teoria de cada escala ─────────────────────────────────
interface ScaleTheory {
  formula: string       // graus da escala
  character: string     // adjetivos do som
  usedIn: string        // gêneros e contextos
  insight: string       // a lógica/segredo central da escala
}

const THEORY: Record<string, ScaleTheory> = {
  major_pentatonic: {
    formula: '1 – 2 – 3 – 5 – 6',
    character: 'Alegre · Melódico · Leve',
    usedIn: 'Pop, Country, Rock melódico, solos de Blues "feliz"',
    insight: 'A escala maior sem a 4ª e a 7ª — as duas notas que causam mais tensão. O resultado é puro melodia sem atrito. Toque sobre qualquer acorde maior ou dominante e vai soar bem.',
  },
  minor_pentatonic: {
    formula: '1 – b3 – 4 – 5 – b7',
    character: 'Escuro · Poderoso · Direto',
    usedIn: 'Rock, Blues, Metal, Hard Rock, Funk',
    insight: 'A escala mais usada no mundo para improvisar na guitarra. Remove a 2ª e a 6ª da menor natural, eliminando as notas mais "instáveis". Cinco notas, cinco shapes — decore os shapes de cor e o braço inteiro vira playground.',
  },
  blues: {
    formula: '1 – b3 – 4 – b5 – 5 – b7',
    character: 'Tenso · Expressivo · Choroso',
    usedIn: 'Blues, Jazz, Rock, Soul, R&B',
    insight: 'É a pentatônica menor com um único acréscimo: o b5 (tritono), chamado de "Blue Note". Essa nota fica entre o 4 e o 5, criando uma tensão intensa que "quer" resolver. Use-a como passagem ou bend — não como nota de pouso.',
  },
  major: {
    formula: '1 – 2 – 3 – 4 – 5 – 6 – 7',
    character: 'Alegre · Estável · Luminoso',
    usedIn: 'Pop, Rock, Sertanejo, Clássico, MPB',
    insight: 'A escala-mãe de toda harmonia ocidental. Padrão de tons e semitons: T-T-S-T-T-T-S. Todo acorde de uma tonalidade maior nasce dela. Domine os 5 shapes desta e você entende de onde todos os outros modos vêm.',
  },
  dorian: {
    formula: '1 – 2 – b3 – 4 – 5 – 6 – b7',
    character: 'Menor com esperança · Groovy · Sofisticado',
    usedIn: 'Jazz, Fusion, Rock Progressivo, Funk, Santana',
    insight: 'Pegue a escala menor natural e eleve a 6ª em um semitom. Esse único ajuste transforma um som sombrio em algo mais aberto e jazzístico. É o 2º modo da escala maior — em Dó maior, o Ré Dórico usa exatamente as mesmas notas.',
  },
  mixolydian: {
    formula: '1 – 2 – 3 – 4 – 5 – 6 – b7',
    character: 'Maior com garra · Blues · Dominante',
    usedIn: 'Blues, Rock clássico, Funk, sobre acordes dominantes (7)',
    insight: 'A escala maior com a 7ª abaixada. Essa mudança cria a tensão do acorde dominante (1-3-5-b7). Use Mixolídio sempre que o acorde do momento for um X7 (dominante). Hendrix, Clapton e Stevie Ray Vaughan vivem nela.',
  },
  phrygian: {
    formula: '1 – b2 – b3 – 4 – 5 – b6 – b7',
    character: 'Sombrio · Exótico · Dramático',
    usedIn: 'Metal, Flamenco, Música árabe/espanhola, Thrash',
    insight: 'A assinatura do Frígio é o intervalo de semitom entre a tônica e a 2ª (b2). Esse meio-passo descendente cria imediata tensão e exotismo. É o 3º modo da escala maior. O riff de "Wherever I May Roam" (Metallica) é Frígio puro.',
  },
  lydian: {
    formula: '1 – 2 – 3 – #4 – 5 – 6 – 7',
    character: 'Etéreo · Mágico · Onírico',
    usedIn: 'Rock progressivo, Cinema (John Williams), Satriani, Steve Vai',
    insight: 'A escala maior com a 4ª elevada um semitom (#4). Essa nota cria um tritono acima da tônica, gerando tensão "suspensa" sem resolução imediata — o som que você associa a voo, magia ou épico. É o 4º modo da escala maior.',
  },
  minor: {
    formula: '1 – 2 – b3 – 4 – 5 – b6 – b7',
    character: 'Melancólico · Introspectivo · Sério',
    usedIn: 'Rock, Metal, Música clássica, Baladas',
    insight: 'A escala menor natural é o 6º modo da escala maior (Modo Eólio). Em Dó maior, a escala de Lá menor natural usa as mesmas notas — são "relativas". A diferença é apenas qual nota você trata como tônica, o que muda todo o caráter.',
  },
  harmonic_minor: {
    formula: '1 – 2 – b3 – 4 – 5 – b6 – 7',
    character: 'Dramático · Oriental · Neoclássico',
    usedIn: 'Metal neoclássico, Música árabe, Bach, Yngwie Malmsteen',
    insight: 'A menor natural com a 7ª elevada. Isso cria um intervalo de 3 semitons entre b6 e 7 — o "salto árabe" característico. A motivação é harmônica: com a 7ª elevada, o acorde V vira um V7 (dominante), resolvendo muito mais fortemente para o Im.',
  },
  melodic_minor: {
    formula: '1 – 2 – b3 – 4 – 5 – 6 – 7',
    character: 'Suave · Jazzístico · Sofisticado',
    usedIn: 'Jazz, Bossa Nova, MPB, música de câmara',
    insight: 'A menor harmônica resolve o "salto árabe" elevando também a 6ª. O resultado é uma escala que sobe suavemente como a maior, mas com o b3 que mantém o caráter menor. No jazz é usada também sobre acordes mMaj7 e outros acordes de tensão.',
  },
  diminished: {
    formula: '1 – 2 – b3 – 4 – b5 – b6 – 6 – 7',
    character: 'Tenso · Instável · Suspense',
    usedIn: 'Jazz (sobre dim7 e 7b9), Metal, Trilhas sonoras',
    insight: 'Escala simétrica de 8 notas com padrão fixo de Tom-Semitom. Essa simetria tem uma consequência prática enorme: a escala se repete a cada 3 casas no braço. Existem apenas 3 formas únicas da escala diminuta — cada uma cobre 4 tônicas diferentes.',
  },
  whole_tone: {
    formula: '1 – 2 – 3 – #4 – #5 – b7',
    character: 'Flutuante · Sem direção · Impressionista',
    usedIn: 'Jazz (sobre dom7#5/dom7+), Debussy, trilhas de suspense',
    insight: 'Todos os intervalos são tons inteiros — não há semitons. Isso elimina qualquer sensação de repouso ou resolução. A escala também é completamente simétrica, repetindo a cada 2 casas. Só existem 2 formas únicas no mundo inteiro (C e C#).',
  },
}

const activeTheory = computed(() => THEORY[scaleType.value] ?? null)
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 p-4 sm:p-12 pb-24 font-sans w-[85%] mx-auto">
    <button @click="router.push('/dashboard')" class="flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
      <ChevronLeft class="w-5 h-5" /> Retornar
    </button>

    <h1 class="text-4xl font-black mb-4">Módulo Escalas &amp; Solos</h1>
    <p class="text-zinc-300 max-w-3xl mb-10 text-lg leading-relaxed">
      Cada escala possui vários <strong>Shapes</strong> que cobrem regiões diferentes do braço.
      Escolha o <strong>tom</strong> e a escala para ver os shapes automaticamente recalculados!
    </p>

    <!-- Root Note Selector -->
    <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-4">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tom / Root</span>
          <select 
            v-model="rootNote"
            class="bg-zinc-950 text-white text-sm font-bold px-4 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option v-for="rn in ROOT_NOTES" :key="rn.value" :value="rn.value">{{ rn.label }}</option>
          </select>
        </div>
        <div class="text-sm text-zinc-500">
          Escala de <strong class="text-white">{{ selectedRootLabel }}</strong> — todos os shapes recalculam automaticamente!
        </div>
      </div>
    </div>

    <!-- Scale Type Selector -->
    <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-6">
      <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Escolha a Escala</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="key in scaleTemplateKeys" :key="key"
          @click="selectScale(key)"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
          :class="scaleType === key ? scales[key]?.btnActive : scales[key]?.btnInactive"
        >{{ scales[key]?.name }}</button>
      </div>
    </div>

    <!-- Shape Selector -->
    <div v-if="activeDef" class="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl mb-8">
      <div class="flex items-center gap-3 mb-3">
        <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shape</h3>
        <span class="text-xs text-zinc-600">{{ activeDef.shapes.length }} posições no braço</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="(shape, idx) in activeDef.shapes" :key="idx"
          @click="shapeIdx = idx"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
          :class="shapeIdx === idx ? activeDef.btnActive : activeDef.btnInactive"
        >{{ shape.name }}</button>
      </div>
    </div>

    <!-- Fretboard View -->
    <div v-if="activeShape" class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-12 shadow-2xl relative overflow-hidden">
      <div 
        class="absolute -inset-14 opacity-20 blur-3xl pointer-events-none transition-colors duration-1000"
        :class="activeDef.glowClass"
      ></div>

      <div class="relative z-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 class="font-bold text-xl">{{ activeDef.name }} — {{ selectedRootLabel }}</h3>
            <p class="text-sm text-zinc-400 mt-1">{{ activeShape.name }}</p>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-zinc-800/50 rounded-full px-4 py-2 border border-zinc-700">
              <span class="text-xs text-zinc-400 font-bold uppercase hidden sm:inline">Velocidade</span>
              <select v-model="playSpeedMs" class="bg-transparent text-sm font-bold text-zinc-300 focus:outline-none cursor-pointer">
                <option :value="150">Rápido</option>
                <option :value="300">Normal</option>
                <option :value="600">Lento (Didático)</option>
              </select>
            </div>

            <button 
              @click="playScaleSequence"
              class="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
            >
              <Play fill="currentColor" class="w-4 h-4" />
              Ouvir e Ver
            </button>
          </div>
        </div>

        <Fretboard :activeNotes="activeShape.notes" :frets="maxFret" :playingNote="playingNote" :interactiveNotes="true" />

        <!-- Theory card -->
        <div v-if="activeTheory" class="mt-6 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 overflow-hidden text-sm">

          <!-- Header: fórmula + caráter -->
          <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fórmula</span>
              <span class="font-mono text-sm font-bold text-zinc-100 tracking-wide">{{ activeTheory.formula }}</span>
            </div>
            <span class="text-xs text-zinc-400 italic">{{ activeTheory.character }}</span>
          </div>

          <!-- Insight -->
          <div class="px-5 py-4 border-b border-zinc-800/60">
            <p class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Como funciona</p>
            <p class="text-zinc-300 leading-relaxed">{{ activeTheory.insight }}</p>
          </div>

          <!-- Usa em + legenda -->
          <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Usa em</span>
              <span class="text-zinc-400">{{ activeTheory.usedIn }}</span>
            </div>
            <p class="text-[10px] text-zinc-600 shrink-0">
              🎯 Tônica colorida &nbsp;·&nbsp; 🟡 Nota especial
            </p>
          </div>

        </div>
      </div>
    </div>
    
    <!-- End module -->
    <div class="flex justify-end pt-8">
      <button 
        @click="completeLesson"
        class="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border hover:border-purple-500/50"
      >
        <CheckCircle class="w-5 h-5 text-green-400" />
        Dominado! Concluir.
      </button>
    </div>

  </div>
</template>
