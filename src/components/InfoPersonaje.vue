<template>
<div class="pt-5">
  <!-- PERSONAJE -->
  <div class="personaje card m-3 mt-4 border-3 border-black">
    <div class="row g-0">
      <div class="col-md-5 position-relative">
        <img
          :src="`${ImagenPersonaje}`"
          :alt="personajeActual.name"
          class="img-thumbnail cover"
        />
        <h1 v-if="ImagenPersonaje == '/img/error.gif'" class="text-danger text-nowrap">Imagen no disponible</h1>
      </div>
      <div class="col-md-7">
        <div class="card-body">
          <h2 class="card-title border-bottom border-2 pb-1">{{ personajeActual.name }}</h2>
          <p>{{ personajeActual.description }}</p>
          <p class="card-text">
            <small>Modificado: {{ fecha(personajeActual.modified) }}</small>
          </p>
          <a class="text-decoration-none" :href="infoComiclink[0].url" target="_blank">Web info comics</a>
          <div class="botones mt-4">
            <button class="btn btn-danger text-white me-2" @click="mostrarComics()">ver comics</button>
            <button :class="['btn', 'btn-danger', 'text-white', comics.length ? boton: '']" @click="volver()">volver</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- COMICS -->
  <h1 v-if="comics.length" class="ms-3 text-black">Marvel Comics</h1>
  <h1 v-if="sinComics" class="ms-3 text-black position-absolute">No hay comics</h1>
  <div class="comic d-flex flex-wrap justify-content-center gap-3 mt-4">
    <div class="card border-3 bg-dark text-danger" v-for="item in comics" :key="item.id">
      <img
          data-bs-toggle="modal" data-bs-target="#exampleModal"
          :src="`${item.thumbnail.path}/portrait_incredible.${item.thumbnail.extension}`"
          :alt="item.name"
          class="card-img-top border-bottom border-2 border-black"
          @click="info(item.resourceURI)"
        />
      <div class="card-body">
        <h5 class="card-text">{{ item.title }}</h5>
      </div>
    </div>
  </div>
  <Info-comic :premium="premium"/>
  <div ref="last2"></div>
</div>  
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import InfoComic from './InfoComic.vue';

export default {
  name: "InfoPersonaje",
  components: { InfoComic },
  data() {
    return {
      premium: false,
      boton: 'fixed-bottom rounded-0 border-3 border-dark'
    }
  },
  computed: {
    ...mapState(["personajeActual", "comics", "totalComics", "offsetComics", "sinComics"]),
    ...mapState("usuarios", ["usuarioActual"]),
    ...mapGetters(["infoComiclink", "ImagenPersonaje"]),
  },
  methods: {
    ...mapMutations(["setMostrarPersonaje", "resetComics", "addUrlInfo", "addOffsetComics", "resetPersonajes"]),
    ...mapActions(["add"])
    ,
    volver() {//ocultar personaje y borrar nombre url
      this.setMostrarPersonaje(false);
      this.$router.replace("/personajes");
    },
    fecha(e) {//cambio formato fecha
      e = new Date(e);
      return e.toLocaleString();
    },
    info(url){//llamar api para info del comic
      this.addUrlInfo(url);
      this.add('info');
    },
    async observarScroll() {
      await this.$nextTick();
      const options = { root: document, rootMargion: "0px", threshold: 0 };
      const callback = (entries) => {
        if (entries[0].isIntersecting && this.offsetComics < this.totalComics) {
          
          console.log('llama')
          this.add("comics");
          this.addOffsetComics();
          console.log("offsetComics", this.offsetComics);
        }
      };
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.last2);
    },
    mostrarComics(){
      this.observarScroll();
    }
  },
  created() {
    this.premium = this.usuarioActual.tipo == 'Premium' ? true : false;
  },
  beforeUnmount() {
    this.resetComics();
  },
};
</script>

<style lang="scss" scoped>
.personaje{
  .cover{
    width: 100%;
    height: 29em;
    object-fit: cover;
    object-position: center;
  }
  h1{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.comic{
  .card{
    width: 10em;
    transition: all 0.4s;
    
    @media (min-width: 460px) {
      width: 13em;
    }
    @media (min-width: 1050px) {
      width: 15em;
    }
  }
  .card:hover {
    transform: translateY(-0.5em);
    h5{
      color: #fff;
    }
  }
  img{
    cursor: pointer;
  }
}
</style>