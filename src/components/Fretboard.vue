<script setup lang="ts">
import { computed } from 'vue'
import { audio } from '../utils/audio'

const props = defineProps<{
  strings?: number[]
  frets?: number
  activeNotes?: { string: number, fret: number, color?: string, label?: string }[]
  playingNote?: { string: number, fret: number } | null
  showAllNotes?: boolean
  interactiveNotes?: boolean
}>()

const numFrets = computed(() => props.frets || 22)
const numStrings = computed(() => props.strings || [1, 2, 3, 4, 5, 6]) // e, B, G, D, A, E

// Pre-calculate standard notes for caching labels if showAllNotes is true
const standardRoots = ['E', 'B', 'G', 'D', 'A', 'E']
const notesScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const getNoteLabel = (s: number, f: number) => {
  const rootNote = standardRoots[s - 1]
  if (!rootNote) return ''
  const rootIndex = notesScale.indexOf(rootNote)
  return notesScale[(rootIndex + f) % 12]
}

const isNoteActive = (s: number, f: number) => {
  return props.activeNotes?.find(n => n.string === s && n.fret === f)
}

const handleFretClick = async (s: number, f: number) => {
  if (props.interactiveNotes) {
    await audio.init()
    const note = audio.getFretNote(s, f)
    audio.playNote(note)
  }
}
</script>

<template>
  <div class="relative w-full overflow-x-auto overflow-y-hidden pb-12 pt-8 px-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 rounded-xl">
    <div 
      class="bg-amber-900 border-l-[12px] border-zinc-200 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex flex-col justify-between py-2 rounded-r-md relative h-56 my-2"
      :style="{ minWidth: `${Math.max(800, numFrets * 60)}px` }"
    >
      
      <!-- Fret lines -->
      <div class="absolute inset-0 flex">
        <div 
          v-for="f in numFrets" 
          :key="f"
          class="flex-1 border-r-2 border-zinc-400 bg-gradient-to-r from-amber-900 to-amber-800 opacity-90 relative"
        >
          <!-- Fret Markers -->
          <div v-if="[3, 5, 7, 9, 15, 17, 19, 21].includes(f)" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-200/50 rounded-full"></div>
          <div v-if="f === 12 || f === 24" class="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-200/50 rounded-full"></div>
          <div v-if="f === 12 || f === 24" class="absolute bottom-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-200/50 rounded-full"></div>

          <!-- Fret numbers bottom -->
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-zinc-500">{{ f }}</div>
        </div>
      </div>

      <!-- Strings -->
      <div 
        v-for="s in numStrings" 
        :key="s" 
        class="relative w-full z-10 flex items-center h-[34px]"
      >
        <!-- The string line -->
        <div class="absolute w-full h-[2px] bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500 shadow-[0_2px_4px_rgba(0,0,0,0.8)]" :style="{ opacity: 0.7 + (s * 0.05), height: `${1 + s*0.2}px` }"></div>
        
        <!-- Frets for the string -->
        <div class="absolute inset-0 flex">
          <div
            v-for="f in numFrets"
            :key="f"
            class="flex-1 relative flex items-center justify-center cursor-pointer transition-colors"
            :class="{ 'hover:bg-white/10': interactiveNotes }"
            @click="handleFretClick(s, f)"
          >
            <!-- Show all notes if prop is passed -->
            <div
              v-if="showAllNotes && !isNoteActive(s, f)"
              class="absolute z-10 text-[10px] font-bold text-white/50 bg-black/30 w-5 h-5 rounded-full flex flex-col justify-center items-center pointer-events-none"
            >
              {{ getNoteLabel(s, f) }}
            </div>

            <!-- Note Marker Active (fret >= 1) -->
            <div
              v-if="isNoteActive(s, f)"
              class="absolute z-20 w-7 h-7 rounded-full flex flex-col items-center justify-center text-xs font-bold shadow-lg ring-2 pointer-events-none transition-all duration-300 transform"
              :class="[
                isNoteActive(s,f)?.color || 'bg-purple-500 text-white',
                playingNote?.string === s && playingNote?.fret === f ? 'scale-150 ring-4 ring-yellow-400 !z-40 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'ring-white/50'
              ]"
            >
              {{ isNoteActive(s,f)?.label || getNoteLabel(s, f) }}
            </div>
          </div>
        </div>

        <!-- Open String (fret 0): label or active marker, always outside the fret strip -->
        <div
          class="absolute -left-8 z-20 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 transform"
          :class="[
            isNoteActive(s, 0)
              ? [(isNoteActive(s,0)?.color || 'bg-purple-500 text-white'), 'ring-2',
                 playingNote?.string === s && playingNote?.fret === 0
                   ? 'scale-150 ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                   : 'ring-white/50']
              : showAllNotes
                ? 'bg-zinc-800 text-zinc-300'
                : 'opacity-0 pointer-events-none',
            interactiveNotes && (isNoteActive(s,0) || showAllNotes) ? 'cursor-pointer hover:brightness-125' : 'pointer-events-none'
          ]"
          @click.stop="interactiveNotes && (isNoteActive(s,0) || showAllNotes) ? handleFretClick(s, 0) : undefined"
        >
          {{ isNoteActive(s,0)?.label || (showAllNotes ? getNoteLabel(s, 0) : '') }}
        </div>

      </div>
    </div>
  </div>
</template>
