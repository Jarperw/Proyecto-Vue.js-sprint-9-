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
          <a :href="infoComiclink[0].url" target="_blank">Web info comics</a>
        </div>
      </div>
    </div>
  </div>

  <!-- llamada API mostrar comics -->
  <button @click="add('comics')">ver comics</button>

  <!-- volver al componente padre -->
  <button @click="volver()">volver</button>

  <!-- comics del personaje -->
  <div class="d-flex flex-wrap comic">
    <div class="w-25" v-for="item in comics" :key="item.id">
      <img
        data-bs-toggle="modal" data-bs-target="#exampleModal"
        :src="`${item.thumbnail.path}/portrait_incredible.${item.thumbnail.extension}`"
        :alt="item.name"
        class="img-thumbnail"
        @click="info(item.resourceURI)"
      />
      <h5>{{ item.title }}</h5>
    </div>
  </div>
  <div class="py-1" ref="last"></div>

  <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content" v-for="item in infoComics" :key="item.id">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{{item.title}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column flex-lg-row gap-3">
        <div class="imagen">
          <img :src="item.images[0].path + '.jpg'" class="img-thumbnail">
        </div>
        <div class="">
          <h5>Personajes</h5>
          <p>{{item.characters.items.map(item => item.name.replace('(HAS)', '')).join(", ")}}</p>
          <h5>Creadores</h5>
          <p>{{item.creators.items.map(item => {return `${item.role}: ${item.name}`}).join(", ")}}</p>
          <h5>Descripcion</h5>
          <p>{{item.description}}</p>
          <h5>Numero de paginas</h5>
          <p>{{item.pageCount}} Paginas</p>
          <h5>Precios</h5>
          <div v-for="(precio, index) in item.prices" :key="index">
            <p>En la tienda {{precio.type}}: {{precio.price}}$</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button ref="modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "InfoPersonaje",
  computed: {
    ...mapState(["personajeActual", "comics", "totalComics", "offsetComics", "infoComics"]),
    ...mapGetters(["infoComiclink"]),
  },
  methods: {
    ...mapMutations(["setMostrarPersonaje", "resetComics", "addUrlInfo", "addOffsetComics", "resetPersonajes"]),
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
    //llamada api para info del comic usado en premium
    info(url){
      this.addUrlInfo(url);
      this.add('info');
    },
    async observarScroll() {
      await this.$nextTick();
      const options = { root: document, rootMargion: "0px", threshold: 0 };
      const callback = (entries) => {
        if (entries[0].isIntersecting && this.offsetComics < this.totalComics) {

          this.addOffsetComics();
          console.log("offsetComics", this.offsetComics);
          this.add("comics");
        }
      };
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.last);
    },
  },
  beforeUnmount() {
    this.resetComics();
    //si se queda el modal abierto lo cierra
    if(this.$refs.modal){
      this.$refs.modal[0].click()
    }
  },
  watch: {
    comics(valor){
      if(valor.length >= 20){
        this.observarScroll();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.comic{
    img{
        cursor: pointer;
    }
}
.imagen{
  img{
    // width: auto;
    @media (min-width: 992px) {
      width: 720px;
    }
  }
}
</style>