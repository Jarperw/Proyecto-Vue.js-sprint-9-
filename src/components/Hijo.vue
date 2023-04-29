<template>
    <h1>hijo</h1>
  <button @click="volver">volver</button>
 
</template>

<script>
export default {
  name: "InfoPersonaje",
  props: ["mostrar"],
  emits: ["ocultar"],//cargar emits para que no error
  methods: {
    volver() {
      this.$emit("ocultar", false)
    },
  }
}
</script>

<style>
</style>