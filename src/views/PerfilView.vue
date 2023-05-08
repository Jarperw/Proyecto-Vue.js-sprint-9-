<template>
  <!-- <button @click="modificar()">editar</button> -->
  <img @click="modificar()" class="mx-4 mt-3" src="/icons/editar.svg" alt="editar">
  <form class="row g-3 m-3" @submit.prevent="gurdarCambios()">
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
      <div v-if="!smsMail" class="invalid-feedback">Por favor, introduce un email valido.</div>
      <div v-else class="invalid-feedback">{{ smsMail }}</div>
    </div>
    <div v-if="editar" class="col-md-6">
      <label for="passwordActual" class="form-label">Actual Password</label>
      <input v-model.trim="cambio.passwordActual" @input="resetError('passwordActual')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.passwordActual]" ref="passwordActual" id="passwordActual"/>
      <div v-if="!smsPassword" class="invalid-feedback">Por favor, introduce tu pasword actual.</div>
      <div v-else class="invalid-feedback">{{ smsPassword }}</div>
    </div>
    <div v-if="editar" class="col-md-6">
      <label for="password" class="form-label">Nuevo Password</label>
      <input v-model.trim="cambio.nuevoPassword" @input="resetError('nuevoPassword')" :type="verPassword ? 'text': 'password'" :class="['form-control', error.nuevoPassword]" ref="nuevoPassword" id="password"/>
      <div class="invalid-feedback">Por favor, introduce un pasword valido, minimo 6 caracteres.</div>
    </div>
    <Forgot v-if="editar"/>
    <Ver-password v-if="editar" :valor="verPassword" @valor="verPassword = $event"/>
    <div v-if="editar" class="col-12">
      <button class="btn btn-primary">Guardar cambios</button>
    </div>
  </form>
  <button v-if="!editar" class="btn btn-primary m-3" @click="cerrar">Cerrar sesion</button>
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
    ...mapGetters("usuarios", ["smsPassword", "smsMail"])
  },
  methods: {
    ...mapActions("usuarios", ["cargarUsuario", "cerrarSesion", "addCambios"]),
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
    console.log(this.usuarioActual)
    if(!this.usuarioActual) await this.cargarUsuario();
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
//quitar estilos de los inputs cuando son disabled
input:disabled,
select:disabled{
  background: #ddd;
}
img{
  width: 2em;
  cursor: pointer;
}
</style>