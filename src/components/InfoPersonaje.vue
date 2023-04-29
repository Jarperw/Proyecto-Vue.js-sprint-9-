<template>
  <!-- card con la info del personaje -->
  <div class="card m-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          :src="`${personajeActual.thumbnail.path}.${personajeActual.thumbnail.extension}`"
          :alt="personajeActual.name"
          class="img-thumbnail"
        />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">{{ personajeActual.name }}</h5>
          <p>{{ personajeActual.description }}</p>
          <p class="card-text">
            <small>Modificado: {{ fecha(personajeActual.modified) }}</small>
          </p>
          <a :href="infoComic[0].url" target="_blank">Info comics</a>
        </div>
      </div>
    </div>
  </div>
  <button @click="add">ver comics</button>
  <button @click="volver">volver</button>
  <!-- comics -->
  <div class="d-flex flex-wrap">
    <div class="w-25" v-for="item in comics" :key="item.id">
      <img
        :src="`${item.thumbnail.path}/portrait_incredible.${item.thumbnail.extension}`"
        :alt="item.name"
        class="img-thumbnail"
      />
      <h5>{{ item.title }}</h5>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "InfoPersonaje",
  data() {
    return {
      // comics: [],
    };
  },
  computed: {
    ...mapState(["personajeActual", "comics"]),
    ...mapGetters(["infoComic"]),
  },
  methods: {
    ...mapMutations(["setMostrarPersonaje", "resetComics"]),
    ...mapActions(["add"]),
    //ocultar personaje y borrar nombre url
    volver() {
      this.setMostrarPersonaje(false);
      this.$router.replace("/personajes");
    },
    //cambio de formato de la fecha
    fecha(e) {
      e = new Date(e);
      return e.toLocaleString();
    },
  },
  created() {
    this.resetComics();
    console.log(this.personajeActual)
  },
};
</script>

<style>
</style>