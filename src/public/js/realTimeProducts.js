/*const socket = io();

function createProduct() {
  // Recopila datos del formulario
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value;
  const thumbnails = document.getElementById('thumbnails').files; // Cambiado para obtener los archivos de imágenes

  // Crea un objeto FormData para enviar los datos y los archivos
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('code', code);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('category', category);
  for (let i = 0; i < thumbnails.length; i++) {
    formData.append('thumbnails', thumbnails[i]); // Agrega cada archivo de imagen al FormData
  }

  // Emite el evento 'createProduct' con los datos del nuevo producto
  socket.emit('createProduct', formData);

  // Limpia los campos del formulario después de agregar el producto
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('code').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = '';
  document.getElementById('thumbnails').value = '';
}

socket.on('updateProducts', (products) => {
  const productsList = document.querySelector('.products');
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement('li');
    li.classList.add('product-card');
    li.id = `product_${product._id}`;
    li.innerHTML = `
      <strong>ID:</strong> ${product._id}<br>
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
  const productId = document.getElementById('productId').value;
  socket.emit('deleteProduct', productId);
  document.getElementById('productId').value = '';
}

socket.on('deleteProduct', (productId) => {
  try {
    const productsList = document.querySelector('.products');
    const productElement = document.getElementById(`product_${productId}`);
    if (productElement) {
      productsList.removeChild(productElement);
    }
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${productId}:`, error.message);
  }
});*/
const socket = io();

function createProduct() {
  //Recopila datos del formulario
  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
    thumbnails: document.getElementById('thumbnails').value.split(','),
  };

  //Emite el evento 'createProduct' con los datos del nuevo producto
  socket.emit('createProduct', newProduct);

  //Limpia los campos del formulario despues de agregar el producto
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('code').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = '';
  document.getElementById('thumbnails').value = '';
}


socket.on('updateProducts', (products) => {

  const productsList = document.querySelector('.products');
  productsList.innerHTML = ""; 

  products.forEach((product) => {
    
    const li = document.createElement('li');
    li.classList.add('product-card');
    li.id = `product_${product._id}`;
    li.innerHTML = `
      <strong>ID:</strong> ${product._id}<br>
      <strong>Title:</strong> ${product.title}<br>
      <strong>Description:</strong> ${product.description}<br>
      <strong>Code:</strong> ${product.code}<br>
      <strong>Price:</strong> $${product.price}<br>
      <strong>Status:</strong> ${product.status}<br>
      <strong>Stock:</strong> ${product.stock}<br>
      <strong>Category:</strong> ${product.category}<br>
      /*<strong>Thumbnails:</strong>
      <ul class="thumbnails">
        ${product.thumbnails.map(thumbnail => `<li><img class="image" src="${thumbnail}" alt="Thumbnail"></li>`).join('')}
      </ul>
    `;

    productsList.appendChild(li);
  });

});

function deleteProduct() {

    const productId = document.getElementById('productId').value;
  
   
    socket.emit('deleteProduct', productId);


    document.getElementById('productId').value = '';
  }
  

  socket.on('deleteProduct', (productId) => {
    try {

      const productsList = document.querySelector('.products');
      const productElement = document.getElementById(`product_${productId}`);
  
      if (productElement) {
        productsList.removeChild(productElement);
      }
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${productId}:`, error.message);
    }
  });