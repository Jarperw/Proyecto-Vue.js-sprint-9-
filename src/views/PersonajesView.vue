<template>
  <div v-if="!mostrarPersonaje">
    <input class="mb-2 p-2 rounded-5" type="text" v-model="buscar" placeholder="Buscar por nombre"/>{{infoBuscar}}
    <button v-show="!buscar" :class="['btn', {'btn-danger': marcado},'float-end']" @click="setOrden(true)">Z-A</button>
    <button v-show="!buscar" :class="['btn', {'btn-danger': !marcado},'float-end']" @click="setOrden(false)">A-Z</button>
    <div class="d-flex flex-wrap gap-2">
      <!-- card con imgane y nombre -->
      <div
        class="card"
        style="width: 15rem"
        v-for="item in buscar ? buscados : personajes"
        :key="item.id"
        @click="verPersonaje(item)"
      >
        <img :src="`${item.thumbnail.path}/standard_xlarge.${item.thumbnail.extension}`" class="card-img-top" :alt="item.name"/>
        <div class="card-body">
          <p class="card-text">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div ref="last"></div>
  </div>
  <!-- componente hijo con props y emits -->
  <Info-personaje v-else />
</template>

<script>
import InfoPersonaje from "../components/InfoPersonaje.vue";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "Personajes",
  components: { InfoPersonaje },
  data() {
    return {
      buscar: "",
    };
  },
  computed: {
    ...mapState(["personajes", "offset", "buscados", "mostrarPersonaje"]),
    ...mapGetters(["totalPersonajes" ,"marcado", "infoBuscar"]),
  },
  methods: {
    ...mapActions(["add"]),
    ...mapMutations(["addOffset", "addBuscar", "resetBuscados", "setMostrarPersonaje", "addPersonajeActual", "setOrden", "resetPersonajes"])
    ,
    //mostrar el personaje y cargar el nombre en la url
    verPersonaje(personaje) {
      this.setMostrarPersonaje(true);
      this.addPersonajeActual(personaje);
      this.$router.replace("/personajes?" + personaje.name);
    },
    //observar scroll
    async observarScroll() {
      await this.$nextTick();
      const options = { root: document, rootMargion: "0px", threshold: 0 };
      const callback = (entries) => {
        if (entries[0].isIntersecting && this.offset < this.totalPersonajes && !this.buscar) {
          this.add("ver");
          this.addOffset();
          console.log("offset", this.offset);
        }
      };
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.last);
    },
  },
  created() {
    //llamada Api scroll infinito
    this.observarScroll();
  },
  //borrar componente cuando sales
  beforeUnmount() {
    this.resetPersonajes();
  },
  watch: {
    //reactivar Api scroll infinito hijo->padre temporizador para dar tiempo a mostrar el dom
    mostrarPersonaje(valor) {
      setTimeout(() => {
        if (!valor) this.observarScroll();
      }, 50);
    },
    //buscar por nombre
    buscar(valor) {
      if (!valor) return this.resetBuscados();
      
      //despues de 700mseg del ultima cambio de buscar, para evitar multiples llamadas
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.addBuscar(valor);
        this.add("buscar");
      }, 700);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  cursor: pointer;
}
</style>