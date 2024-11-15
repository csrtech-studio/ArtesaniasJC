// Función para cargar los productos en el carrito
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Limpiar contenido previo
    cartItemsContainer.innerHTML = '';
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Seleccione primero algún producto.</p>';
      totalAmount.textContent = '0.00';
      return;
    }
  
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <button class="remove-item" data-index="${index}">Eliminar</button>
          <img src="${item.imageUrl}" alt="${item.name}" style="width: 100px; height: 100px;">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Precio: $${item.price}</p>
          <p>
            Cantidad: 
            <input type="number" value="${item.quantity}" min="1" class="quantity" data-index="${index}">
          </p>
        </div>
      `;
    });
  
    // Mostrar el precio total
    totalAmount.textContent = total.toFixed(2);
  
    // Agregar eventos a las cantidades y botones de eliminar
    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach(input => {
      input.addEventListener('input', updateQuantity);
    });
  
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', removeItem);
    });
  }
  
  // Función para actualizar la cantidad del producto
  function updateQuantity(event) {
    const index = event.target.getAttribute('data-index');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = parseInt(event.target.value);
  
    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  
  // Función para eliminar un producto del carrito
  function removeItem(event) {
    const index = event.target.getAttribute('data-index');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Eliminar el producto del carrito
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
  
    loadCart(); // Recargar el carrito después de la eliminación
  }
  
  // Función para finalizar la compra (enviar mensaje de WhatsApp)
document.getElementById('checkout').addEventListener('click', function() {
    // Verificar si el carrito está vacío
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Por favor, seleccione al menos un producto antes de finalizar la compra.');
      return;
    }
  
    // Validar que los campos del formulario estén llenos
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
  
    if (!name || !address || !phone || !paymentMethod) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }
  
    // Crear mensaje de WhatsApp con la información y enlaces a las imágenes
    const cartItems = cart.map(item => `${item.name} - Cantidad: ${item.quantity} - $${item.price * item.quantity}\nImagen: ${item.imageUrl}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  
    const message = `Estimado Artesanías JC, mi nombre es: ${name}, y me interesa adquirir el/los siguientes productos:\n\n${cartItems}\n\nEl costo total es: $${total}\n\nMi teléfono es: ${phone}\nMi dirección es: ${address}\nPagaré con: ${paymentMethod}\nEspero su pronta respuesta.`;
  
    // Redirigir a WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/8111775113?text=${encodeURIComponent(message)}`;  // Cambia el número por el de tu WhatsApp
    window.open(whatsappUrl, '_blank'); // Abrir WhatsApp en una nueva ventana
  
    // Limpiar el carrito después de la compra
    localStorage.removeItem('cart');
    loadCart(); // Recargar el carrito (debería estar vacío)
  });
  
  // Inicializar la carga del carrito
  loadCart();
  