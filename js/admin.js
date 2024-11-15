// Importar las funciones necesarias de Firebase
import { db, storage } from './firebaseConfig.js';
import { getDatabase, ref, set, get, push, remove, update, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { uploadBytes, getDownloadURL, deleteObject, ref as storageRef } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';


// Referencias a la base de datos en tiempo real
const categoriesRef = ref(getDatabase(), 'categories');
const productsRef = ref(getDatabase(), 'products');
const carouselRef = ref(getDatabase(), 'carrusel'); // Referencia al nodo del carrusel en Realtime Database
let editingProductId = null;

// Función para cargar las categorías
async function loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = `
      <tr>
        <th>Categoría</th>
        <th>Acciones</th>
      </tr>
    `; // Limpia la tabla antes de cargar las categorías
  
    const categoriesSnapshot = await get(ref(getDatabase(), 'categories'));
    if (categoriesSnapshot.exists()) {
      const categories = categoriesSnapshot.val();
      Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        const row = document.createElement('tr');
  
        // Crear una celda para el nombre de la categoría
        const nameCell = document.createElement('td');
        nameCell.textContent = category.name;
        row.appendChild(nameCell);
  
        // Crear una celda para el botón de eliminar
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-category');
        deleteButton.dataset.key = categoryId; // Asociar el ID de la categoría
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
  
        categoriesList.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 2;
      cell.textContent = 'No hay categorías disponibles.';
      row.appendChild(cell);
      categoriesList.appendChild(row);
    }
  }
  
  // Función para eliminar una categoría
  async function deleteCategory(categoryId) {
    try {
      const categorySnapshot = await get(ref(getDatabase(), `categories/${categoryId}`));
      if (categorySnapshot.exists()) {
        // Eliminar la categoría en Realtime Database
        await remove(ref(getDatabase(), `categories/${categoryId}`));
        alert('Categoría eliminada');
        window.location.reload();
        loadCategories(); // Volver a cargar las categorías
      } else {
        console.error('La categoría no existe.');
        alert('La categoría no existe.');
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Hubo un error al eliminar la categoría.');
    }
  }
  
  // Escuchar clics en los botones de eliminación de categorías
  document.getElementById('categories-list').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete-category')) {
      const categoryId = e.target.dataset.key; // Obtener el ID de la categoría
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        deleteCategory(categoryId); // Llamar a la función para eliminar la categoría
      }
    }
  });
          

// Añadir categoría
document.getElementById('add-category-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const categoryName = document.getElementById('category-name').value;
  const newCategoryRef = push(categoriesRef);
  await set(newCategoryRef, { name: categoryName });
  alert('Categoría añadida');
  document.getElementById('add-category-form').reset();
  window.location.reload();
});

//AÑADIR PORDUCTOS//

// Añadir o actualizar producto
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const productName = document.getElementById('product-name').value;
  const productDescription = document.getElementById('product-description').value;
  const productPrice = document.getElementById('product-price').value;
  const productStock = document.getElementById('product-stock').value;
  const productCategory = document.getElementById('product-category').value;
  const productImageFile = document.getElementById('product-image').files[0];

  if (!productImageFile && !editingProductId) {
    alert('Por favor, selecciona una imagen para el producto.');
    return;
  }

  try {
    let productImageUrl = null;

    // Si estamos editando el producto, no subimos una nueva imagen
    if (productImageFile) {
      const productImageRef = storageRef(storage, `productos/${productImageFile.name}`);
      await uploadBytes(productImageRef, productImageFile);
      productImageUrl = await getDownloadURL(productImageRef);
    }

    // Si no estamos editando, usamos la URL de la imagen existente
    if (!productImageUrl && editingProductId) {
      const productSnapshot = await get(ref(getDatabase(), `products/${editingProductId}`));
      productImageUrl = productSnapshot.val().imageUrl;
    }

    const newProduct = {
      name: productName,
      description: productDescription,
      price: productPrice,
      stock: productStock,
      category: productCategory,
      imageUrl: productImageUrl
    };

    if (editingProductId) {
      // Si estamos editando, actualizamos el producto
      await update(ref(getDatabase(), `products/${editingProductId}`), newProduct);
      alert('Producto actualizado');
      window.location.reload();
    } else {
      // Si no estamos editando, añadimos el producto
      const newProductRef = push(productsRef);
      await set(newProductRef, newProduct);
      alert('Producto añadido');
    }

    // Restablecer el formulario
    document.getElementById('add-product-form').reset();
    document.getElementById('add-product-btn').textContent = 'Añadir Producto'; // Volver a 'Añadir Producto'
    editingProductId = null; // Limpiar la variable de edición
    loadProducts(); // Recargar los productos
  } catch (error) {
    console.error('Error al añadir o actualizar el producto:', error);
    alert('Hubo un error al añadir o actualizar el producto.');
  }
});

