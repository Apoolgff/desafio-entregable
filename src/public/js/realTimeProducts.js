const socket = io();

function createProduct() {
  // Recopilar datos del formulario
  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: document.getElementById('thumbnails').value.split(','),
  };

  // Emitir el evento 'createProduct' con los datos del nuevo producto
  socket.emit('createProduct', newProduct);
}

// Escuchar eventos de actualización de productos
socket.on('updateProducts', (products) => {
  // Lógica para actualizar la lista de productos en la vista
  const productsList = document.querySelector('.products');
  productsList.innerHTML = ""; // Limpiar la lista antes de actualizar

  products.forEach((product) => {
    // Crear elementos HTML para cada producto y agregarlos a la lista
    const li = document.createElement('li');
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
    // Obtener el ID del producto a eliminar
    const productId = parseInt(document.getElementById('productId').value);
  
    // Emitir el evento 'deleteProduct' con el ID del producto a eliminar
    socket.emit('deleteProduct', productId);
  }
  
  // Escuchar eventos de eliminación de productos
  socket.on('deleteProduct', (productId) => {
    try {
      // Lógica para eliminar el producto de la vista
      const productsList = document.querySelector('.products');
      const productElement = document.getElementById(`product_${productId}`);
  
      if (productElement) {
        productsList.removeChild(productElement);
      }
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${productId}:`, error.message);
    }
  });