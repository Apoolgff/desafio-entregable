const socket = io();

function createProduct() {
  // Recopila datos del formulario
  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: document.getElementById('thumbnails').value.split(','),
  };

  // Emite el evento 'createProduct' con los datos del nuevo producto
  socket.emit('createProduct', newProduct);

  // Limpia los campos del formulario despues de agregar el producto
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('code').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = '';
  document.getElementById('thumbnails').value = '';
}

// Escucha eventos de actualización de productos
socket.on('updateProducts', (products) => {
  // Logica que actualiza la lista de productos en la vista
  const productsList = document.querySelector('.products');
  productsList.innerHTML = ""; // Limpiar la lista antes de actualizar

  products.forEach((product) => {
    // Crea elementos HTML para cada producto y los agrega a la lista
    const li = document.createElement('li');
    li.classList.add('product-card');
    li.innerHTML = `
      <strong>ID:</strong> ${product.id}<br>
      <strong>Title:</strong> ${product.title}<br>
      <strong>Description:</strong> ${product.description}<br>
      <strong>Code:</strong> ${product.code}<br>
      <strong>Price:</strong> $${product.price}<br>
      <strong>Status:</strong> ${product.status}<br>
      <strong>Stock:</strong> ${product.stock}<br>
      <strong>Category:</strong> ${product.category}<br>
      <strong>Thumbnails:</strong>
      <ul class="thumbnails">
        ${product.thumbnails.map(thumbnail => `<li><img class="image" src="${thumbnail}" alt="Thumbnail"></li>`).join('')}
      </ul>
    `;

    productsList.appendChild(li);
  });
});

function deleteProduct() {
    // Obtiene el ID del producto a eliminar
    const productId = parseInt(document.getElementById('productId').value);
  
    // Emite el evento 'deleteProduct' con el ID del producto a eliminar
    socket.emit('deleteProduct', productId);

    // Limpia el campo del formulario
    document.getElementById('productId').value = '';
  }
  
  // Escucha el evento de eliminación de productos
  socket.on('deleteProduct', (productId) => {
    try {
      // Logica para eliminar el producto de la vista
      const productsList = document.querySelector('.products');
      const productElement = document.getElementById(`product_${productId}`);
  
      if (productElement) {
        productsList.removeChild(productElement);
      }
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${productId}:`, error.message);
    }
  });