// Función para cargar las categorías en el combobox (select)
async function loadCategoriesForSelect() {
  const categorySelect = document.getElementById('product-category');
  
  try {
    const categoriesSnapshot = await get(ref(getDatabase(), 'categories'));
    if (categoriesSnapshot.exists()) {
      const categories = categoriesSnapshot.val();
      
      // Limpiar las opciones anteriores del select
      categorySelect.innerHTML = '';
  
      // Añadir una opción por defecto
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Selecciona una categoría';
      defaultOption.value = '';
      categorySelect.appendChild(defaultOption);
  
      // Agregar las categorías al select
      Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        
        const option = document.createElement('option');
        option.value = categoryId;  // Usar el ID de la categoría
        option.textContent = category.name;  // Mostrar el nombre de la categoría
        categorySelect.appendChild(option);
      });
    } else {
      console.log('No hay categorías disponibles en la base de datos.');
      alert('No hay categorías disponibles.');
    }
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    alert('Hubo un error al cargar las categorías.');
  }
}

// Función para actualizar el combobox de categorías en tiempo real
function listenForNewCategories() {
  const categorySelect = document.getElementById('product-category');
  
  // Escuchar cambios en la base de datos de categorías
  onChildAdded(ref(getDatabase(), 'categories'), (snapshot) => {
    const category = snapshot.val();
    const categoryId = snapshot.key;

    // Crear una nueva opción para el combobox
    const option = document.createElement('option');
    option.value = categoryId;
    option.textContent = category.name;
    
    // Añadir la nueva categoría al combobox
    categorySelect.appendChild(option);
  });
}

// Función para cargar productos
async function loadProducts() {
  const productsList = document.getElementById('products-list');
  productsList.innerHTML = `
    <tr>
      <th>Imagen</th>
      <th>Nombre</th>
      <th>Descripción</th>
      <th>Precio</th>
      <th>Stock</th>
      <th>Acciones</th>
    </tr>`;

  const productsSnapshot = await get(productsRef);
  if (productsSnapshot.exists()) {
    const products = productsSnapshot.val();
    Object.keys(products).forEach((key) => {
      const product = products[key];
      productsList.innerHTML += `
        <tr>
          <td><img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.price}</td>
          <td>${product.stock}</td>
          <td>
            <button class="edit-product" data-key="${key}">Editar</button>
            <button class="delete-product" data-key="${key}">Eliminar</button>
          </td>
        </tr>`;
    });
  } else {
    productsList.innerHTML += '<tr><td colspan="6">No hay productos disponibles.</td></tr>';
  }
}

