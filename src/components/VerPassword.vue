<template>
  <div class="col-12">
    <div class="form-check">
      <input v-model.trim="verPassword" type="checkbox" class="form-check-input" id="pass"/>
      <label class="form-check-label" for="pass">Mostrar contraseña.</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerPassword",
  props: ['valor'],
  data() {
    return {
      verPassword: this.valor,
    }
  },
  watch: {
    verPassword(){
      this.$emit('valor', this.verPassword)
    }
  },
};
</script>

<style lang="scss" scoped>
.form-check-input {
  border: 0.2em solid #000;
}
.form-check-input:focus {
  box-shadow: none;
}
.form-check-input:checked {
  background-color: #000;
  color: #000;
}
</style>