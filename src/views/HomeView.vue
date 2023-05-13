<template>
  <div class="container-fluid position-relative px-0">
    <div class="position-relative">
      <img class="cover" src="/img/16.jpg" alt="imgPortada">
      <svg class="transparente position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#000" fill-opacity="1" d="M0,256L1440,320L1440,320L0,320Z"></path>
      </svg>
    </div>
    <div>
      <h2 class="bg-black text-center text-secondary pb-4 pt-1 m-0">Tus Personajes favoritos</h2>
    </div>
    <div class="position-relative">
      <img class="cover" src="/img/1.jpg" alt="imgPortada">
      <svg class="transparente position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#000" fill-opacity="1" d="M0,256L1440,320L1440,320L0,320Z"></path>
      </svg>
    </div>
    <div>
      <h2 class="bg-black text-center text-secondary pb-4 pt-1 m-0">Todos los clásicos</h2>
    </div>
    <div class="position-relative">
      <img class="cover" src="/img/5.jpg" alt="imgPortada">
      <svg class="transparente position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#000" fill-opacity="1" d="M0,256L1440,320L1440,320L0,320Z"></path>
      </svg>
    </div>
    <div>
      <h2 class="bg-black text-center text-secondary pb-4 pt-1 m-0">Próximamente Marvel Peliculas</h2>
    </div>
    <div class="position-relative">
      <img class="cover" src="/img/10.jpg" alt="imgPortada">
      <div class="logo position-absolute">
        <img class="w-100" src="/logo/logoGuardianes.png" alt="imgPortada">
      </div>
      <svg class="transparente position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#000" fill-opacity="1" d="M0,256L1440,320L1440,320L0,320Z"></path>
      </svg>
    </div>
    <div>
      <h2 class="bg-black text-center text-secondary pb-4 pt-1 m-0">En colaboración con Marvel Studios</h2>
    </div>
    <img class="cover2" src="/img/29.jpg" alt="imgPortada">
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss" scoped>
.container-fluid{
  max-width: 1600px;
  .cover {
    top: 0;
    width: 100%;
    height: 220px;
    object-fit: cover;
    object-position: center;
    @media (min-width: 480px) {
      height: 330px;
    }
    @media (min-width: 576px) {
      height: 400px;
    }
    @media (min-width: 768px) {
      height: 550px;
    }
    @media (min-width: 992px) {
      height: 700px;
    }
    @media (min-width: 1300px) {
      height: 800px;
    }
  }
  .cover2 {
    border-right: 0.2em solid #000;
    border-left: 0.2em solid #000;
    top: 0;
    width: 100%;
    height: 160px;
    object-fit: cover;
    object-position: center;

    @media (min-width: 480px) {
      height: 225px;
    }
    @media (min-width: 576px) {
      height: 260px;
    }
    @media (min-width: 768px) {
      height: 280px;
    }
    @media (min-width: 992px) {
      height: 350px;
    }
    @media (min-width: 1300px) {
      height: 400px;
    }
  }
  .transparente{
    z-index: 20;
    left: 0;
    bottom: 0;
  }
  .logo{
    z-index: 5;
    width: 4em;
    top: 10%;
    left: 7%;
    @media (min-width: 480px) {
      width: 5em
    }
    @media (min-width: 576px) {
      width: 6em;
    }
    @media (min-width: 768px) {
      width: 8em;
    }
    @media (min-width: 992px) {
      width: 10em;
    }
    @media (min-width: 1300px) {
      width: 15em;
    }
  }
}
</style>
