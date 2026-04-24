<script setup lang="ts">
import { computed } from 'vue'
import type { DictChord, NoteRole } from '../data/chord-dictionary'

const props = defineProps<{
  chord: DictChord
  playing?: boolean
  selected?: boolean
  size?: 'sm' | 'md'
}>()

const FRETS = 4
const W = 112
const H = 172
const PAD_X = 12
const PAD_TOP = 34
const PAD_BOT = 14
const GRID_H = H - PAD_TOP - PAD_BOT

const stringX = (s: number) => PAD_X + ((6 - s) / 5) * (W - 2 * PAD_X)
const fretY  = (f: number) => PAD_TOP + (f / FRETS) * GRID_H
const dotY   = (f: number) => PAD_TOP + ((f - 0.5) / FRETS) * GRID_H

const relFret = (abs: number) => abs - props.chord.baseFret + 1

const fingeredNotes = computed(() => props.chord.positions.filter(p => p.fret > 0))
const openStrings = computed(() =>
  new Set(props.chord.positions.filter(p => p.fret === 0).map(p => p.string))
)

const roleFill: Record<NoteRole, string> = {
  root:    '#6366f1', // indigo-500
  third:   '#38bdf8', // sky-400
  fifth:   '#71717a', // zinc-500
  seventh: '#fbbf24', // amber-400
  tension: '#f472b6', // pink-400
  ninth:   '#a78bfa', // violet-400
}

const cardSize = computed(() => props.size === 'md' ? 'w-40' : 'w-32')
</script>

<template>
  <div
    class="flex flex-col items-center gap-1 p-2 rounded-xl border bg-zinc-900/60 cursor-pointer transition-all select-none"
    :class="[
      cardSize,
      playing
        ? 'border-purple-500 ring-2 ring-purple-500/60 shadow-[0_0_18px_rgba(168,85,247,0.5)] scale-105'
        : selected
          ? 'border-amber-500/60 ring-1 ring-amber-500/40'
          : 'border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900'
    ]"
  >
    <div class="text-sm font-black text-zinc-100 text-center leading-tight truncate w-full">{{ chord.name }}</div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full text-zinc-500" xmlns="http://www.w3.org/2000/svg">
      <!-- String numbers (1 = high E, 6 = low E) — sit just above the nut line -->
      <g>
        <text
          v-for="s in 6" :key="'num-' + s"
          :x="stringX(s)" :y="PAD_TOP - 3"
          text-anchor="middle" font-size="7" font-weight="700"
          fill="currentColor" class="text-zinc-500"
        >{{ s }}</text>
      </g>

      <!-- Top markers (X for muted, O for open) -->
      <g>
        <template v-for="s in 6" :key="'top-' + s">
          <text
            v-if="chord.mutedStrings.includes(s)"
            :x="stringX(s)" :y="PAD_TOP - 14"
            text-anchor="middle" font-size="11" font-weight="700"
            fill="currentColor" class="text-zinc-600"
          >×</text>
          <circle
            v-else-if="openStrings.has(s)"
            :cx="stringX(s)" :cy="PAD_TOP - 17"
            r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"
            class="text-zinc-500"
          />
        </template>
      </g>

      <!-- Nut (thick if fret 1 shown) -->
      <line
        :x1="PAD_X - 0.5" :y1="PAD_TOP"
        :x2="W - PAD_X + 0.5" :y2="PAD_TOP"
        :stroke-width="chord.baseFret === 1 ? 3.5 : 1.2"
        stroke="currentColor" class="text-zinc-400"
      />

      <!-- Frets -->
      <line
        v-for="f in FRETS" :key="'fret-' + f"
        :x1="PAD_X" :y1="fretY(f)"
        :x2="W - PAD_X" :y2="fretY(f)"
        stroke-width="1" stroke="currentColor" class="text-zinc-700"
      />

      <!-- Strings -->
      <line
        v-for="s in 6" :key="'str-' + s"
        :x1="stringX(s)" :y1="PAD_TOP"
        :x2="stringX(s)" :y2="fretY(FRETS)"
        stroke-width="1" stroke="currentColor" class="text-zinc-600"
      />

      <!-- Barre indicator -->
      <rect
        v-if="chord.barre"
        :x="stringX(chord.barre.fromString) - 7"
        :y="dotY(relFret(chord.barre.fret)) - 5.5"
        :width="stringX(chord.barre.toString) - stringX(chord.barre.fromString) + 14"
        height="11"
        rx="5.5"
        :fill="roleFill[chord.barre.role ?? 'root']"
        opacity="0.85"
      />

      <!-- Fret number (baseFret > 1) -->
      <text
        v-if="chord.baseFret > 1"
        :x="PAD_X - 4" :y="PAD_TOP + 13"
        text-anchor="end" font-size="10" font-weight="700"
        fill="currentColor" class="text-amber-500"
      >{{ chord.baseFret }}fr</text>

      <!-- Finger dots -->
      <g v-for="(p, i) in fingeredNotes" :key="'dot-' + i">
        <circle
          :cx="stringX(p.string)" :cy="dotY(relFret(p.fret))"
          r="7.5"
          :fill="roleFill[p.role]"
          stroke="rgba(0,0,0,0.4)" stroke-width="0.6"
        />
        <text
          v-if="p.finger"
          :x="stringX(p.string)" :y="dotY(relFret(p.fret)) + 3.4"
          text-anchor="middle" font-size="9" font-weight="800"
          fill="white"
        >{{ p.finger }}</text>
      </g>
    </svg>
  </div>
</template>
