<template>
  <button @click="setEditar(!editar)">editar</button>
  <div v-if="!editar">
    <h2>Bienvenido {{ usuarioActual.nickname }}</h2>
    <hr />
    <h3>Datos personales</h3>
    <p>Nickname: {{ usuarioActual.nickname }}</p>
    <p>Nombre: {{ usuarioActual.nombre }}</p>
    <p>Apellido: {{ usuarioActual.apellido }}</p>
    <p>Email: {{ usuarioActual.email }}</p>
    <p>Tipo de usuario: {{ usuarioActual.tipo }}</p>
  </div>

  <form v-if="editar" class="row g-3 m-3" @submit.prevent="gurdarCambios()">
    <div class="col-md-6">
      <label for="nickname" class="form-label">Nickname</label>
      <input v-model.trim="cambio.nickname" @input="resetError('nickname')" type="text" :class="['form-control', error.nickname]" ref="nickname" id="nickname"/>
    </div>
    <div class="col-md-6">
      <label for="suscripcion" class="form-label">Tipo usuario</label>
      <select v-model.trim="cambio.tipo" id="suscripcion" class="form-select">
        <option value="Normal">Normal</option>
        <option value="Premium">Premium</option>
      </select>
    </div>
    <div class="col-md-6">
      <label for="nombre" class="form-label">Nombre</label>
      <input v-model.trim="cambio.nombre" @input="resetError('nombre')" type="text" :class="['form-control', error.nombre]" ref="nombre" id="nombre"/>
    </div>
    <div class="col-md-6">
      <label for="apellido" class="form-label">Apellido</label>
      <input v-model.trim="cambio.apellido" @input="resetError('apellido')" type="text" :class="['form-control', error.apellido]" ref="apellido" id="apellido"/>
    </div>
    <div class="col-md-6">
      <label for="email" class="form-label">Email</label>
      <input v-model.trim="cambio.email" @input="resetError('email')" type="email" :class="['form-control', error.email]" ref="email" id="email"/>
    </div>
    <div class="col-md-6">
      <label for="passwordActual" class="form-label">Actual Password</label>
      <input v-model.trim="cambio.passwordActual" @input="resetError('passwordActual')" type="password" :class="['form-control', error.passwordActual]" ref="passwordActual" id="passwordActual"/>
    </div>
    <div class="col-md-6">
      <label for="password" class="form-label">Nuevo Password</label>
      <input v-model.trim="cambio.nuevoPassword" @input="resetError('nuevoPassword')" type="password" :class="['form-control', error.nuevoPassword]" ref="nuevoPassword" id="password"/>
    </div>
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="gridCheck"/>
        <label class="form-check-label" for="gridCheck">Check me out</label>
      </div>
    </div>
    <div class="col-12">
      <button class="btn btn-primary">Guardar cambios</button>
    </div>
  </form>

  <button @click="cerrar">Cerrar sesion</button>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Perfil",
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
    };
  },
  computed: {
    ...mapState("usuarios", ["usuarioActual", "editar", "error", "validacion"]),
  },
  methods: {
    ...mapActions("usuarios", ["cargarUsuario", "cerrarSesion", "addCambios"]),
    ...mapMutations("usuarios", ["setEditar", "addValidacion", "resetError"]),
    cerrar() {
      this.cerrarSesion();
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
  created() {
    this.cargarUsuario();
  },
  beforeUnmount() {
    this.resetError();
    this.setEditar(false);
  },
};
</script>

<style lang="scss" scoped>
</style>