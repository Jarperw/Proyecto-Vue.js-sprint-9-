<template>
 <form class="m-3" @submit.prevent="login" novalidate>
    <div class="mb-3 position-relative">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input v-model.trim="usuario.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="exampleInputEmail1">
      <div class="invalid-feedback">Introduce un email valido</div>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input v-model.trim="usuario.password" @input="resetError('password')" type="password" :class="['form-control', error.password]" ref="password" id="exampleInputPassword1">
      <div class="invalid-feedback">Introduce un pasword valido minimo 6 caracteres</div>
      <Forgot/>
    </div>
    <div class="mb-3 form-check">
      <input v-model="usuario.condiciones" @input="resetError('condiciones')" type="checkbox" :class="['form-check-input', error.condiciones]" ref="condiciones" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button class="btn btn-primary">Submit</button>
  </form> 
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Forgot from '../components/Forgot.vue';

export default {
  name: "Login",
  components: { Forgot },
  data() {
    return {
      usuario: {
        email: "",
        password: "",
        condiciones: false,
      },
    };
  },
  computed: {
    ...mapState("usuarios", ["validacion", "error"]),
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