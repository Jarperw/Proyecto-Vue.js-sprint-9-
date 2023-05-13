<template>
  <nav class="navbar navbar-expand-md bg-dark py-5 pb-md-2" :class="show ? 'navbar-white': 'navbar-dark'" aria-label="Offcanvas navbar large">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img class="logo" src="/logo/logo1.png">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
        <span class="navbar-toggler-icon "></span>
      </button>
      <div ref="canvas" class="offcanvas offcanvas-start text-bg-white" :class="bordes + redondo" tabindex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
        <div class="offcanvas-header border-bottom">
          <h5 class="offcanvas-title" id="offcanvasNavbar2Label">MARVEL CÓMIC</h5>
          <button ref="cerrar" type="button" class="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body flex-column fs-5">
          <h3 v-if="show && nombreUsuario" class="text-danger">Usuario</h3>
          <div class="navbar-nav align-self-end pb-3" :class="show ? 'border-bottom': ''">
            <RouterLink v-if="!nombreUsuario" class="nav-link" to="/login" @click="cerrar()">ENTRAR</RouterLink>
            <RouterLink v-if="!nombreUsuario" class="nav-link" to="/register" @click="cerrar()">REGISTRO</RouterLink>
            <RouterLink v-else class="perfil nav-link" to="/perfil" @click="cerrar()">
              <img src="/img/escudo2.gif" alt="">
              {{nombreUsuario}}
            </RouterLink>
          </div>
          <div class="navbar-nav align-self-center mt-3 pb-3 pb-md-0" :class="show ? 'border-bottom': ''">
            <RouterLink class="nav-link" to="/" @click="cerrar()">INICIO</RouterLink>
            <RouterLink class="nav-link" to="/personajes" @click="cerrar()">PERSONAJES</RouterLink>
          </div>
          <div v-if="show" class="position-relative">
            <img class="imagen position-absolute" src="/img/capitan.png" alt="capitan">
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from '../firebase/firebase'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "Navegacion",
  data() {
    return {
      show: false,
      bordes: 'border border-5 border-black',
      redondo: ' rounded-5'
    }
  },
  computed: {
    ...mapGetters('usuarios',['nombreUsuario']),
  },
  methods: {
    ...mapActions('usuarios', ['cargarUsuario'])
    ,
    cerrar(){//cerrar menu
      this.$refs.cerrar.click();
    },
  },
  created() {
    //verificar si hay sesion abierta y carga datos
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.cargarUsuario();
      }
    }); 
  },
  mounted() {
    //observar clase show
    const observer = new MutationObserver(() => {
      const newShow = this.$refs.canvas.classList.contains('show');
      if (this.show !== newShow) {
        this.show = newShow;
      }
    });
    observer.observe(this.$refs.canvas, { attributes: true });
  },
};
</script>

<style lang="scss" scoped>
.navbar-brand{
  position: absolute;
  top: 3.5em;
  left: 50%;
  transform: translate(-50%, -50%);
  .logo {
    width: 7em;
  }
}
.offcanvas{
  .perfil{
    img{
      width: 2em;
    }
  }
  .imagen{
    width: 12em;
    top: 3em;
    left: -100%;
  }
}
.offcanvas.show{
  .imagen{
    animation: aparece forwards 1s;
  }
}
@keyframes aparece {
  0%{left: -100%;}
  100%{left: 10%;}
}

.navbar-toggler{
  border: none;
}
.navbar-toggler:focus,
.btn-close:focus {
  box-shadow: none;
  border: none;
}
</style>
