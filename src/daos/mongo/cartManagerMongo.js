const { cartsModel } = require('./models/carts.model.js')

class CartDaoMongo {
  constructor() {
    this.model = cartsModel
  }


  //Crea un carrito
  async create() {
    return await this.model.create({ products: [] })

  }

  //Muestra el carrito segun ID
  async getById(cartId) {
    return await this.model.findOne({ _id: cartId })
  }

  //Agrega un producto a carrito
  async addProductToCart(cartId, productId, quantity) {
    return await this.model.findOneAndUpdate(
      { _id: cartId },
      { $addToSet: { products: { productId, quantity } } },
      { new: true }
    )
  }


  //Elimina un producto del carrito
  async removeProductFromCart(cartId, productId) {
    return await this.model.findByIdAndUpdate(
      cartId,
      { $pull: { products: { productId } } },
      { new: true }
    );
  }

  //Encuentra un producto en el carrito
  async isProductInCart(cartId, productId) {
    return await this.model.findOne({
      _id: cartId,
      products: { $elemMatch: { productId: productId } }
    });
  }



  //Actualiza el carrito
  async update(cartId, products) {
    return await this.model.updateOne(
      { _id: cartId },
      { $set: { products: products } }
    )
  }


  //Actualiza la cantidad de cierto producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    return await this.model.updateOne(
      { _id: cartId, 'products.productId': productId },
      { $inc: { 'products.$.quantity': quantity } }
    )
  }



  //Elimina todos los productos del carrito
  async removeAllProducts(cartId) {
    return await this.model.updateOne(
      { _id: cartId },
      { $set: { products: [] } }
    )
  }


}

module.exports = CartDaoMongo