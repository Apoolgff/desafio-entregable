const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
    this.carts = [];
    this.loadCarts();
  }

  //Funcion para cargar los datos del JSON
  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.carts = JSON.parse(data);
      this.updateNextId();
    } catch (error) {
      console.error('El archivo de carritos no existe');
    }
  }

  //Funcion para generar el ID
  updateNextId() {
    if (this.carts.length > 0) {
      const maxId = Math.max(...this.carts.map(cart => cart.id));
      this.nextId = maxId + 1;
    }
  }

  //Funcion para guardar los datos en el JSON
  async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al guardar los carritos');
    }
  }

  //Funcion para crear un carrito
  async createCart() {
    const newCart = {
      id: this.nextId++,
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  //Funcion para cargar/mostrar un carrito segun su ID
  async getCart(cartId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (!cart) {
      throw new Error('El carrito no fue encontrado.');
    }
    return cart;
  }

  //Funcion para agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (!cart) {
      throw new Error('El carrito no fue encontrado.');
    }

    const existingProduct = cart.products.find(product => product.id === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    await this.saveCarts();
    return cart;
  }
}

module.exports = CartManager;