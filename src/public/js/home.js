/*const socket = io();

const updateProductList = (data) => {
  const products = data.products;

  console.log('Products updated:', products);

  const productsList = document.querySelector('.products');
  productsList.innerHTML = ''; // Limpiamos la lista antes de actualizar

  if (Array.isArray(products)) {
    products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
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

      // Agregar clases directamente al elemento img dentro de .thumbnails
      const images = listItem.querySelectorAll('.thumbnails img');
      images.forEach(image => {
        image.classList.add('image');
      });

      // Agregar clases directamente a .thumbnails
      const thumbnailList = listItem.querySelector('.thumbnails');
      thumbnailList.classList.add('thumbnails');

      // Agregar clases directamente a .products li
      listItem.classList.add('product-item');

      productsList.appendChild(listItem);
    });
  } else {
    console.error('Invalid products data format:', products);
  }
};

// Escuchar la actualización de la lista de productos desde el servidor
socket.on('updateProducts', updateProductList);*/


