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
        msgBusqueda: '',
        //comics
        comics: [],
        comicActual: '',
        offsetComics: 0,
        totalComics: 1,
        //infoComics
        infoComics: [],
        sinComics: false,
        altura: 'auto',
    },
    mutations: {
        addPersonajes(state, resp) {
            state.personajes = [...state.personajes, ...resp.data.results];
            state.total = resp.data.total;
        },
        addPersonajeActual(state, resp) {
            state.personajeActual = resp;
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
            this.commit('setMsgBusqueda', state.coincidencias)
        },
        addComics(state, resp) {
            state.comics = [...state.comics, ...resp.data.results]
            state.totalComics = resp.data.total < 1 ? 1: resp.data.total;
            state.sinComics = resp.data.total < 1 ? true: false;//si no hay comics
        },
        addOffsetComics(state) {
            state.offsetComics += 20;
        },
        addUrlInfo(state, resp) {
            state.urlInfo = resp;
        },
        addInfoComic(state, resp) {
            state.infoComics = resp.data.results;
        },
        setMostrarPersonaje(state, resp) {
            state.mostrarPersonaje = resp;
        },
        setOrdenar(state, resp) {
            state.ordenInverso = resp;
            this.commit('resetPersonajes');
        },
        setAltura(state, resp) {
            state.altura = resp;
        },
        setMsgBusqueda(state, resp){
            if (resp <= 0) state.msgBusqueda = `No hay coincidencias`;
            else if (resp > state.buscados.length) state.msgBusqueda = `Se mas preciso`;
            else if (resp <= state.buscados.length) state.msgBusqueda = `Esto es todo lo que se encontro`;
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
            state.sinComics = false;
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
            this.commit('setAltura', 'auto');
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
        marcado(state) {
            return state.ordenInverso;
        },
        ImagenPersonaje(state){
            const imagen = state.personajeActual.thumbnail.path;
            if(imagen.includes('image_not_available') || imagen.includes('f/60/4c002e0305708')) return '/img/error.gif';
            else return `${imagen}.${state.personajeActual.thumbnail.extension}`;
        }
    },
    modules: {
        usuarios,
    }

})