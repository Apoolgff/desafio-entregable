const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
    this.products = [];
    this.loadProducts();
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
  async getProducts() {
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
      throw new Error('El producto no fue encontrado.');
    }
  }
}

module.exports = ProductManager;


// Ejemplo de uso (COMENTAR LOS FRAGMENTOS DE CODIGO QUE HAGAN FALTA PARA PODER TESTEAR BIEN CADA PARTE):

//EJEMPLOS DE FUNCIONAMIENTO COMENTADOS:

//const productManager = new ProductManager('../productos.json');

// Agrega un producto, se puede poner incompleto para testear el error o con "code" repetido para testear el error al intentar agregar un producto
/*const newProduct = {
    title: 'Cuchillo',
    description: 'Sirve para cortar',
    price: 4.99,
    thumbnail: 'cuchillo.jpg',
    code: 'PROD4',
    stock: 60,
};*/
//productManager.addProduct(newProduct);

/*/Muestra todos los productos
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

const productId = 4;//VARIABLE ID PARA PODER TESTEAR DISTINTAS FUNCIONES

//Muestra un producto por ID
const productById = productManager.getProductById(productId);
console.log(`Producto con ID ${productId}:`, productById);

//Actualiza un producto por ID
const updatedFields = { price: 39.99, stock: 32 };
const updatedProduct = productManager.updateProduct(productId, updatedFields);
console.log('Producto actualizado:', updatedProduct);

//Elimina un producto por ID
const deletedProduct = productManager.deleteProduct(productId);
console.log('Producto eliminado:', deletedProduct);*/
