<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { BookOpen, Play, Pause, ListMusic, Search } from 'lucide-vue-next'
import ChordDiagram from '../components/ChordDiagram.vue'
import TopNav from '../components/TopNav.vue'
import {
    chordDictionary, CATEGORY_META as CHORD_CATS, chordById,
    type DictChord, type ChordCategory,
} from '../data/chord-dictionary'
import {
    progressions, CATEGORY_META as PROG_CATS,
    type Progression, type ProgressionCategory,
} from '../data/progressions'
import { RHYTHMS, type StringedNote } from '../data/rhythms'
import { audio } from '../utils/audio'

// Static class maps — Tailwind JIT needs literal class names, so we map per color.
// Covers every color referenced in CHORD_CATS and PROG_CATS.
const CAT_PILL_ACTIVE: Record<string, string> = {
    emerald:  'bg-emerald-500/20 border-emerald-500 text-emerald-300',
    lime:     'bg-lime-500/20 border-lime-500 text-lime-300',
    amber:    'bg-amber-500/20 border-amber-500 text-amber-300',
    sky:      'bg-sky-500/20 border-sky-500 text-sky-300',
    indigo:   'bg-indigo-500/20 border-indigo-500 text-indigo-300',
    teal:     'bg-teal-500/20 border-teal-500 text-teal-300',
    cyan:     'bg-cyan-500/20 border-cyan-500 text-cyan-300',
    rose:     'bg-rose-500/20 border-rose-500 text-rose-300',
    orange:   'bg-orange-500/20 border-orange-500 text-orange-300',
    fuchsia:  'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300',
    violet:   'bg-violet-500/20 border-violet-500 text-violet-300',
    pink:     'bg-pink-500/20 border-pink-500 text-pink-300',
    blue:     'bg-blue-500/20 border-blue-500 text-blue-300',
    red:      'bg-red-500/20 border-red-500 text-red-300',
    yellow:   'bg-yellow-500/20 border-yellow-500 text-yellow-300',
}

const CAT_TAG: Record<string, string> = {
    emerald:  'bg-emerald-500/15 text-emerald-300',
    lime:     'bg-lime-500/15 text-lime-300',
    amber:    'bg-amber-500/15 text-amber-300',
    sky:      'bg-sky-500/15 text-sky-300',
    indigo:   'bg-indigo-500/15 text-indigo-300',
    teal:     'bg-teal-500/15 text-teal-300',
    cyan:     'bg-cyan-500/15 text-cyan-300',
    rose:     'bg-rose-500/15 text-rose-300',
    orange:   'bg-orange-500/15 text-orange-300',
    fuchsia:  'bg-fuchsia-500/15 text-fuchsia-300',
    violet:   'bg-violet-500/15 text-violet-300',
    pink:     'bg-pink-500/15 text-pink-300',
    blue:     'bg-blue-500/15 text-blue-300',
    red:      'bg-red-500/15 text-red-300',
    yellow:   'bg-yellow-500/15 text-yellow-300',
}

const CAT_DOT: Record<string, string> = {
    emerald:  'bg-emerald-500',
    lime:     'bg-lime-500',
    amber:    'bg-amber-500',
    sky:      'bg-sky-500',
    indigo:   'bg-indigo-500',
    teal:     'bg-teal-500',
    cyan:     'bg-cyan-500',
    rose:     'bg-rose-500',
    orange:   'bg-orange-500',
    fuchsia:  'bg-fuchsia-500',
    violet:   'bg-violet-500',
    pink:     'bg-pink-500',
    blue:     'bg-blue-500',
    red:      'bg-red-500',
    yellow:   'bg-yellow-500',
}

type Tab = 'chords' | 'progressions'
const tab = ref<Tab>('chords')

// ── CHORDS TAB STATE ─────────────────────────────
const chordCatFilter = ref<ChordCategory | 'all'>('all')
const searchQ = ref('')
const selectedChord = ref<DictChord | null>(null)

const filteredChords = computed<DictChord[]>(() => {
    const q = searchQ.value.trim().toLowerCase()
    return chordDictionary.filter(c => {
        if (chordCatFilter.value !== 'all' && c.category !== chordCatFilter.value) return false
        if (!q) return true
        return (
            c.name.toLowerCase().includes(q) ||
            c.fullName.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
        )
    })
})

