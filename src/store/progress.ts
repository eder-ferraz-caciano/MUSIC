import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
    const userName = ref(localStorage.getItem('music-site-username') || '')

    const lessonsProgress = ref(
        JSON.parse(localStorage.getItem('music-site-progress') || '{}')
    )

    const setUserName = (name: string) => {
        userName.value = name
        localStorage.setItem('music-site-username', name)
    }

    const markLessonComplete = (lessonId: string) => {
        lessonsProgress.value[lessonId] = true
        saveProgress()
    }

    const isLessonComplete = (lessonId: string) => {
        return !!lessonsProgress.value[lessonId]
    }

    const saveProgress = () => {
        localStorage.setItem('music-site-progress', JSON.stringify(lessonsProgress.value))
    }

    return { userName, lessonsProgress, setUserName, markLessonComplete, isLessonComplete }
})
