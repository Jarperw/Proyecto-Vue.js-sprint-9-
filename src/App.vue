<template>
  <Navegacion />
  <header></header>
  <RouterView />
</template>

<script>
import Navegacion from "./components/Navegacion.vue";

export default {
  components: { Navegacion },
  name: "App",
};
</script>

<style lang="scss" scoped>
</style>


