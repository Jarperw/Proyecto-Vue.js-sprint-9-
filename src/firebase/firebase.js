import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // configura aquí tus credenciales de Firebase
  apiKey: "AIzaSyB446rHcxBjuPzpDRHvF39NREZXXK5RCOs",
  authDomain: "marvel-bf013.firebaseapp.com",
  projectId: "marvel-bf013",
  storageBucket: "marvel-bf013.appspot.com",
  messagingSenderId: "974314420420",
  appId: "1:974314420420:web:9c31d11da68b33628f3191"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar las instancias necesarias de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
