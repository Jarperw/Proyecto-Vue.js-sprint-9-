<template>
  <div class="perfil mx-auto pt-1 position-relative">
    <img class="fondo position-absolute" src="/img/12.jpg" alt="editar">
    <div class="form mx-3 mx-lg-auto my-5 p-3 g-3 bg-white position-relative border border-3 border-black rounded-3">
      <form class="row mx-lg-auto p-3 g-3" @submit.prevent="gurdarCambios()">
        <img @click="modificar()" class="editar mx-4 mt-3 position-absolute" src="/icons/editar.svg" alt="editar">
        <h1>Perfil</h1>
        <div class="col-md-6">
          <label for="nickname" class="form-label">Usuario</label>
          <input v-model.trim="cambio.nickname" @input="resetError('nickname')" type="text" :class="['form-control', error.nickname]" ref="nickname" id="nickname" :disabled="!editar"/>
          <div class="invalid-feedback">Por favor, introduce tu Usuario, minimo 3 carcateres.</div>
        </div>
        <div class="col-md-6">
          <label for="suscripcion" class="form-label">Tipo usuario</label>
          <select v-model.trim="cambio.tipo" id="suscripcion" class="form-select" :disabled="!editar">
            <option value="Normal">Normal</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre</label>
          <input v-model.trim="cambio.nombre" @input="resetError('nombre')" type="text" :class="['form-control', error.nombre]" ref="nombre" id="nombre" :disabled="!editar"/>
          <div class="invalid-feedback">Por favor, introduce tu nombre.</div>
        </div>
        <div class="col-md-6">
          <label for="apellido" class="form-label">Apellido</label>
          <input v-model.trim="cambio.apellido" @input="resetError('apellido')" type="text" :class="['form-control', error.apellido]" ref="apellido" id="apellido" :disabled="!editar"/>
          <div class="invalid-feedback">Por favor, introduce tu apellido.</div>
        </div>
        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input v-model.trim="cambio.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="email" :disabled="!editar"/>
          <div v-if="!msgMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
          <div v-else class="invalid-feedback">{{ msgMail }}</div>
        </div>
        <div v-if="editar" class="col-md-6">
          <label for="passwordActual" class="form-label">Actual Password</label>
          <input v-model.trim="cambio.passwordActual" @input="resetError('passwordActual')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.passwordActual]" ref="passwordActual" id="passwordActual"/>
          <div v-if="!msgPassword" class="invalid-feedback">Por favor, introduce tu pasword actual.</div>
          <div v-else class="invalid-feedback">{{ msgPassword }}</div>
        </div>
        <div v-if="editar" class="col-md-6">
          <label for="password" class="form-label">Nuevo Password</label>
          <input v-model.trim="cambio.nuevoPassword" @input="resetError('nuevoPassword')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.nuevoPassword]" ref="nuevoPassword" id="password"/>
          <div class="invalid-feedback">Por favor, introduce un pasword valido, minimo 6 caracteres.</div>
        </div>
        <Forgot v-if="editar"/>
        <Ver-password v-if="editar" :valor="verPassword" @valor="verPassword = $event"/>
        <div v-if="editar" class="col-12">
          <button class="btn btn-danger">Guardar cambios</button>
        </div>
      </form>
      <button v-if="!editar" class="btn btn-danger mt-5 ms-4 mb-2" @click="cerrar">Cerrar sesion</button>
    </div>
  </div>
</template>

<script>
import Forgot from '../components/Forgot.vue';
import VerPassword from '../components/VerPassword.vue';
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Perfil",
  components: { VerPassword, Forgot },
  data() {
    return {
      cambio: {
        nickname: "",
        tipo: "Normal",
        nombre: "",
        apellido: "",
        email: "",
        passwordActual: "",
        nuevoPassword: "",
      },
      verPassword: false,
    };
  },
  computed: {
    ...mapState("usuarios", ["usuarioActual", "editar", "error", "validacion"]),
    ...mapGetters("usuarios", ["msgPassword", "msgMail"])
  },
  methods: {
    ...mapActions("usuarios", ["cerrarSesion", "addCambios"]),
    ...mapMutations("usuarios", ["setEditar", "addValidacion", "resetError"])
    ,
    cerrar() {
      this.cerrarSesion();
    },
    modificar(){
      this.setEditar(!this.editar);
      this.cambio.passwordActual ='';
      this.cambio.nuevoPassword ='';
      Object.assign(this.cambio, this.usuarioActual);
      this.resetError();
    },
    gurdarCambios() {
      if (!this.validar()) return;
      this.addCambios(this.cambio);
    },
    validar(){
      this.addValidacion(this.cambio);
      //foco en los inputs con error
      for (let key in this.error) {
        if (this.error[key] == "is-invalid") {
          this.$refs[key].focus();
        }
      }
      return this.validacion;
    }
  },
  async created() {
    //copia las propiedades que coincidan de usuarioActual a cambio
    Object.assign(this.cambio, this.usuarioActual);
  },
  beforeUnmount() {
    this.resetError();
    this.setEditar(false);
  },
};
</script>

<style lang="scss" scoped>
.perfil{
  max-width: 1600px;
  .fondo{
    top: 0;
    width: 100%;
    height: 1050px;
    object-fit: cover;
    object-position: center;
    @media (min-width: 419px) {
    height: 1034px;
    }
    @media (min-width: 768px) {
      height: 775px;
    }
  }
  .form {
    max-width: 70em;
    // opacity: 0.95;
    .editar{
      top: 1.5em;
      right: 0;
      width: 3em;
      cursor: pointer;
    }
    // input{
    //   font-style: italic;
    //   font-family: 'Ranchers', cursive;
    // }
    //cuando input disabled disabled
    input:disabled,
    select:disabled{
      background: #ddd;
    }
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