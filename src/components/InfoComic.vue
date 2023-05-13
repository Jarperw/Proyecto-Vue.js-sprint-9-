<template>
  <!-- Modal premium -->
  <div v-if="premium" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-3 border-black" v-for="item in infoComics" :key="item.id">
        <div class="modal-header border-black">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{item.title}}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex flex-column flex-lg-row gap-3">
          <div class="imagen col-lg-5">
            <img :src="`${item.images[0].path}.jpg`" class="img-thumbnail">
          </div>
          <div class="col-lg-7">
            <div class="me-lg-4">
              <h5>Personajes</h5>
              <p>{{item.characters.items.map(item => item.name.replace('(HAS)', '')).join(", ")}}</p>
              <h5>Creadores</h5>
              <p>{{item.creators.items.map(item => {return `${item.role}: ${item.name}`}).join(", ")}}</p>
              <h5>Descripción</h5>
              <p>{{item.description}}</p>
              <h5>Número de páginas</h5>
              <p>{{item.pageCount}} Páginas</p>
              <h5>Precios</h5>
              <div v-for="(precio, index) in item.prices" :key="index">
                <p>En la tienda {{precio.type}}: {{precio.price}}$</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-black">
          <button ref="modal" type="button" class="btn btn-danger text-black" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal normal-->
  <div v-else class="modal  border-2" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-3 border-black">
        <div class="modal-header border-black">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Acceso denegado</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Lo siento, este contenido sólo es para usuarios Premium.</h5>
        </div>
        <div class="modal-footer border-black">
          <button ref="modal" type="button" class="btn btn-danger text-black" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary text-black" @click="irPerfil()">Házte Premium</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name:'InfoComic',
    props: ['premium'],
    computed: {
        ...mapState(["infoComics"]),
    },
    methods: {
      irPerfil(){
        this.$router.replace('/perfil');
      }
    },
    beforeUnmount() {
    //si se queda el modal abierto lo cierra
    if(this.$refs.modal){
      this.$refs.modal[0] ? this.$refs.modal[0].click(): this.$refs.modal.click();
    }
  },
}
</script>

<style lang="scss" scoped>
.modal{
  background: #fff6;
  .btn-close:focus {
    box-shadow: none;
  }
 .imagen{
  border: 0.15em solid #000;
  border-radius: 0.2em;
    img{
      @media (min-width: 992px) {
        width: 720px;
      }
    }
  }
}

</style>