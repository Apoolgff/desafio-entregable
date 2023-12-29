const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
    this.products = [];
    this.loadProducts();
  }

  static getInstance(path) {
    if (!ProductManager.instance) {
      ProductManager.instance = new ProductManager(path);
    }
    return ProductManager.instance;
  }



  //Funcion para Cargar los datos del JSON
  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.updateNextId();
    } catch (error) {
      console.error('El archivo de productos no existe');
    }
  }

  //Funcion para generar el ID
  updateNextId() {
    if (this.products.length > 0) {
      const maxId = Math.max(...this.products.map(product => product.id));
      this.nextId = maxId + 1;
    }
  }

  //Funcion para guardar los productos en el JSON
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al guardar los productos');
    }
  }

  //Funcion para agregar/crear un producto
  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.error('El campo "code" ya está en uso.');
      return;
    }

    const newProduct = {
      id: this.nextId++,
      status: true,
      ...product,
    };

    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  //Funcion para mostrar/obtener todos los productos con limite
  async getProductsLimited(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }

  //Funcion para mostrar/obtener todos los productos
   getProducts() {
    return this.products;
  }

  //Funcion para mostrar/obtener un producto segun su ID
  async getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error('El producto no fue encontrado.');
    }
    return product;
  }

  //funcion para modificar un producto segun su ID
  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields, id };
      await this.saveProducts();
      return this.products[index];
    }
  }

  //Funcion para eliminar un producto segun su ID
  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      await this.saveProducts();
      return deletedProduct;
    } else {
      throw new Error('El producto no fue encontrado. ID: ' + id);
    }
  }
}

module.exports = ProductManager;

