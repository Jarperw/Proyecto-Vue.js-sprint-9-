<template>
  <footer id="footer" class="text-center text-white position-relative">
    <div class="container d-flex flex-column flex-md-row align-items-center justify-content-md-between">
      <div class="logo mb-4">
        <img src="/logo/logo.png" alt="logo" />
      </div>
      <div class="pb-md-2">
        <section class="social d-flex flex-column align-items-center align-items-md-end">
          <p class="mb-1 me-md-5">SIGUE A MARVEL</p>
          <ul class="navbar-nav d-flex flex-row justify-content-end">
            <li class="nav-item ms-md-2">
              <a class="nav-link pe-2" href="https://www.facebook.com/Marvel/">
                <img class="red" src="/icons/facebook.svg" alt="" />
              </a>
            </li>
            <li class="nav-item ms-2">
              <a class="nav-link p-2" href="#">
                <img class="red" src="/icons/instagram.svg" alt="" />
              </a>
            </li>
            <li class="nav-item ms-2">
              <a class="nav-link p-2" href="#">
                <img class="red" src="/icons/youtube.svg" alt="" />
              </a>
            </li>
            <li class="nav-item ms-2">
              <a class="nav-link p-2" href="#">
                <img class="red color" src="/icons/twitter.svg" alt="" />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <div>
      <h5 class="giro text-danger d-inline-block">Con la colaboracion de Albert Studios</h5>
    </div>
    <div class="copyright text-center py-3 pt-md-4 pb-md-0">
      <p class="mb-md-2">Datos proporcionados por Marvel. © 2014 Marvel</p>
    </div>
    <div class="lista py-1 pt-md-0">
      <ul class="d-flex flex-column flex-md-row flex-wrap justify-content-center px-4 mb-1 mb-md-5">
        <li class="nav-link"><a href="#">Condiciones de uso</a></li>
        <li class="nav-link"><a href="#">Política de privacidad</a></li>
        <li class="nav-link"><a href="#">Sus derechos de privacidad del estado de EE. UU.</a></li>
        <li class="nav-link mb-0"><a href="#">No vender mi información</a></li>
        <li class="nav-link"><a href="#">Politica de privacidad en lina para niños</a></li>
        <li class="nav-link"><a href="#">Acuerdo de licencia</a></li>
        <li class="nav-link"><a href="#">Anuncios basados ​​en intereses</a></li>
        <li class="nav-link"><a href="#">Términos de Marvel Insider</a></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
footer {
  padding-top: 2.5em;
  background: #202124;
  .logo {
    img{
      width: 10em;
    }
  }
  .giro{
    transition: all 0.5s;
  }
  .giro:hover{
    transform: rotate(2deg);
  }
  .social,
  .copyright{
    p {
      font-size: 0.9em;
    }
    li {
      align-self: center;
      .red {
        width: 1.3em;
      }
    }
    img:hover {
      filter: drop-shadow(0 0 5px red);
    }
    span {
      margin-left: 1.5em;
      padding-top: 1.6em;
      border-left: 0.1em solid #555;
    }
  }
  .lista {
    li {
      position: relative;
      margin-bottom: 0.45em;
      a {
        color: #fff;
        font-size: 0.75em;
        margin-right: 1em;
      }
      a:hover {
        filter: drop-shadow(0 3px 10px #fff);
      }
    }
    @media (min-width: 768px) {
      li {
        margin-bottom: 0em;
      }
    }
  }
}






</style>