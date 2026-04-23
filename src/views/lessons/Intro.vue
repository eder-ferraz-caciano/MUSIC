<script setup lang="ts">
import Fretboard from '../../components/Fretboard.vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../../store/progress'
import { CheckCircle, ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const store = useProgressStore()

const completeLesson = () => {
  store.markLessonComplete('intro')
  router.push('/dashboard')
}

// C D E F G A B scale to highlight in string 5 for example
const cMajorNotes = [
  { string: 5, fret: 3, label: 'C', color: 'bg-indigo-500 text-white' }, // C
  { string: 5, fret: 5, label: 'D', color: 'bg-indigo-500 text-white' }, // D
  { string: 5, fret: 7, label: 'E', color: 'bg-indigo-500 text-white' }, // E
  { string: 5, fret: 8, label: 'F', color: 'bg-indigo-500 text-white' }, // F
  { string: 5, fret: 10, label: 'G', color: 'bg-indigo-500 text-white' }, // G
  { string: 5, fret: 12, label: 'A', color: 'bg-indigo-500 text-white' }, // A
  { string: 5, fret: 14, label: 'B', color: 'bg-indigo-500 text-white' }, // B
  { string: 5, fret: 15, label: 'C', color: 'bg-blue-500 text-white' }, // C (oitava)
]

</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 p-6 sm:p-12 pb-24 font-sans w-[85%] mx-auto">
    
    <button @click="router.push('/dashboard')" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
      <ChevronLeft class="w-5 h-5" />
      Voltar para o Painel
    </button>

    <h1 class="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Módulo 1: Introdução à Guitarra e Notas Musicais</h1>
    
    <div class="space-y-6 text-zinc-300 leading-relaxed text-lg border-l-2 border-purple-500/30 pl-6 mb-12">
      <p>Bem-vindo ao início da sua jornada, <span class="text-white font-bold">{{ store.userName }}</span>!</p>
      
      <p>
        O braço da guitarra (ou violão) é basicamente uma tabela matemática de frequências! 
        Existem <strong>12 notas musicais no total</strong> na música ocidental (Dó, Dó#, Ré, Ré#, Mi, Fá, Fá#, Sol, Sol#, Lá, Lá#, Si).
      </p>

      <div class="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl flex flex-wrap gap-2 font-mono text-sm shadow-inner">
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">C (Dó)</span>
        <span class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded">C#</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">D (Ré)</span>
        <span class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded">D#</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">E (Mi)</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded border-l-2 border-purple-500">F (Fá)</span>
        <span class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded">F#</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">G (Sol)</span>
        <span class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded">G#</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">A (Lá)</span>
        <span class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded">A#</span>
        <span class="px-3 py-1 bg-zinc-800 text-white rounded">B (Si)</span>
      </div>

      <p class="text-sm italic text-zinc-400 mt-2">Repare que Mi (E) para Fá (F), e Si (B) para Dó (C) <strong>não têm sustenido (#)</strong>. Na guitarra, avançar UMA casa significa pular para a PRÓXIMA nota desta lista.</p>
    </div>

    <!-- Braço Completo! -->
    <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-12 shadow-2xl relative">
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="w-2 h-8 bg-purple-500 rounded-full block"></span> 
        O Braço Completo (Todas as Notas)
      </h3>
      <p class="text-green-400 mb-6 text-sm font-bold animate-pulse">
        🎵 Interativo! Clique em qualquer casa (inclusive fora do braço à esquerda para cordas soltas) para ouvir o som real da guitarra!
      </p>
      
      <Fretboard :frets="22" :showAllNotes="true" :interactiveNotes="true" />
      
      <p class="text-sm mt-4 text-zinc-500">Esta é a afinação clássica (Standard). Corda 6 (mais em cima, grave) afinada em E, até a corda 1 afinada em e (mesma nota E porem mais aguda).</p>
    </div>

    <!-- Explicação C D E F G A B -->
    <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl mb-12 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>
      
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="w-2 h-8 bg-blue-500 rounded-full block"></span> 
        A Escala Natural: Dó Ré Mi Fá Sol Lá Si
      </h3>
      <p class="text-zinc-400 mb-6 text-sm">
        Vamos visualizar apenas as notas <strong>naturais</strong> (sem o sustenido) ocorrendo em sequência na <strong>5ª corda (A)</strong>.<br/>
        Clique para ouvir: <strong>C</strong> (Dó, casa 3) → <strong>D</strong> (Ré, casa 5) → <strong>E</strong> (Mi, casa 7)... até chegar no <strong>C</strong> novamente (uma Oitava acima, casa 15).
      </p>
      
      <Fretboard :activeNotes="cMajorNotes" :frets="17" :showAllNotes="false" :interactiveNotes="true" />
    </div>

    <!-- Finalizing -->
    <div class="flex items-center justify-between border-t border-zinc-800 pt-8 mt-12">
      <div>
        <h4 class="font-bold text-lg">Pronto para avançar?</h4>
        <p class="text-sm text-zinc-500">Marque a lição como concluída.</p>
      </div>
      <button 
        @click="completeLesson"
        class="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-1"
      >
        <CheckCircle class="w-5 h-5" />
        Concluir Módulo
      </button>
    </div>

  </div>
</template>
