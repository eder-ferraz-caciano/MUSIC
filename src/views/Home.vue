<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../store/progress'

const router = useRouter()
const store = useProgressStore()

const name = ref(store.userName)

const enterSite = () => {
  if (name.value.trim()) {
    store.setUserName(name.value.trim())
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 bg-zinc-950">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
    </div>

    <!-- Content -->
    <div class="z-10 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-10 rounded-3xl max-w-md w-full shadow-2xl">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
          Master Strings
        </h1>
        <p class="text-zinc-400">Entre na jornada para dominar o braço da sua guitarra.</p>
      </div>

      <form @submit.prevent="enterSite" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-zinc-300 mb-2">Qual seu nome ou apelido?</label>
          <input 
            v-model="name"
            type="text" 
            id="name" 
            placeholder="Ex: João Silva" 
            class="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300"
        >
          {{ store.userName ? 'Continuar Jornada' : 'Começar Agora' }}
        </button>
      </form>
    </div>
  </div>
</template>
