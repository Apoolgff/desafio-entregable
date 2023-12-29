const { cartsModel } = require('./models/carts.model.js')

class CartDaoMongo {
    constructor() {
        this.model = cartsModel
    }


    //Crea un carrito
    async createCart() {
        try {
          const newCart = await this.model.create({ products: [] });
          return newCart;
        } catch (error) {
          console.error('Error al crear el carrito:', error.message);
          throw error;
        }
      }
    
      //Muestra el carrito segun ID
      async getCart(cartId) {
        try {
          const cart = await this.model.findOne({_id: cartId})
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
          return cart;
        } catch (error) {
          console.error('Error al obtener el carrito:', error.message);
          throw error;
        }
      }
    
      //Agrega un producto a carrito
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

      //Elimina un producto del carrito
      async removeProductFromCart(cartId, productId) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
    
          cart.products = cart.products.filter(product => !product.productId.equals(productId));
    
          await cart.save();
          return cart;
        } catch (error) {
          console.error('Error al eliminar producto del carrito:', error.message);
          throw error;
        }
      }
    
      //Actualiza el carrito
      async updateCart(cartId, products) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
    
          cart.products = products;
    
          await cart.save();
          return cart;
        } catch (error) {
          console.error('Error al actualizar el carrito:', error.message);
          throw error;
        }
      }
    
      //Actualiza la cantidad de cierto producto en el carrito
      async updateProductQuantity(cartId, productId, quantity) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
    
          const existingProduct = cart.products.find(product => product.productId.equals(productId));
    
          if (existingProduct) {
            existingProduct.quantity = quantity;
          } else {
            throw new Error('El producto no existe en el carrito.');
          }
    
          await cart.save();
          return cart;
        } catch (error) {
          console.error('Error al actualizar la cantidad de producto en el carrito:', error.message);
          throw error;
        }
      }
    

      //Elimina todos los productos del carrito
      async removeAllProducts(cartId) {
        try {
          const cart = await this.model.findById(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
    
          cart.products = [];
    
          await cart.save();
          return cart;
        } catch (error) {
          console.error('Error al eliminar todos los productos del carrito:', error.message);
          throw error;
        }
      }

}

module.exports = CartDaoMongo