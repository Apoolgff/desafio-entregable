const { cartsModel } = require('./models/carts.model.js')

class CartDaoMongo {
    constructor() {
        this.model = cartsModel
    }


    async createCart() {
        try {
          const newCart = await this.model.create({ products: [] });
          return newCart;
        } catch (error) {
          console.error('Error al crear el carrito:', error.message);
          throw error;
        }
      }
    
      async getCart(cartId) {
        try {
          const cart = await this.model.findById(cartId).populate('products.productId', 'title price'); // Asegúrate de ajustar el nombre del campo ObjectId en tu modelo de productos
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
          return cart;
        } catch (error) {
          console.error('Error al obtener el carrito:', error.message);
          throw error;
        }
      }
    
      async addProductToCart(cartId, productId, quantity) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
    
          const existingProduct = cart.products.find(product => product.productId.equals(productId));
    
          if (existingProduct) {
            existingProduct.quantity += quantity;
          } else {
            cart.products.push({ productId, quantity });
          }
    
          await cart.save();
          return cart;
        } catch (error) {
          console.error('Error al agregar producto al carrito:', error.message);
          throw error;
        }
      }

}

module.exports = CartDaoMongo