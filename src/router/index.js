import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta:{
        title: 'Marvel Comics'
      }
    },
    {
      path: '/personajes',
      name: 'personajes',
      component: () => import('../views/PersonajesView.vue'),
      meta:{
        title: 'Personajes | Marvel Comics'
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
