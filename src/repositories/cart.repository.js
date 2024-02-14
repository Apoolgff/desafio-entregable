
class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    createCart = async () => await this.dao.create()

    getCart = async (cartId) => await this.dao.getById(cartId)

    addProductToCart = async (cartId, productId, quantity) => await this.dao.addProductToCart(cartId, productId, quantity)

    removeProductFromCart = async (cartId, productId) => await this.dao.removeProductFromCart(cartId, productId)

    isProductInCart = async (cartId, productId) => await this.dao.isProductInCart(cartId, productId)

    updateCart = async (cartId, products) => await this.dao.update(cartId, products)

    updateProductQuantity = async (cartId, productId, quantity) => await this.dao.updateProductQuantity(cartId, productId, quantity)

    removeAllProducts = async (cartId) => await this.dao.removeAllProducts(cartId)

}

module.exports = { CartRepository }