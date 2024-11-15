// Importar las funciones necesarias desde firebaseConfig.js
import { db, ref, get } from './firebaseConfig.js';

// Función para cargar productos
async function loadProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // Limpia el contenido previo
  
    // Crear una referencia a la colección 'products' en la base de datos
    const productsRef = ref(db, 'products');
    const productsSnapshot = await get(productsRef); // Usar get() en lugar de productsRef.get()
  
    if (productsSnapshot.exists()) {
      const products = productsSnapshot.val();
      Object.keys(products).forEach((key) => {
        const product = products[key];
        productsList.innerHTML += `
          <div class="product">
            <img src="${product.imageUrl}" alt="${product.name}" style="width: 150px; height: 150px;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <div class="product-buttons">
              <button onclick="buyNow('${key}')">Comprar</button>
            </div>
          </div>`;
      });
    } else {
      productsList.innerHTML = '<p>No hay productos disponibles.</p>';
    }
  }
  
  // Función para guardar el producto en el carrito y redirigir a la página de compras
  window.buyNow = function (productId) {
    const productsRef = ref(db, `products/${productId}`);
    get(productsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const product = snapshot.val();
        const productDetails = {
          id: productId,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: 1, // Empieza con 1 unidad
        };
  
        // Guardar el producto en el localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productDetails);
        localStorage.setItem('cart', JSON.stringify(cart));
  
        // Redirigir a la página de compras
        window.location.href = 'compras.html';
      }
    });
  };
  
  // Cargar los productos al inicio
  loadProducts();
  