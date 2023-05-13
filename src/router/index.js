import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase/firebase'
import { doc, getDoc } from "firebase/firestore"
import store from '../store/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Marvel Comics'
      }
    },
    {
      path: '/personajes',
      name: 'personajes',
      component: () => import('../views/PersonajesView.vue'),
      meta: {
        title: 'Personajes | Marvel Comics',
        registrado: true,
        // premium: true,
      }
    },
    {
      path: '/premium',
      name: 'premium',
      component: () => import('../views/PremiumView.vue'),
      meta: {
        title: 'Premium | Marvel Comics',
        registrado: true,
        premium: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'Login | Marvel Comics',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        title: 'Register | Marvel Comics',
      }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue'),
      meta: {
        title: 'Perfil | Marvel Comics',
        registrado: true,
      }
    },
  ]
})

//proteccion rutas global
router.beforeEach(async (to, from, next) => {

  //si tienen el meta registrado
  if (to.matched.some(record => record.meta.registrado)) {//si la ruta tiene meta.registrado true
    
    //si hay sesion abierta
    if (auth.currentUser) {

      //si tambien tiene el meta premium
      if (to.matched.some(record => record.meta.premium)) {//si la ruta tiene meta.premium true
        const data = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        const tipo = data.data().tipo;

        //si el tipo de sesion es Premium 
        if (tipo == 'Premium') {
          next()
        //si no es Premium
        } else {
          next('/')//sino tiene premium se le podria mostrar un mensaje
        }
      //si hay sesion abierta y no necesita premium
      }else{
          next()
      }
    //si no hay sesion abierta y pide meta registrado
    } else {
      store.commit('usuarios/setRedireccionar', to.path)//guardar ruta original
      next('/login');
    }
  //si no tiene requisitos
  } else {
    next();
  }
  // poner titulo a cada componente
  document.title = to.meta.title
});



export default router
