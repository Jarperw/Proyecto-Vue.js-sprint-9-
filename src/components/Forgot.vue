<template>
  <a class="float-end text-black" @click="resetForgot()" href="#" data-bs-toggle="modal" data-bs-target="#eModal" data-bs-whatever="@mdo">¿Olvidaste tu contraseña?</a>
  <div class="modal fade" id="eModal" tabindex="-1" aria-labelledby="eModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-3 border-dark">
        <div class="modal-header border-dark">
          <h1 class="modal-title fs-5" id="eModalLabel">¿Olvidaste tu contraseña?</h1>
          <button ref="close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="correo" class="col-form-label"></label>
              <input v-model.trim="forgot.email" @input="addForgotError('')" type="email" :class="['form-control', {'is-invalid': forgot.error}]" id="correo" placeholder="Email"/>
              <small class="invalid-feedback">{{ msgForgot }}</small>
            </div>
          </form>
        </div>
        <div class="modal-footer border-dark">
          <button @click="resetPassword" type="button" class="btn btn-primary">Reset password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Forgot",
  computed: {
    ...mapState("usuarios", ["forgot"]),
    ...mapGetters('usuarios',['msgForgot'])
  },
  methods: {
    ...mapMutations("usuarios", ["addForgotError", "resetForgot"]),
    ...mapActions("usuarios", ["forgotPassword"])
    ,
    async resetPassword() {
      await this.forgotPassword(this.forgot.email)
      if(!this.forgot.email && !this.forgot.error)this.$refs.close.click();
    },
  },
  beforeUnmount() {
    if (this.$refs.close) {
      this.$refs.close.click();
    }
  },
};
</script>

<style lang="scss" scoped>
.float-end{
  transition: all 0.7s; 
}
.float-end:hover{
  color: #777 !important;
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
.form-control:focus {
  background: #ddd;
}
.form-check-input:focus {
  box-shadow: none;
  outline: none;
  border: 0.2em solid red;
}
</style>