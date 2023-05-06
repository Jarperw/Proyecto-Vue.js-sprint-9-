import { createStore } from "vuex";
import usuarios from '../modules/usuarios';

export default createStore({
    state: {
        url: "http://gateway.marvel.com/v1/public/characters?offset=",
        urlBuscar: "http://gateway.marvel.com/v1/public/characters?limit=40&nameStartsWith=",
        urlInfo: "http://gateway.marvel.com/v1/public/comics/47176",
        key: "&ts=1&apikey=f66bb534e1062c38d8390f963da2ffab&hash=11a0428e1f3971eb6be6902aa47ada32",
        //personajes
        personajes: [],
        mostrarPersonaje: false,
        personajeActual: '',
        offset: 0,
        total: 1,
        ordenInverso: false,
        //buscador
        buscados: [],
        buscar: '',
        coincidencias: 0,
        //comics
        comics: [],
        comicActual: '',
        offsetComics: 0,
        totalComics: '',
        //infoComics
        infoComics: [],
    },
    mutations: {
        addPersonajes(state, resp) {
            state.personajes = [...state.personajes, ...resp.data.results];
            state.total = resp.data.total;
        },
        addPersonajeActual(state, resp) {
            state.personajeActual = resp;
            // console.log(state.personajeActual,'person actual')
            //de aqui se puede sacar el total de comics, la url de los comics y le de la info comics
        },
        addOffset(state, resp = true) {
            resp ? state.offset += 20: state.offset -= 20;
        },
        addBuscar(state, resp) {
            state.buscar = resp;
        },
        addBuscados(state, resp) {
            state.buscados = [...resp.data.results];
            state.coincidencias = resp.data.total;
            // console.log(state.coincidencias, 'total busqueda')
        },
        addComics(state, resp) {
            //si el objeto variantDescription = true tiene una portada escpecial y no se muestra(posiblemente en premium)
            state.comics = [...state.comics, ...resp.data.results]//.filter(item => !item.variantDescription)];//deja de mostrar los premium...
            state.totalComics = resp.data.total;
            // console.log(resp.data)
            // console.log(resp.data.total)//aqui tambien se saca el total de comics y el offset de comics
        },
        addOffsetComics(state) {
            state.offsetComics += 20;
        },
        addUrlInfo(state, resp) {
            state.urlInfo = resp;
        },
        addInfoComic(state, resp) {
            state.infoComics = resp.data.results;
            // console.log(state.infoComics);
        },
        setMostrarPersonaje(state, resp) {
            state.mostrarPersonaje = resp;
        },
        setOrden(state, resp) {
            state.ordenInverso = resp;
            this.commit('resetPersonajes');
        },
        resetPersonajes(state) {
            state.personajes = [];
            state.offset = 0
            state.mostrarPersonaje = false;
        },
        resetBuscados(state) {
            state.buscados = [];
        },
        resetComics(state) {
            state.comics = [];
            state.offsetComics = 0;
        },
    },
    actions: {
        async add({ commit, getters }, valor) {
            let url, mutacion;

            switch (valor) {
                case 'ver':
                    url = getters.urlVer;
                    mutacion = 'addPersonajes';
                    break;
                case 'buscar':
                    url = getters.urlBuscar;
                    mutacion = 'addBuscados';
                    break;
                case 'comics':
                    url = getters.urlComics;
                    mutacion = 'addComics';
                    break;
                case 'info':
                    url = getters.urlInfoComic;
                    mutacion = 'addInfoComic';
                    break;
            }

            const data = await fetch(url);
            const resp = await data.json();
            commit(mutacion, resp);
        },
    },
    getters: {
        urlVer(state) {
            if (state.ordenInverso) {
                return `${state.url}${state.offset}&orderBy=-name${state.key}`;
            } else {
                return `${state.url}${state.offset}${state.key}`;
            }
        },
        urlBuscar(state) {
            return `${state.urlBuscar}${state.buscar}${state.key}`;
        },
        urlComics(state) {
            return `${state.personajeActual.comics.collectionURI}?${state.key}&offset=${state.offsetComics}`;
        },
        urlInfoComic(state) {
            return `${state.urlInfo}?ts=1&apikey=f66bb534e1062c38d8390f963da2ffab&hash=11a0428e1f3971eb6be6902aa47ada32`;
        },
        totalPersonajes(state) {
            return state.total;
        },
        infoComiclink(state) {
            return state.personajeActual.urls.filter(item => item.type == 'comiclink');
        },
        infoBuscar(state) {
            if (state.coincidencias <= 0) return `No hay coincidencias`;
            if (state.coincidencias > state.buscados.length) return `Se mas preciso`;
            if (state.coincidencias <= state.buscados.length) return `Esto es todo lo que se encontro`;
        },
        marcado(state) {
            return state.ordenInverso;
        }
    },
    modules: {
        usuarios,
    }

})