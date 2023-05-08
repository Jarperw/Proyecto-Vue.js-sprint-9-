<template>
 <form class="m-3" @submit.prevent="login" novalidate>
    <div class="mb-3 position-relative">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input v-model.trim="usuario.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="exampleInputEmail1">
      <div v-if="!smsMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
      <div v-else class="invalid-feedback">{{ smsMail }}</div>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input v-model.trim="usuario.password" @input="resetError('password')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.password]" ref="password" id="exampleInputPassword1">
      <div v-if="!smsPassword" class="invalid-feedback">Introduce un pasword valido, minimo 6 caracteres.</div>
      <div v-else class="invalid-feedback">{{ smsPassword }}</div>
      <Forgot/>
    </div>
    <Ver-password :valor="verPassword" @valor="verPassword = $event"/>
    <div class="col-12">
      <button class="btn btn-primary">Login</button>    
    </div>
    <Router-link to="/register">Registrate</Router-link>
  </form> 
</template>

<script>
import Forgot from '../components/Forgot.vue';
import VerPassword from '../components/VerPassword.vue';
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
    ...mapGetters("usuarios", ["smsMail", "smsPassword"]),
  },
  methods: {
    ...mapMutations("usuarios", ["addValidacion", "resetError"]),
    ...mapActions("usuarios", ["loginFire"])
    ,
    login(){
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
  beforeUnmount() {
    this.resetError();
  },
};
</script>

<style lang="scss" scoped>
</style>