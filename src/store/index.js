import { createStore } from "vuex";

export default createStore({
    state: {
        url1: "http://gateway.marvel.com/v1/public/characters?offset=",
        url2: "http://gateway.marvel.com/v1/public/characters?limit=30&nameStartsWith=",
        url3: "http://gateway.marvel.com/v1/public/characters/",
        key: "&ts=1&apikey=f66bb534e1062c38d8390f963da2ffab&hash=11a0428e1f3971eb6be6902aa47ada32",
        offset: 0,
        total: 1,
        personajes: [],
        buscados: [],
        buscar: '',
        mostrarPersonaje: false,
        personajeActual: '',
        comics: [],
    },
    mutations: {
        addPersonajes(state, resp) {
            state.personajes = [...state.personajes, ...resp.data.results];
            state.total = resp.data.total;
        },
        addOffset(state) {
            state.offset += 20;
        },
        addBuscar(state, resp) {
            state.buscar = resp;
        },
        addBuscados(state, resp) {
            state.buscados = [...resp.data.results];
        },
        resetBuscados(state) {
            state.buscados = [];
        },
        setMostrarPersonaje(state, resp) {
            state.mostrarPersonaje = resp;
        },
        addPersonajeActual(state, resp){
            state.personajeActual = resp;
        },
        addComics( state, resp ) {
            //si el objeto variantDescription = true tiene una portada escpecial y no se muestra(posiblemente en premium)
            state.comics = resp.data.results.filter(item => !item.variantDescription);
        },
        resetComics( state ){
            state.comics = [];
        }
    },
    actions: {
        async add({ commit, getters }, valor) {
            const data = await fetch(valor == 'url1' ? getters.urlStandard: valor == 'url2' ? getters.urlBuscar : getters.urlComics);
            const resp = await data.json();
            commit(valor == 'url1' ? 'addPersonajes': valor == 'url2' ? 'addBuscados': 'addComics' , resp)
        },
    },
    getters: {
        urlStandard(state) {
            return `${state.url1}${state.offset}${state.key}`;
        },
        urlBuscar(state) {
            return `${state.url2}${state.buscar}${state.key}`;
        },
        totalPersonajes( state ) {
            return state.total;
        },
        idPersonajeActual( state ) {
            return state.personajeActual.id;
        },
        urlComics(state, getters){
            return `${state.url3}${getters.idPersonajeActual}/comics?${state.key}`;
        },
        infoComic( state ){
            return state.personajeActual.urls.filter( item => item.type == 'comiclink');
        }
    },
    modules: {
    }

})