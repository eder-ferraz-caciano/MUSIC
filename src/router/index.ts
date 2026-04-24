import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../views/Dictionary.vue') },
    { path: '/welcome', component: () => import('../views/Home.vue') },
    { path: '/dashboard', component: () => import('../views/Dashboard.vue') },
    { path: '/lesson/intro', component: () => import('../views/lessons/Intro.vue') },
    { path: '/lesson/chords', component: () => import('../views/lessons/Chords.vue') },
    { path: '/lesson/scales', component: () => import('../views/lessons/Scales.vue') },
    { path: '/dictionary', redirect: '/' },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
