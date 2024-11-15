// register.js

// Importar los servicios necesarios de Firebase
import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Obtener los elementos del formulario
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');

// Añadir evento de submit al formulario
registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showMessage('danger', 'Las contraseñas no coinciden.');
        return;
    }

    // Intentar crear un nuevo usuario en Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Si el registro es exitoso, mostrar mensaje de éxito
            showMessage('success', 'Registro exitoso. Redirigiendo al login...');
            setTimeout(() => {
                window.location.href = "login.html"; // Redirige a la página de login después de 2 segundos
            }, 2000); // Espera 2 segundos para que el usuario vea el mensaje
        })
        .catch((error) => {
            // Mostrar mensajes de error si algo falla
            const errorCode = error.code;
            let errorMsg = 'Error desconocido.';
            if (errorCode === 'auth/email-already-in-use') {
                errorMsg = 'Este correo electrónico ya está registrado.';
            } else if (errorCode === 'auth/invalid-email') {
                errorMsg = 'El correo electrónico no es válido.';
            } else if (errorCode === 'auth/weak-password') {
                errorMsg = 'La contraseña es demasiado débil.';
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
