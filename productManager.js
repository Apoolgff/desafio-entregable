class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(product) {
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.error('Todos los campos son obligatorios.');
        return;
      }
  
      if (this.products.some((existingProduct) => existingProduct.code === product.code)) {
        console.error('El campo "code" ya está en uso.');
        return;
      }
  
      product.id = this.productIdCounter++;
      this.products.push(product);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find((p) => p.id === id);
      if (!product) {
        console.error('Producto no encontrado.');
      }
      return product;
    }
  }
  
  // Ejemplo de uso:
  const productManager = new ProductManager();
  
  productManager.addProduct({
    title: 'Silla',
    description: 'Sirve para sentarte',
    price: 19.99,
    thumbnail: 'silla.jpg',
    code: 'PROD1',
    stock: 100,
  });
  
  productManager.addProduct({
    title: 'Peine',
    description: 'Sirve para peinarte',
    price: 4.99,
    thumbnail: 'peine.jpg',
    code: 'PROD2',
    stock: 50,
  });

  productManager.addProduct({
    title: 'Cuchillo',
    description: 'Sirve para cortar',
    price: 9.99,
    code: 'PROD2',
  });

  productManager.addProduct({
    title: 'Telefono',
    description: 'Sirve para llamar gente',
    price: 49.99,
    thumbnail: 'telefono.jpg',
    code: 'PROD1',
    stock: 150,
  });
  
  const allProducts = productManager.getProducts();
  console.log(allProducts);
  
  const productById = productManager.getProductById(2);
  console.log(productById);
  
  const nonExistentProduct = productManager.getProductById(10);
  