// Importar las funciones necesarias de Firebase para la inicialización y servicios
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, get, child, push, remove, update, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyASB9v9O2Yrq78UycG2xsyYJVVA8J80hok",
    authDomain: "preguntas-frecuentes-purifika.firebaseapp.com",
    projectId: "preguntas-frecuentes-purifika",
    storageBucket: "preguntas-frecuentes-purifika.appspot.com",
    messagingSenderId: "748673560391",
    appId: "1:748673560391:web:f5f2211615a95b2ba0e662",
    measurementId: "G-E2BXKQE67W"
};

// Inicializar Firebase y servicios
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);       // Realtime Database
const storage = getStorage(app);   // Firebase Storage
const auth = getAuth(app);         // Autenticación

// Exportar servicios para uso en otros archivos
export { app, db, storage, auth, ref, set, get, child, push, remove, update, onChildAdded };
