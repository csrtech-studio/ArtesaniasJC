// Importar las funciones necesarias de Firebase
import { app, auth} from './firebaseConfig.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Referencia al nodo del carrusel en Realtime Database
const carouselRef = ref(getDatabase(app), 'carrusel');

// Función para cargar las imágenes del carrusel
async function loadCarouselImages() {
    const carouselImages = document.getElementById('carousel-images');
    
    if (!carouselImages) {
        console.error("No se encontró el contenedor de imágenes del carrusel.");
        return;
    }

    carouselImages.innerHTML = ''; // Limpiar el contenedor antes de cargar

    try {
        // Obtener las imágenes del carrusel desde la base de datos
        const carouselSnapshot = await get(carouselRef);
        
        if (carouselSnapshot.exists()) {
            const images = carouselSnapshot.val();
            Object.keys(images).forEach((key) => {
                const imageUrl = images[key].url;
                // Añadir cada imagen al contenedor del carrusel
                carouselImages.innerHTML += `
                    <div class="carousel-image-container">
                        <img src="${imageUrl}" alt="Imagen del carrusel">
                    </div>`;
            });
        } else {
            carouselImages.innerHTML = '<p>No hay imágenes en el carrusel.</p>';
        }
    } catch (error) {
        console.error("Error al cargar las imágenes del carrusel:", error);
        carouselImages.innerHTML = '<p>No se pudieron cargar las imágenes.</p>';
    }
}

// Asegurarse de que el archivo esté correctamente cargado y luego cargar las imágenes
document.addEventListener('DOMContentLoaded', () => {
    loadCarouselImages(); // Cargar las imágenes del carrusel
});
