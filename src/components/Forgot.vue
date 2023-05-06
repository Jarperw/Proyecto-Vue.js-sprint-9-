<template>
  <a @click="resetForgot()" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">forgot pasword</a>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Forgot password</h1>
          <button ref="close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label"></label>
              <input v-model.trim="forgot.email" @input="addForgotError('')" type="email" :class="['form-control', {'is-invalid': forgot.error}]" id="recipient-name" placeholder="Email"/>
              <small class="invalid-feedback">{{ smsForgot }}</small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="resetPassword" type="button" class="btn btn-primary">
            Reset password
          </button>
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
    ...mapGetters('usuarios',['smsForgot'])
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
</style>