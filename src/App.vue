<template>
  <Navegacion />
  <header></header>
  <RouterView />
  <Footer />
</template>

<script>
import Footer from './components/Footer.vue';
import Navegacion from "./components/Navegacion.vue";

export default {
  name: "App",
  components: { Navegacion, Footer },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Chicle&family=DynaPuff&family=Kavoon&family=Knewave&family=Lemon&family=Lilita+One&family=Luckiest+Guy&family=Mouse+Memoirs&family=Permanent+Marker&family=Ranchers&family=Sigmar&family=Titan+One&display=swap');
*{
  font-family: 'Bangers', cursive;
}
</style>