const groupedChords = computed(() => {
    if (chordCatFilter.value !== 'all') return null
    const groups = (Object.keys(CHORD_CATS) as ChordCategory[]).map(cat => ({
        cat,
        meta: CHORD_CATS[cat],
        chords: filteredChords.value.filter(c => c.category === cat),
    })).filter(g => g.chords.length > 0)
    return groups
})

// ── SHARED RHYTHM / TEMPO STATE (used by both tabs) ───────
const progCatFilter = ref<ProgressionCategory | 'all'>('all')
const rhythmId = ref<string>('dedilhado')
const tempoMultiplier = ref<number>(0.75)
const TEMPO_OPTIONS = [
    { value: 0.75, label: '0.75×' },
    { value: 1,    label: '1×'    },
    { value: 1.25, label: '1.25×' },
    { value: 1.5,  label: '1.5×'  },
]
const playingProg = ref<string | null>(null)
const playingChordIdx = ref<number>(-1)
let progTimeouts: number[] = []

const currentRhythm = computed(() => RHYTHMS.find(r => r.id === rhythmId.value) ?? RHYTHMS[0]!)

const filteredProgressions = computed<Progression[]>(() =>
    progressions.filter(p => progCatFilter.value === 'all' || p.category === progCatFilter.value)
)

// ── AUDIO ACTIONS ────────────────────────────────
function chordToStringedNotes(c: DictChord): StringedNote[] {
    return c.positions
        .filter(pos => !c.mutedStrings.includes(pos.string))
        .map(pos => ({ string: pos.string, note: audio.getFretNote(pos.string, pos.fret) }))
        .filter(x => !!x.note)
}

async function playChord(c: DictChord) {
    await audio.init()
    selectedChord.value = c
    clearProg()
    // Single-chord preview uses the currently selected rhythm + tempo.
    // Slot defaults to 1800ms so dedilhado/arpejo breathe naturally.
    const stringed = chordToStringedNotes(c)
    const slotMs = 1800 / tempoMultiplier.value
    currentRhythm.value.play(stringed, slotMs, (note, delay) => {
        const id = window.setTimeout(() => audio.playNote(note), delay)
        progTimeouts.push(id)
    })
}

function clearProg() {
    progTimeouts.forEach(id => clearTimeout(id))
    progTimeouts = []
    playingProg.value = null
    playingChordIdx.value = -1
}

async function playProgression(pr: Progression) {
    await audio.init()
    if (playingProg.value === pr.id) {
        clearProg()
        return
    }
    clearProg()
    playingProg.value = pr.id

    const rhythm = currentRhythm.value
    const slotMs = pr.msPerChord / tempoMultiplier.value

    pr.chordIds.forEach((cid, i) => {
        const chordStart = i * slotMs
        // Highlight current chord at slot start
        const markId = window.setTimeout(() => { playingChordIdx.value = i }, chordStart)
        progTimeouts.push(markId)

        const c = chordById[cid]
        if (!c) return
        const stringed = chordToStringedNotes(c)
        rhythm.play(stringed, slotMs, (note, delay) => {
            const id = window.setTimeout(() => audio.playNote(note), chordStart + delay)
            progTimeouts.push(id)
        })
    })

    const endId = window.setTimeout(clearProg, pr.chordIds.length * slotMs + 400)
    progTimeouts.push(endId)
}

async function previewRhythm() {
    // Uses the first progression's first chord as a demo at current rhythm
    await audio.init()
    const demoChord = chordById['G'] ?? chordDictionary[0]
    if (!demoChord) return
    clearProg()
    const stringed = chordToStringedNotes(demoChord)
    const demoMs = 2000 / tempoMultiplier.value
    currentRhythm.value.play(stringed, demoMs, (note, delay) => {
        const id = window.setTimeout(() => audio.playNote(note), delay)
        progTimeouts.push(id)
    })
}

