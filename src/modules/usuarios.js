import {
    signOut,
    updateProfile,
    updatePassword,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from "../firebase/firebase";
import router from '../router'

export default {
    namespaced: true,

    state: {
        usuarioActual: '',
        validacion: null,
        error: {
            condiciones: '',
            password: '',
            nuevoPassword: '',
            passwordActual: '',
            email: '',
            apellido: '',
            nombre: '',
            nickname: '',
        },
        forgot: {
            email: '',
            error: '',
        },
        errorFirebase: '',
        editar: false,
        redireccionar: null,
    },
    mutations: {
        addUsuario(state, resp) {
            state.usuarioActual = resp;
        },
        //validaciones formularios
        addValidacion(state, resp) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const arrayResp = Object.keys(resp); //pasa el objeto resp a array
            state.validacion = true;

            if (arrayResp.includes('password')) {
                if (resp.password.length < 6) {
                    state.error.password = 'is-invalid';
                    state.validacion = false;
                }
            }
            if (!emailRegex.test(resp.email)) {
                state.error.email = 'is-invalid';
                state.validacion = false;
            }

            if (arrayResp.length < 3) return;//si el objeto es de login para aqui

            if (arrayResp.includes('condiciones')) {
                if (resp.condiciones == false) {
                    state.error.condiciones = 'is-invalid';
                    state.validacion = false;
                }
            }
            if (resp.apellido == '') {
                state.error.apellido = 'is-invalid';
                state.validacion = false;
            }
            if (resp.nombre == '') {
                state.error.nombre = 'is-invalid';
                state.validacion = false;
            }
            if (resp.nickname.length < 3) {
                state.error.nickname = 'is-invalid';
                state.validacion = false;
            }
            if (arrayResp.includes('passwordActual')) {
                if (resp.passwordActual.length < 6) {
                    state.error.passwordActual = 'is-invalid';
                    state.validacion = false;
                }
                if (resp.nuevoPassword.length < 6) {
                    state.error.nuevoPassword = 'is-invalid';
                    state.validacion = false;
                }
            }
        },
        addErrorFirebase(state, resp) {
            if (resp.code == 'auth/wrong-password') {
                state.errorFirebase = resp;
                state.error.password = 'is-invalid';
            } else {
                state.errorFirebase = resp;
                state.error.email = 'is-invalid';
            }
        },
        addErrorFirebaseModificar(state, resp) {
            if (resp.code == 'auth/wrong-password') {
                state.errorFirebase = resp;
                state.error.passwordActual = 'is-invalid';
            } else {
                state.errorFirebase = resp;
                state.error.email = 'is-invalid';
            }
        },
        addForgotError(state, resp) {
            state.forgot.error = resp;
        },
        addForgotEmail(state, resp) {
            state.forgot.email = resp;
        },
        setEditar(state, resp) {
            state.editar = resp;
        },
        setRedireccionar(state, resp) {
            state.redireccionar = resp
        },
        resetError(state, resp) {
            if (resp) {
                state.error[resp] = '';
                if (resp == 'email' || resp == 'password' || resp == 'passwordActual') {
                    state.errorFirebase = '';
                }
            } else {
                for (let key in state.error) {
                    state.error[key] = '';
                }
                state.errorFirebase = '';
            }
        },
        resetForgot(state) {
            state.forgot.error = "";
            state.forgot.email = "";
        },
    },
    actions: {
        //cargar usuario actual
        async cargarUsuario({ state, commit }) {
            if (auth.currentUser) {
                const data = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));//data: info del usuario en firestore 
                const dataContent = data.data();
                commit('addUsuario', dataContent);

                if (typeof data.data() !== 'undefined') {
                    router.push(state.redireccionar || '/');
                }
            }
        },
        //cerrar sesion
        async cerrarSesion({ commit }) {
            await signOut(auth);
            commit('addUsuario', '');
            router.push("/");
            console.log('sesion cerrada');
        },
        //modificar datos usuario
        async addCambios({ commit, dispatch }, resp) {
            try {
                const user = auth.currentUser;
                const credential = EmailAuthProvider.credential(user.email, resp.passwordActual);//verifica contraseña actual y se crea credencial

                await reauthenticateWithCredential(user, credential);//verifica al usuario con la credencial creada
                await updateProfile(user, {// Actualizamos el displayName en auth
                    displayName: resp.nombre,
                });
                await updateEmail(user, resp.email);// Actualizamos el email en auth
                await updatePassword(user, resp.nuevoPassword);// Actualizamos la contraseña en auth
                await updateDoc(doc(db, 'usuarios', user.uid), {// Actualizar firestore con updatedDoc
                    nickname: resp.nickname,
                    nombre: resp.nombre,
                    apellido: resp.apellido,
                    email: resp.email,
                    tipo: resp.tipo
                });

                console.log('modificado');
                commit('setEditar', false);
                dispatch('cargarUsuario');
            } catch (error) {
                commit('addErrorFirebaseModificar', error);
            }
        },
        //registro usuario en firebase
        async registroFire({ commit, dispatch }, resp) {
            try {
                const { user } = await createUserWithEmailAndPassword( //crea usuario en firebase auth
                    auth,
                    resp.email,
                    resp.password
                );
                await updateProfile(auth.currentUser, { //se le da valor a displayName de auth
                    displayName: resp.nickname,
                });
                await setDoc(doc(db, "usuarios", user.uid), { //guarda datos en firestore
                    nickname: resp.nickname,
                    nombre: resp.nombre,
                    apellido: resp.apellido,
                    email: resp.email,
                    tipo: resp.tipo
                });
                console.log('registrado');
                dispatch('cargarUsuario');
            } catch (error) {
                commit('addErrorFirebase', error);
            }
        },
        //login usuario en firebase
        async loginFire({ state, commit, dispatch }, resp) {
            try {
                await signInWithEmailAndPassword(auth, resp.email, resp.password);//autentificar usuario con contraseña

                dispatch('cargarUsuario');
                console.log("logeado");
            } catch (error) {
                commit('addErrorFirebase', error);
            }
        },
        //restablecer contraseña
        async forgotPassword({ commit }, email) {
            try {
                await sendPasswordResetEmail(auth, email);//si existe el email envia email restablecer
                commit('addForgotEmail', '');
            } catch (error) {
                commit('addForgotError', error);
            }
        },
    },
    getters: {
        msgForgot(state) {
            if (state.forgot.error.code == 'auth/too-many-requests') {
                return 'Se ha excedido el limite de solicitudes.';
            } else if (state.forgot.error.code == 'auth/user-not-found') {
                return 'Usuario no encontrado.';
            } else {
                return 'Por favor, introduce un email valido.';
            }
        },
        msgMail(state) {
            if (state.errorFirebase.code == 'auth/user-not-found') {
                return 'Usuario no encontrado.';
            }
            if (state.errorFirebase.code == 'auth/email-already-in-use') {
                return 'El email ya esta registrado.';
            }
            if (state.errorFirebase.code == 'auth/too-many-requests') {
                return 'Se ha excedido el limite de solicitudes.';
            }
        },
        msgPassword(state) {
            if (state.errorFirebase.code == 'auth/wrong-password') {
                return 'Contraseña incorrecta.';
            }
        },
        nombreUsuario(state) {
            return (state.usuarioActual) ? state.usuarioActual.nickname : '';
        }
    }
}