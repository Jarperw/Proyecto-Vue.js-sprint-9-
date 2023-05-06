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
        editar: false,
        logeado: '',
        forgot: {
            email: '',
            error: '',
        }

    },
    mutations: {
        addUsuario(state, resp) {
            state.usuarioActual = resp;
        },
        //validaciones formularios
        addValidacion(state, resp) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const arrayResp = Object.keys(resp); //pasar el objeto a un array
            state.validacion = true;

            if (arrayResp.includes('condiciones')) {
                if (resp.condiciones == false) {
                    state.error.condiciones = 'is-invalid';
                    state.validacion = false;
                }
            }
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

            if (arrayResp.length <= 3) return;

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
        addForgotError(state, resp) {
            state.forgot.error = resp;
        },
        addForgotEmail(state, resp) {
            state.forgot.email = resp;
        },
        setEditar(state, resp) {
            state.editar = resp;
        },
        resetError(state, resp) {
            if (resp) {
                state.error[resp] = '';
            } else {
                for (let key in state.error) {
                    state.error[key] = '';
                }
            }
        },
        resetForgot(state) {
            state.forgot.error = "";
            state.forgot.email = "";
        },
    },
    actions: {
        //si existe cargar usuario actual en perfil
        async cargarUsuario({ commit }) {
            if (auth.currentUser) {
                const data = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));//data: info del usuario en firestore 
                commit('addUsuario', data.data())
            }
        },
        //cerrar sesion
        async cerrarSesion() {
            await signOut(auth);
            router.push("/");
            console.log('sesion cerrada');
        },
        //cambio datos usuario
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
                console.error(error)
            }
        },
        //registro usuario en firebase
        async registro({ }, resp) {
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
                router.push('/');
            } catch (error) {
                console.error(error);
            }
        },
        //login usuario en firebase
        async loginFire({ }, resp) {
            try {
                await signInWithEmailAndPassword(auth, resp.email, resp.password);//autentificar usuario con contraseña

                console.log("logeado");
                router.push("/perfil");
            } catch (error) {
                console.error(error);
            }
        },
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
        smsForgot(state) {
            if (state.forgot.error.code == 'auth/too-many-requests') {
                return 'Has excedido el limite de solicitudes, pruebalo mas tarde.';
            } else if (state.forgot.error.code == 'auth/user-not-found') {
                return 'El email no esta registrado.';
            } else {
                return 'Introduce un email valido.';
            }
        }
    }
}