// Función para cargar los datos de un producto para editarlo
document.getElementById('products-list').addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('edit-product')) {
    const productId = e.target.dataset.key;
    editingProductId = productId;

    // Cargar los datos del producto en el formulario
    get(ref(getDatabase(), `products/${productId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const product = snapshot.val();
        
        // Cargar los datos del producto en el formulario
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-category').value = product.category; // Asignar categoría
        
        // Mostrar mensaje de que los datos se han cargado
        alert('Los datos han sido cargados al formulario para su actualización.');

        // Cambiar el texto del botón a "Actualizar Producto"
        document.getElementById('add-product-btn').textContent = 'Actualizar Producto';

        // Evitar que se pida la foto (la imagen actual se mantiene)
        // No necesitamos hacer nada con la imagen si no la cambiamos. Si la imagen actual ya existe, solo la mostramos.
        const imagePreview = document.getElementById('image-preview'); // Asegúrate de tener un elemento para mostrar la imagen
        imagePreview.src = product.imageUrl;  // Mostrar la imagen actual
        imagePreview.style.display = 'block'; // Asegurarse de que la imagen esté visible
      }
    }).catch((error) => {
      console.error('Error al cargar los datos del producto:', error);
    });
  }
});


// Eliminar un producto y su imagen de Firebase Storage
async function deleteProduct(productId) {
  try {
    const productSnapshot = await get(ref(getDatabase(), `products/${productId}`));
    if (productSnapshot.exists()) {
      const imageUrl = productSnapshot.val().imageUrl;
      const imageRef = storageRef(storage, imageUrl);
      await deleteObject(imageRef);
      await remove(ref(getDatabase(), `products/${productId}`));
      alert('Producto eliminado');
      loadProducts();
    } else {
      alert('El producto no se encuentra en la base de datos.');
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

// Escuchar clics en botones de eliminación de productos
document.getElementById('products-list').addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('delete-product')) {
    const productId = e.target.dataset.key;
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(productId);
    }
  }
});


// Asegurarnos de que el archivo esté correctamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadCarouselImages();
    
    // Agregar el evento de eliminación de la imagen del carrusel
    document.getElementById('carousel-images').addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('delete-icon')) {
        const imageKey = e.target.dataset.key;
        deleteImage(imageKey);
      }
    });
  });
  


//CARRUSEL//


  // Función para cargar las imágenes del carrusel
  async function loadCarouselImages() {
    const carouselImages = document.getElementById('carousel-images');
    carouselImages.innerHTML = ''; // Limpiar el contenedor antes de cargar
  
    try {
      const carouselSnapshot = await get(carouselRef);
      if (carouselSnapshot.exists()) {
        const images = carouselSnapshot.val();
        Object.keys(images).forEach((key) => {
          const imageUrl = images[key].url;
          carouselImages.innerHTML += `
            <div class="carousel-image-container">
              <img src="${imageUrl}" alt="Imagen del carrusel">
              <span class="delete-icon" data-key="${key}">&times;</span>
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
  

 // Función para eliminar la imagen del carrusel
async function deleteImage(imageKey) {
    try {
      // Obtener la URL de la imagen desde Realtime Database
      const imageSnapshot = await get(ref(getDatabase(), `carrusel/${imageKey}`));
      if (imageSnapshot.exists()) {
        const imageData = imageSnapshot.val();
        
        // Obtener la ruta correcta de la imagen (usando solo el ID o nombre almacenado en la base de datos)
        const imagePath = imageData.url; // 'url' debería contener la ruta correcta en Storage
  
        // Eliminar la imagen de Firebase Storage usando la ruta correcta
        const imageRef = storageRef(storage, imagePath);
        await deleteObject(imageRef);
  
        // Eliminar la entrada del carrusel en Realtime Database
        await remove(ref(getDatabase(), `carrusel/${imageKey}`));
  
        alert('Imagen eliminada del carrusel');
        loadCarouselImages(); // Actualizar las imágenes del carrusel
      } else {
        console.error("La imagen no existe en la base de datos.");
        alert('La imagen no se encuentra en la base de datos.');
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      alert('Hubo un error al eliminar la imagen.');
    }
  }
  
  
  // Subir imagen al carrusel
  document.getElementById('add-carousel-image-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('carousel-image').files[0];
    if (!file) {
      alert("Por favor, selecciona una imagen.");
      return;
    }
  
    try {
      // Subir la imagen al storage y obtener su URL
      const carouselImageRef = storageRef(storage, `carrusel/${file.name}`);
      await uploadBytes(carouselImageRef, file);
      const imageUrl = await getDownloadURL(carouselImageRef);
  
      // Guardar la URL de la imagen en Realtime Database
      const newImageRef = push(carouselRef);
      await set(newImageRef, { url: imageUrl });
  
      alert('Imagen añadida al carrusel');
      document.getElementById('add-carousel-image-form').reset();
      loadCarouselImages();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al añadir la imagen.');
    }
  });
  

// Cargar categorías, productos e imágenes al inicio
loadCategories();
loadProducts();
loadCategoriesForSelect(); // Cargar categorías al cargar la página
listenForNewCategories();

