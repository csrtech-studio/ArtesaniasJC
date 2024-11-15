// login.js

// Importar los servicios necesarios de Firebase
import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Obtener los elementos del formulario
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Añadir evento de submit al formulario
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = emailInput.value;
    const password = passwordInput.value;

    // Intentar iniciar sesión con los datos proporcionados
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Si el inicio de sesión es exitoso, mostrar mensaje de éxito
            showMessage('success', 'Inicio de sesión exitoso. Redirigiendo...');
            setTimeout(() => {
                window.location.href = "admin.html"; // Redirige a la página principal después de 2 segundos
            }, 2000); // Espera 2 segundos para que el usuario vea el mensaje
        })
        .catch((error) => {
            // Mostrar mensajes de error si algo falla
            const errorCode = error.code;
            let errorMsg = 'Error Revise su informacion';
            if (errorCode === 'auth/user-not-found') {
                errorMsg = 'El correo electrónico no está registrado.';
            } else if (errorCode === 'auth/wrong-password') {
                errorMsg = 'Contraseña incorrecta.';
            } else if (errorCode === 'auth/invalid-email') {
                errorMsg = 'El correo electrónico no es válido.';
            }
            showMessage('danger', errorMsg);
        });
});

// Función para mostrar mensajes
function showMessage(type, message) {
    errorMessage.classList.remove('d-none');
    errorMessage.classList.add(`alert-${type}`);
    errorMessage.textContent = message;
}
