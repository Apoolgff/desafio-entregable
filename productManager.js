class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
    
    //Agrega producto si todos los campos existen y si el codigo nose repite
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
        //Si todo esta correcto se agrega el producto
      product.id = this.productIdCounter++;
      this.products.push(product);
    }
    
    //Retorna todos los productos
    getProducts() {
      return this.products;
    }
  
    //Retorna un producto por si ID
    getProductById(id) {
      const product = this.products.find((p) => p.id === id);
      if (!product) {
        console.error('Producto no encontrado.');
      }
      return product;
    }
  }
  
  // Ejemplos:
  const productManager = new ProductManager();

  //Producto uno completo
  productManager.addProduct({
    title: 'Silla',
    description: 'Sirve para sentarte',
    price: 19.99,
    thumbnail: 'silla.jpg',
    code: 'PROD1',
    stock: 100,
  });

  //Producto dos completo
  productManager.addProduct({
    title: 'Peine',
    description: 'Sirve para peinarte',
    price: 4.99,
    thumbnail: 'peine.jpg',
    code: 'PROD2',
    stock: 50,
  });

  //Producto tres incompleto
  productManager.addProduct({
    title: 'Cuchillo',
    description: 'Sirve para cortar',
    price: 9.99,
    code: 'PROD3',
  });

  //Producto cuatro con mismo codigo que producto uno
  productManager.addProduct({
    title: 'Telefono',
    description: 'Sirve para llamar gente',
    price: 49.99,
    thumbnail: 'telefono.jpg',
    code: 'PROD1',
    stock: 150,
  });

  //Testeo para obtener todos los productos
  const allProducts = productManager.getProducts();
  console.log(allProducts);

  //Testeo para obtener todos los prodcutor por el ID
  const productById = productManager.getProductById(2);
  console.log(productById);

  //Testeo para obtener un producto que no existe
  const nonExistentProduct = productManager.getProductById(10);
  