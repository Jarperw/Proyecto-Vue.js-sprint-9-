<template>
  <div class="imagen mx-auto">
    <img class="img-fluid cover" src="/img/img1.jpg" alt="" />
  </div>
  <div class="container-fluid pb-5" :style="{ height: altura }" ref="altura">
    <!-- BUSCAR -->
    <div class="buscar row gap-2 bg-dark p-4 position-relative border-top border-bottom border-black border-5">
      <img v-if="!mostrarPersonaje" class="position-absolute" src="/icons/search.svg" />
      <input
        v-if="!mostrarPersonaje"
        class="p-2 ps-4 pe-5 rounded-5 my-2"
        type="text"
        v-model.trim="buscar"
        placeholder="Buscar por nombre"
      />
      <h2 v-else class="text-white text-center">Personaje</h2>
      <h4 v-if="buscar && !mostrarPersonaje" class="text-danger text-truncate m-0">{{ msgBusqueda }}</h4>
    </div>
    <!-- ORDENAR -->
    <div 
      v-if="!buscar && personajes.length && !mostrarPersonaje" 
      class="ordenar m-3 p-3 d-flex justify-content-between border border-black border-3 rounded-5 bg-white"
    >
      <h3 class="me-3 mb-0 fw-bold text-black">Ordenar |</h3>
      <div>
        <img :class="!marcado ? boton: 'btn'" src="/icons/arrow-down-a-z-solid.svg" @click="orden(false)"/>
        <img :class="marcado ? boton: 'btn'" src="/icons/arrow-down-z-a-solid.svg" @click="orden(true)"/>
      </div>
    </div>
    <!-- CARD -->
    <div v-if="!mostrarPersonaje" class="personajes mt-4">
      <div class="d-flex flex-wrap gap-3 justify-content-center">
        <div
          class="card border-3 bg-dark text-danger"
          v-for="item in buscar ? buscados : personajes"
          :key="item.id"
          @click="verPersonaje(item)"
        >
          <img
            class="card-img-top border-bottom border-2 border-black"
            :src="errorImagen(`${item.thumbnail.path}/standard_xlarge.${item.thumbnail.extension}`)"
            :alt="item.name"
          />
          <div class="card-body">
            <h5 class="card-text">{{ item.name }}</h5>
          </div>
        </div>
      </div>
      <div ref="last"></div>
    </div>
    <Info-personaje v-else />
  </div>

  <!-- SUBIR BAJAR -->
  <div v-if="offset >= 20" class="desplazar d-flex flex-column position-fixed z-1 me-2">
    <a href="#"><img src="/icons/subir2.svg" alt="subir"></a>
    <a href="#footer"><img src="/icons/bajar2.svg" alt="bajar"></a>
  </div>
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
      boton: 'btn btn-danger border-2 border-black'
    };
  },
  computed: {
    ...mapState(["personajes", "offset", "offsetComics", "buscados", "mostrarPersonaje", "altura", "msgBusqueda"]),
    ...mapGetters(["totalPersonajes", "marcado"]),
  },
  methods: {
    ...mapActions(["add"]),
    ...mapMutations([
      "addOffset",
      "addBuscar",
      "resetBuscados",
      "setMostrarPersonaje",
      "addPersonajeActual",
      "setOrdenar",
      "resetPersonajes",
      "setAltura",
    ]),
    errorImagen(imagen) {
      if (imagen.includes("f/60/4c002e0305708")) {
        return "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/standard_xlarge.jpg";
      } else {
        return imagen;
      }
    },
    verPersonaje(personaje) {//mostrar el personaje y cargar el nombre en la url
      this.setMostrarPersonaje(true);
      this.addPersonajeActual(personaje);
      this.$router.replace("/personajes?" + personaje.name);
    },
    async observarScroll() {//observar scroll
      await this.$nextTick();
      const options = { root: document, rootMargion: "0px", threshold: 0 };
      const callback = (entries) => {
        if (
          entries[0].isIntersecting &&
          this.offset < this.totalPersonajes &&
          !this.buscar
        ) {
          this.add("ver");
          this.addOffset();
          console.log("offset", this.offset);
        }
      };
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.$refs.last);
    },
    orden(valor) {
      this.setAltura(this.$refs.altura.clientHeight + "px"); //matener altura actual mientras llama a la api
      this.setOrdenar(valor);
    },
  },
  created() {
    this.observarScroll();
  },
  beforeUnmount() {
    this.resetPersonajes();
  },
  watch: {
    mostrarPersonaje(valor) {
      //reactivar scroll infinito hijo->padre temporizador para dar tiempo a mostrar el DOM
      setTimeout(() => {
        if (!valor) this.observarScroll();
      }, 50);
    },
    buscar(valor) {
      if (!valor) return this.resetBuscados();
      this.setAltura(this.$refs.altura.clientHeight + "px"); //matener altura actual mientras llama a la api

      //700mseg del ultima cambio de buscar, para evitar multiples llamadas
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
.imagen {
  max-width: 1600px;
  // .cover{
  //   width: 100%;
  //   height: 500px;
  //   object-fit: cover;
  // }
}
.container-fluid {
  max-width: 1600px;
  background-image: url("/img/fondo.jpg");

  .buscar {
    input{
      border: none;
    }
    input:focus-visible{
      outline: none;
    }
    img {
      width: 3em;
      top: 2.4em;
      right: 1.8em;
    }
  }

  .ordenar {
    img {
      width: 3em;
    }
  }

  .personajes {
    .card {
      // border: 0.35em solid #000;
      // background: #fff !important;
      // color: #fff !important;
      cursor: pointer;
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
      h5 {
        color: #fff;
        // color: red;
      }
    }
  }
}
.desplazar{
  width: 2.2em;
  bottom: 2.5em;
  right: 0;

}

</style>