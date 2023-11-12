const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1; // Variable autoincrementable (ID)
    this.products = [];
    this.loadProducts();
  }

  //Carga los productos que haya en el archivo.json
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.updateNextId();
    } catch (error) {
      console.error('El archivo de productos no existe');
    }
  }

  //Actualiza el ID para que el siguiente producto agregado tenga un ID unico y sea mayor a los ID existentes
  updateNextId() {
    if (this.products.length > 0) {
      const maxId = Math.max(...this.products.map(product => product.id));
      this.nextId = maxId + 1;
    }
  }

  //Guarda los productos en el archivo.json
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  //Agrega producto si todos los campos existen y si el codigo no se repite
  addProduct(product) {
        //Si un campo no se agrega muestra el error
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.error('Todos los campos son obligatorios.');
        return;
      }
        //Si el campo "code" esta repetido muestra el error
    if (this.products.some((existingProduct) => existingProduct.code === product.code)) {
        console.error('El campo "code" ya está en uso.');
        return;
      }
    const newProduct = {
      ...product,
      id: this.nextId++
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  //Retorna todos los productos
  getProducts() {
    return this.products;
  }

  //Retorna un producto por su ID y muestra el error si el producto no se encuentra o no existe
  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error('El producto no fue encontrado.');
    }
    return product;
  }

  //Modifica un producto segun el ID
  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields, id };
      this.saveProducts();
      return this.products[index];
    }
  }

  //Elimina un producto segun el ID, si el producto no existe muestra el error
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProducts();
      return deletedProduct;
    } else {
      throw new Error('El producto no fue encontrado.');
    }
  }
}

// Ejemplo de uso (COMENTAR LOS FRAGMENTOS DE CODIGO QUE HAGAN FALTA PARA PODER TESTEAR BIEN CADA PARTE):
const productManager = new ProductManager('productos.json');

// Agrega un producto, se puede poner incompleto para testear el error o con "code" repetido para testear el error al intentar agregar un producto
const newProduct = {
    title: 'Cuchillo',
    description: 'Sirve para cortar',
    price: 4.99,
    thumbnail: 'cuchillo.jpg',
    code: 'PROD4',
    stock: 60,
};
productManager.addProduct(newProduct);

//Muestra todos los productos
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
console.log('Producto eliminado:', deletedProduct);
