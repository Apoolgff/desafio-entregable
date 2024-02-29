const { generateUniqueCode, calculateTotalAmount } = require('../helpers/cartHelper')
const { cartService, ticketService, productService, userService } = require('../repositories/services')
const { EErrors } = require('../services/errors/enums');
const { generatePurchaseCartErrorInfo } = require('../services/errors/errorGenerator');
const CustomError = require('../services/errors/CustomError')

class CartController {
    constructor() {
        this.cartService = cartService
        this.productService = productService
        this.ticketService = ticketService
        this.userService = userService
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.json({ cart: newCart });//res.send({status: 'success', payload: newCart})
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }

    getCart = async (req, res) => {
        try {
            //const cartId = req.params.cid;(anterior)
            const { cid } = req.params
            const cart = await this.cartService.getCart({ _id: cid });
            res.json({ cart });//res.send({status: 'success', payload: cart})
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Cart Not Found');
        }
    }

    addProductToCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;

            const cart = await this.cartService.getCart(cartId);
            if (!cart) {
                throw new Error('El carrito no fue encontrado.');
            }

            const product = await this.productService.getProductById(productId)
            if (!product) {
                throw new Error('El producto no fue encontrado.');
            }


            const productInCart = await this.cartService.isProductInCart(cartId, productId)

            if (productInCart) {
                await this.cartService.updateProductQuantity(cartId, productId, quantity)
            }
            else {
                await this.cartService.addProductToCart(cartId, productId, quantity);
            }

            const updatedCart = await this.cartService.getCart(cartId);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }


    removeProductFromCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await this.cartService.removeProductFromCart(cartId, productId);

            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const products = req.body.products || [];
            const updatedCart = await this.cartService.updateCart(cartId, products);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
            const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, quantity);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    removeAllProducts = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const updatedCart = await this.cartService.removeAllProducts(cartId);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }


    purchaseCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCart(cartId);
            const user = await this.userService.getUser({ cart: cartId });

            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const products = cart.products;
            const failedProducts = [];
            let totalAmount = 0;

            for (const productData of products) {
                const product = await this.productService.getProductBy(productData.productId);
                if (!product) {
                    return res.status(404).json({ message: `Producto ${productData.productId} no encontrado` });
                }
                /*if (product.stock === 0) {
                    return res.status(400).json({ message: `No hay stock disponible para el producto ${product.name}` });
                }*/
            
                if (product.stock === 0) {
                    CustomError.createError({
                        name: 'Product Stock error',
                        cause: generatePurchaseCartErrorInfo(product.title, product.stock, productData.quantity),
                        message: 'Error trying to purchase a product',
                        code: EErrors.CART_OPERATION_ERROR
                      })
                }

                const purchaseQuantity = Math.min(product.stock, productData.quantity);
                product.stock -= purchaseQuantity;
                totalAmount += product.price * purchaseQuantity;
                if (purchaseQuantity < productData.quantity) {
                    failedProducts.push({ ...productData, quantity: productData.quantity - purchaseQuantity });
                    productData.quantity -= purchaseQuantity;
                }
                await this.productService.updateProduct(product._id, product);
            }

            const ticketData = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount.toFixed(2),
                purchaser: user.email,
            };
            const ticket = await this.ticketService.createTicket(ticketData);

            if (failedProducts.length > 0) {

                await this.cartService.updateCart(cartId, products);
                return res.status(200).json({ message: 'Algunos productos no pudieron ser comprados', failedProducts });
            } else {

                await this.cartService.removeAllProducts(cartId);
                return res.status(200).json({ message: 'Compra finalizada con éxito', ticket });
            }
        } catch (error) {
            //console.error(error);
            //return res.status(500).json({ message: 'Error en el servidor' });
            next(error)
        }
    }



}

module.exports = CartController