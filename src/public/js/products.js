//NO ESTOY USANDOLO AHORA, PERO QUEDA POR LAS DUDAS QUE HAGA FALTA VER LOS OBJETOS EN TIEMPO REAL CON SOCKET O QUE NECESITE AGREGAR SCRIPT A PRODUCTS
const socket = io();

socket.on('updateProducts', (products) => {

  const productsList = document.querySelector('.products');
  productsList.innerHTML = "";

  products.forEach((product) => {

    const li = document.createElement('li');
    li.classList.add('product-card');
    const button = document.createElement('button');
    button.classList.add('add-to-cart-btn');
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
    button.textContent = 'Agregar al carrito';
    li.appendChild(button);
    productsList.appendChild(li);
  });

});