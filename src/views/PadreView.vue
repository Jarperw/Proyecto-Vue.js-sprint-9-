<template>
    <body>
                <button @click="mostrar = !mostrar">mostrar</button> 
        <div v-if="!mostrar"> 
            <h1 class="text-center">Intersection observer example</h1>
            <div class="px-4 py-5 my-5 text-center">
                <h1  v-for="passenger in passengers" :key="passenger" class="display-5 fw-bold">{{passenger.name}} - Total trips: {{passenger.trips}}</h1>
                <br>
            </div>
            <div id="observer" ></div>
        </div> 
        <Hijo v-else :mostrar="mostrar" @ocultar="mostrar = $event"/>    
        <button @click="mostrar = !mostrar">referencia</button>  
 
    </body>
</template>

<script>
import Hijo from '../components/Hijo.vue'

export default {
    components:{Hijo},
    data() {
        return {
            page: 1,
            passengers:[],
            mostrar: false
        }
    },
    methods: {
      getPassengerList: function () {
          fetch(`https://api.instantwebtools.net/v1/passenger?page=${this.page}&size=10`) //https://www.instantwebtools.net/fake-rest-api
              .then(res => res.json())
              .then(data => {
                this.passengers.push(...data.data)
                })
      },
      callback (entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                this.page = this.page + 1;
                this.getPassengerList();
                console.log(this.page)
            }
        });
      }
    },
    mounted() {
    //   this.getPassengerList();
      const options = {
          root: null,
          rootMargin: "0px",
          threshold: 0.5
      };
      const observer = new IntersectionObserver(this.callback, options);
      const observerHtmlElement = document.getElementById('observer');
      observer.observe(observerHtmlElement);
    },
    watch: {
        mostrar(valor){
            if(!mostrar)this.callback
        }
    },
}
</script>

