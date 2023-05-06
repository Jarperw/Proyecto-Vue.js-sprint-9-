import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/firebase'

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
        title: 'Personajes | Marvel Comics',
        registrado: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta:{
        title: 'Login | Marvel Comics'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta:{
        title: 'Register | Marvel Comics'
      }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue'),
      meta:{
        title: 'Perfil | Marvel Comics',
        registrado: true,
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  //proteccion rutas registro
  if(to.matched.some(record => record.meta.registrado)){
    //para volver a la ruta protegida usar 'to' que da la ruta que pulsas
    if(auth.currentUser){
      console.log('registrado')
      next();
    } else {
      console.log('no registrado')
      next('/login');
    }
  }else {
    next();
  }
  // poner titulo a cada componente
  document.title = to.meta.title
});

export default router