onUnmounted(clearProg)
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans">

    <TopNav />

    <!-- Secondary bar with tabs (Acordes / Progressões) -->
    <div class="sticky top-[61px] z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2 text-sm font-bold text-zinc-300">
          <BookOpen class="w-4 h-4 text-purple-400" />
          Dicionário
        </div>
        <div class="ml-auto flex gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
          <button @click="tab = 'chords'"
            class="flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all"
            :class="tab === 'chords' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-zinc-400 hover:text-white'">
            <BookOpen class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Acordes</span>
          </button>
          <button @click="tab = 'progressions'"
            class="flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all"
            :class="tab === 'progressions' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-zinc-400 hover:text-white'">
            <ListMusic class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Progressões</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ SHARED RHYTHM / TEMPO BAR ═══════════════ -->
    <div class="sticky top-[120px] z-20 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60">
      <div class="max-w-[1600px] mx-auto px-3 sm:px-8 py-2 sm:py-3 space-y-2">

        <!-- Ritmo row -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="hidden sm:flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0">
            <span class="w-1 h-4 bg-purple-500 rounded-full"></span>
            Ritmo
          </div>
          <span class="sm:hidden w-1 h-5 bg-purple-500 rounded-full shrink-0" aria-label="Ritmo"></span>

          <div class="flex gap-1.5 flex-1 min-w-0 overflow-x-auto sm:flex-wrap scrollbar-none -mx-1 px-1">
            <button v-for="r in RHYTHMS" :key="r.id"
              @click="rhythmId = r.id"
              :title="r.desc"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0"
              :class="rhythmId === r.id
                ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/30'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'">
              <span class="text-sm">{{ r.icon }}</span>
              {{ r.name }}
            </button>
          </div>

          <button @click="previewRhythm"
            :aria-label="'Preview ' + currentRhythm.name"
            class="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all whitespace-nowrap shrink-0">
            <Play fill="currentColor" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Preview</span>
          </button>
        </div>

        <!-- Tempo row -->
        <div class="flex items-center gap-2 min-w-0">
          <div class="hidden sm:flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0">
            <span class="w-1 h-4 bg-amber-500 rounded-full"></span>
            Tempo
          </div>
          <span class="sm:hidden w-1 h-5 bg-amber-500 rounded-full shrink-0" aria-label="Tempo"></span>

          <div class="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1 shrink-0">
            <button v-for="t in TEMPO_OPTIONS" :key="t.value"
              @click="tempoMultiplier = t.value"
              class="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all"
              :class="tempoMultiplier === t.value
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'">
              {{ t.label }}
            </button>
          </div>
          <p class="hidden sm:block text-[11px] text-zinc-500 italic truncate ml-2">{{ currentRhythm.desc }}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════════ CHORDS TAB ═══════════════ -->
    <main v-if="tab === 'chords'" class="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">

      <!-- Controls row -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <div class="relative flex-1 min-w-[200px] max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input v-model="searchQ" type="text" placeholder="Buscar acorde (ex: Cmaj7, Hendrix, sus…)"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60" />
        </div>
        <div class="text-xs text-zinc-500">
          {{ filteredChords.length }} acorde{{ filteredChords.length === 1 ? '' : 's' }}
        </div>
      </div>

      <!-- Category pills -->
      <div class="flex gap-2 mb-8 overflow-x-auto sm:flex-wrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button @click="chordCatFilter = 'all'"
          class="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0"
          :class="chordCatFilter === 'all'
            ? 'bg-purple-500 border-purple-400 text-white'
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'">
          Todos
        </button>
        <button v-for="(meta, cat) in CHORD_CATS" :key="cat"
          @click="chordCatFilter = cat"
          class="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 whitespace-nowrap"
          :class="chordCatFilter === cat
            ? CAT_PILL_ACTIVE[meta.color]
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'">
          {{ meta.label }}
        </button>
      </div>

      <!-- Grouped view (all categories) -->
      <div v-if="groupedChords" class="space-y-10">
        <section v-for="group in groupedChords" :key="group.cat">
          <div class="flex items-baseline gap-3 mb-1">
            <span class="w-1.5 h-6 rounded-full block" :class="CAT_DOT[group.meta.color]"></span>
            <h2 class="text-lg font-black text-zinc-100">{{ group.meta.label }}</h2>
            <span class="text-xs text-zinc-500">{{ group.chords.length }}</span>
          </div>
          <p class="text-xs text-zinc-500 mb-4 pl-5 italic">{{ group.meta.blurb }}</p>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(136px,1fr))] gap-3 pl-5">
            <ChordDiagram
              v-for="c in group.chords" :key="c.id"
              :chord="c"
              :selected="selectedChord?.id === c.id"
              @click="playChord(c)"
            />
          </div>
        </section>
      </div>

      <!-- Filtered view (single category / search) -->
      <div v-else-if="filteredChords.length > 0"
        class="grid grid-cols-[repeat(auto-fill,minmax(136px,1fr))] gap-3">
        <ChordDiagram
          v-for="c in filteredChords" :key="c.id"
          :chord="c"
          :selected="selectedChord?.id === c.id"
          @click="playChord(c)"
        />
      </div>

      <div v-else class="py-20 text-center text-zinc-500">
        Nenhum acorde encontrado.
      </div>

      <!-- Selected chord detail panel -->
      <transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="selectedChord"
          class="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40
                 bg-zinc-900 border border-purple-500/40 rounded-2xl p-5 shadow-2xl shadow-purple-500/20">
          <div class="flex items-start gap-4">
            <ChordDiagram :chord="selectedChord" size="md" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  :class="CAT_TAG[CHORD_CATS[selectedChord.category].color]">
                  {{ CHORD_CATS[selectedChord.category].label }}
                </span>
              </div>
              <h3 class="text-lg font-black text-zinc-100 leading-tight mb-1">{{ selectedChord.fullName }}</h3>
              <p class="text-xs text-zinc-400 leading-relaxed">{{ selectedChord.desc }}</p>
              <p v-if="selectedChord.tip" class="text-xs text-zinc-500 italic mt-2 border-l-2 border-amber-500/60 pl-2">
                💡 {{ selectedChord.tip }}
              </p>
              <div class="flex gap-2 mt-3">
                <button @click="playChord(selectedChord)"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-lg transition-all">
                  <Play fill="currentColor" class="w-3 h-3" />
                  Tocar
                </button>
                <button @click="selectedChord = null"
                  class="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- ═══════════════ PROGRESSIONS TAB ═══════════════ -->
    <main v-else class="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">

      <!-- Category pills -->
      <div class="flex gap-2 mb-8 overflow-x-auto sm:flex-wrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button @click="progCatFilter = 'all'"
          class="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0"
          :class="progCatFilter === 'all'
            ? 'bg-purple-500 border-purple-400 text-white'
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'">
          Todas
        </button>
        <button v-for="(meta, cat) in PROG_CATS" :key="cat"
          @click="progCatFilter = cat"
          class="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 whitespace-nowrap"
          :class="progCatFilter === cat
            ? CAT_PILL_ACTIVE[meta.color]
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'">
          {{ meta.label }}
        </button>
      </div>

      <!-- Progression cards -->
      <div class="grid gap-5 md:grid-cols-2">
        <article v-for="pr in filteredProgressions" :key="pr.id"
          class="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">

          <!-- Meta line -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              :class="CAT_TAG[PROG_CATS[pr.category].color]">
              {{ PROG_CATS[pr.category].label }}
            </span>
            <span class="text-[10px] font-mono text-zinc-500">{{ pr.roman }}</span>
          </div>

          <h3 class="text-base font-black text-zinc-100 mb-1">{{ pr.name }}</h3>
          <p class="text-xs text-zinc-400 mb-1">{{ pr.desc }}</p>
          <p v-if="pr.example" class="text-[11px] text-zinc-500 italic mb-4">Ex: {{ pr.example }}</p>

          <!-- Chord sequence -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <template v-for="(cid, i) in pr.chordIds" :key="i">
              <ChordDiagram
                v-if="chordById[cid]"
                :chord="chordById[cid]!"
                :playing="playingProg === pr.id && playingChordIdx === i"
                @click="playChord(chordById[cid]!)"
              />
              <span v-if="i < pr.chordIds.length - 1"
                class="text-zinc-600 text-xl font-light self-center">→</span>
            </template>
          </div>

          <!-- Play button -->
          <div class="flex items-center gap-3 pt-3 border-t border-zinc-800">
            <button @click="playProgression(pr)"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              :class="playingProg === pr.id
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'">
              <Pause v-if="playingProg === pr.id" fill="currentColor" class="w-3.5 h-3.5" />
              <Play v-else fill="currentColor" class="w-3.5 h-3.5" />
              {{ playingProg === pr.id ? 'Parar' : 'Tocar progressão' }}
            </button>
            <span class="text-[11px] text-zinc-500">
              {{ Math.round((60000 * tempoMultiplier) / pr.msPerChord) }} bpm (1 acorde/tempo)
            </span>
          </div>
        </article>
      </div>
    </main>

  </div>
</template>
