const { cartsModel } = require('./models/carts.model.js')

class CartDaoMongo {
    constructor() {
        this.model = cartsModel
    }


    //Crea un carrito
    async createCart() {
          return await this.model.create({ products: [] });

      }
    
      //Muestra el carrito segun ID
      async getCart(cartId) {
          return await this.model.findOne({_id: cartId})
      }
    
      //Agrega un producto a carrito
      async addProductToCart(cartId, productId, quantity) {
          const cart = await this.model.findById(cartId);
          const existingProductIndex = cart.products.findIndex(product => product.productId.equals(productId));
      
          if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, actualiza la cantidad
            cart.products[existingProductIndex].quantity += quantity;
          } else {
            // Si el producto no existe en el carrito, agrégalo con la cantidad proporcionada
            cart.products.push({ productId, quantity });
          }
      
          await this.model.updateOne(
            { _id: cartId },
            { $set: { products: cart.products } }
          );
          // Puedes retornar el carrito actualizado si es necesario
          return await this.model.findById(cartId);
      }
      

      //Elimina un producto del carrito
      async removeProductFromCart(cartId, productId) {
          return await this.model.findByIdAndUpdate(
            cartId,
            { $pull: { products: { productId } } },
            { new: true }
          );
      }
      
    
      //Actualiza el carrito
      async updateCart(cartId, products) {
          await this.model.updateOne({ _id: cartId }, { $set: { products: products } });
          // Puedes retornar el carrito actualizado si es necesario
          return await this.model.findById(cartId);
      }
      
    
      //Actualiza la cantidad de cierto producto en el carrito
      async updateProductQuantity(cartId, productId, quantity) {
          await this.model.updateOne(
            { _id: cartId, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } }
          );
          // Puedes retornar el carrito actualizado si es necesario
          return await this.model.findById(cartId);
      }
      
    

      //Elimina todos los productos del carrito
      async removeAllProducts(cartId) {
          await this.model.updateOne(
            { _id: cartId },
            { $set: { products: [] } }
          );
          // Puedes retornar el carrito actualizado si es necesario
          return await this.model.findById(cartId);
      }
      

}

module.exports = CartDaoMongo