<template>
  <div class="container-fluid position-relative py-1 px-0">
    <img class="cover position-absolute" src="/img/7.jpg" alt="">
    <form 
      class="row mx-3 mx-sm-auto my-5 p-3 g-3 bg-white border border-3 border-black rounded-3 position-relative" 
      @submit.prevent="login" 
      novalidate
    >
      <h1>Login</h1>
      <div class="mb-3">
        <input 
          v-model.trim="usuario.email" 
          :class="['form-control', error.email]" 
          @input="resetError('email')" 
          type="email" 
          placeholder="Email"
          ref="email" 
        >
        <div v-if="!msgMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
        <div v-else class="invalid-feedback">{{ msgMail }}</div>
      </div>
      <div class="mb-3">
        <input 
          v-model.trim="usuario.password" 
          :class="['form-control', error.password]" 
          :type="verPassword ? 'text': 'password'" 
          @input="resetError('password')" 
          placeholder="Contraseña"
          ref="password" 
        >
        <div v-if="!msgPassword" class="invalid-feedback">Introduce un pasword valido, minimo 6 caracteres.</div>
        <div v-else class="invalid-feedback">{{ msgPassword }}</div>
        <Forgot/>
      </div>
      <Ver-password :valor="verPassword" @valor="verPassword = $event"/>
      <div class="d-grid gap-2">
        <button class="btn btn-danger">Login</button>    
      </div>
      <Router-link class="registro text-dark" to="/register">Registrate</Router-link>
    </form> 
  </div>
</template>

<script>
import Forgot from "../components/Forgot.vue";
import VerPassword from "../components/VerPassword.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Login",
  components: { Forgot, VerPassword },
  data() {
    return {
      usuario: {
        email: "",
        password: "",
      },
      verPassword: false,
    };
  },
  computed: {
    ...mapState("usuarios", ["validacion", "error"]),
    ...mapGetters("usuarios", ["msgMail", "msgPassword"]),
  },
  methods: {
    ...mapMutations("usuarios", ["addValidacion", "resetError"]),
    ...mapActions("usuarios", ["loginFire"]),
    login() {
      if (!this.validar()) return;
      this.loginFire(this.usuario);
    },
    validar() {
      this.addValidacion(this.usuario);
      //foco en los inputs con error
      for (let key in this.error) {
        if (this.error[key] == "is-invalid") {
          this.$refs[key].focus();
        }
      }
      return this.validacion;
    },
  },
  mounted() {
    this.$refs.email.focus()
  },
  beforeUnmount() {
    this.resetError();
  },
};
</script>

<style lang="scss" scoped>
.container-fluid {
  max-width: 1600px;
  .cover {
    top: 0;
    width: 100%;
    height: 572px;
    object-fit: cover;
    object-position: center;
  }
  .row {
    max-width: 32.5em;
    .form-control {
      background-image: none;
      box-shadow: none;
      border: 0.2em solid #000;
    }
    .form-control.is-invalid {
      background-image: none;
      box-shadow: none;
      border: 0.2em solid #dc3545;
      color: #dc3545;
    }
    .form-control:focus {
      background: #ddd;
    }
  }
  .registro{
    transition: all 0.7s; 
  }
  .registro:hover{
    color: #777 !important;
  }
}
</style>