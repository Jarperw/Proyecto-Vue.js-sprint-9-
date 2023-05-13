<template>
<div class="container-fluid position-relative py-1 px-0">
  <img class="cover position-absolute z-n1" src="/img/18.jpg" alt="">
   <form class="row mx-3 mx-xl-auto my-5 p-3 g-3 border border-3 bg-white border-black rounded-3" @submit.prevent="registrar()" novalidate>
    <h1>Registro</h1>
    <div class="col-md-6">
      <label for="nickname" class="form-label">Usuario</label>
      <input v-model.trim="usuario.nickname" @input="resetError('nickname')" type="text" :class="['form-control', error.nickname]" ref="nickname" id="nickname" placeholder="Usuario">
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
      <input v-model.trim="usuario.nombre" @input="resetError('nombre')" type="text" :class="['form-control', error.nombre]" ref="nombre" id="nombre" placeholder="Nombre">
      <div class="invalid-feedback">Por favor, introduce tu nombre.</div>
    </div>
    <div class="col-md-6">
      <label for="apellido" class="form-label">Apellido</label>
      <input v-model.trim="usuario.apellido" @input="resetError('apellido')" type="text" :class="['form-control', error.apellido]" ref="apellido" id="apellido" placeholder="apellido">
      <div class="invalid-feedback">Por favor, introduce tu apellido.</div>
    </div>
    <div class="col-md-6">
      <label for="email" class="form-label">Email</label>
      <input v-model.trim="usuario.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="email" placeholder="email">
      <div v-if="!msgMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
      <div v-else class="invalid-feedback">{{ msgMail }}</div>
    </div>
    <div class="col-md-6">
      <label for="password" class="form-label">Contraseña</label>
      <input v-model.trim="usuario.password" @input="resetError('password')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.password]" ref="password" id="password" placeholder="Contraseña">
      <div class="invalid-feedback">Por favor, introduce un pasword valido, minimo 6 caracteres.</div>
    </div>
    <Ver-password :valor="verPassword" @valor="verPassword = $event"/>
    <div class="col-12">
      <div class="form-check">
        <input v-model="usuario.condiciones" @input="resetError('condiciones')" type="checkbox" :class="['form-check-input', error.condiciones]" ref="condiciones" id="terms">
        <label class="form-check-label" for="terms">Acepto los términos y condiciones.</label>
      </div>
    </div>
    <div class="col-12 mb-2">
      <button class="btn btn-danger">Guardar cambios</button>    
    </div>
  </form>
</div>
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
    ...mapGetters("usuarios", ["msgMail"]),
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
        // this.resetError();
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
  mounted() {
    this.$refs.nickname.focus()
  },
  beforeUnmount() {
    this.resetError();
  }
};
</script>

<style lang="scss" scoped>
.container-fluid{
  max-width: 1600px;
  .cover {
  top: 0;
  width: 100%;
  height: 1054px;
  object-fit: cover;
  object-position: center;
  @media (min-width: 403px) {
    height: 1018px;
  }
  @media (min-width: 768px) {
    height: 705px;
  }
}
.row {
  max-width: 70em;
  .form-select {
    box-shadow: none;
    border: 0.2em solid #000;
  }
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
  .form-control:focus{
    background: #ddd;
  }
  .form-check-input {
    border: 0.2em solid #000;
  }
  .form-check-input:focus {
    box-shadow: none;
    outline: none;
  }
  .form-check-input:focus {
    box-shadow: none;
  }
  .form-check-input:checked {
    background-color: #000;
    color: #000;
  }
}
}

</style>