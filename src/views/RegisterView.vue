<template>
   <form class="row g-3 m-3" @submit.prevent="registrar()" novalidate>
    <div class="col-md-6">
      <label for="nickname" class="form-label">Usuario</label>
      <input v-model.trim="usuario.nickname" @input="resetError('nickname')" type="text" :class="['form-control', error.nickname]" ref="nickname" id="nickname">
      <div class="invalid-feedback">Por favor, introduce tu Usuario, minimo 3 carcateres.</div>
    </div>
    <div class="col-md-6">
      <label for="suscripcion" class="form-label">Tipo usuario</label>
      <select v-model.trim="usuario.tipo" id="suscripcion" class="form-select">
        <option value="Normal">Normal</option>
        <option value="Premium">Premium</option>
      </select>
    </div>
    <div class="col-md-6">
      <label for="nombre" class="form-label">Nombre</label>
      <input v-model.trim="usuario.nombre" @input="resetError('nombre')" type="text" :class="['form-control', error.nombre]" ref="nombre" id="nombre">
      <div class="invalid-feedback">Por favor, introduce tu nombre.</div>
    </div>
    <div class="col-md-6">
      <label for="apellido" class="form-label">Apellido</label>
      <input v-model.trim="usuario.apellido" @input="resetError('apellido')" type="text" :class="['form-control', error.apellido]" ref="apellido" id="apellido">
      <div class="invalid-feedback">Por favor, introduce tu apellido.</div>
    </div>
    <div class="col-md-6">
      <label for="email" class="form-label">Email</label>
      <input v-model.trim="usuario.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="email">
      <div v-if="!smsMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
      <div v-else class="invalid-feedback">{{ smsMail }}</div>
    </div>
    <div class="col-md-6">
      <label for="password" class="form-label">Password</label>
      <input v-model.trim="usuario.password" @input="resetError('password')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.password]" ref="password" id="password">
      <div class="invalid-feedback">Por favor, introduce un pasword valido, minimo 6 caracteres.</div>
    </div>
    <Ver-password :valor="verPassword" @valor="verPassword = $event"/>
    <div class="col-12">
      <div class="form-check">
        <input v-model="usuario.condiciones" @input="resetError('condiciones')" type="checkbox" :class="['form-check-input', error.condiciones]" ref="condiciones" id="terms">
        <label class="form-check-label" for="terms">Acepto los términos y condiciones.</label>
      </div>
    </div>
    <div class="col-12">
      <button class="btn btn-primary">Guardar cambios</button>    
    </div>
  </form>
</template>

<script>
import VerPassword from '../components/VerPassword.vue';
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Register",
  components: { VerPassword },
  data() {
    return {
      usuario: {
        nickname: "",
        tipo: 'Normal',
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        condiciones: false,
      },
      verPassword: false,
    };
  },
  computed: {
    ...mapState("usuarios", ["validacion", "error"]),
    ...mapGetters("usuarios", ["smsMail"]),
  },
  methods: {
    ...mapMutations("usuarios", ["addValidacion", "resetError"]),
    ...mapActions("usuarios", ["registroFire"])
    ,
    registrar(){
        if (!this.validar()) return;
        this.registroFire(this.usuario);
    },
    validar() {
        this.resetError();
        //enviar validacion a vuex
        this.addValidacion(this.usuario);

        //poner foco en los invalidos con orden de arriba a abajo
        for (let key in this.error) {
            if(this.error[key] == 'is-invalid'){
                this.$refs[key].focus()
            }
        }
        return this.validacion;
    },
  },
  beforeUnmount() {
    this.resetError();
  }
};
</script>

<style lang="scss" scoped>
</style>