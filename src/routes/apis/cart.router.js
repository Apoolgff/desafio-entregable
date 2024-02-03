const { Router } = require('express');

const cartsRouter = Router();

const CartController = require('../../controllers/carts.controller')

const cartController = new CartController()

//Crear un carrito
cartsRouter.post('/', cartController.createCart);

//Mostrar un carrito segun ID
cartsRouter.get('/:cid', cartController.getCart);

//Agregar un producto al carrito segun ID
cartsRouter.post('/:cid/product/:pid', cartController.addProductToCart);

//Eliminar producto del carrito segun ID
cartsRouter.delete('/:cid/products/:pid', cartController.removeProductFromCart);

//Actualizar el carrito segun ID
cartsRouter.put('/:cid', cartController.updateCart);

//Actualizar la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);

//Eliminar todos los productos del carrito
cartsRouter.delete('/:cid', cartController.removeAllProducts);


module.exports = cartsRouter;
