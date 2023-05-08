import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { doc, getDoc } from "firebase/firestore"

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
        // premium: true,
      }
    },
    {
      path: '/personaje',
      name: 'personaje',
      component: () => import('../views/PersonajeView.vue'),
      meta:{
        title: 'Personaje | Marvel Comics',
        registrado: true,
        premium: true,
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

//proteccion rutas registro
router.beforeEach(async(to, from, next) => { 
  //itera las rutas y devuelve true si la ruta tiene meta.registrado
  if(to.matched.some(record => record.meta.registrado)){
    if(auth.currentUser){
      //itera las rutas y devuelve true si la ruta tiene meta.premium 
      if(to.matched.some(record => record.meta.premium)){
        const data = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));//datos firestore
        const tipo = data.data().tipo;//tipo Premium/Normal 
        if(tipo == 'Premium'){
          console.log('premium')
          next()
        }else{
          console.log('no premium')
          next('/')
        }
      }else{
        console.log('registrado')
        next()
      }
      // next();
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
