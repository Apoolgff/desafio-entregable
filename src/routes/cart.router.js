const { Router } = require('express');
//const CartManager = require('../managers/cartManager');
const CartDaoMongo = require('../daos/mongo/cartManagerMongo')

const cartsRouter = Router();
//const cartManager = new CartManager('./src/mock/cart.json');

const cartService = new CartDaoMongo()

//Crear un carrito
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.json({ cart: newCart });//res.send({status: 'success', payload: newCart})
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//Mostrar un carrito segun ID
cartsRouter.get('/:cid', async (req, res) => {
  try {
    //const cartId = req.params.cid;(anterior)
    const { cid } = req.params
    const cart = await cartService.getCart({ _id: cid });
    res.json({ cart });//res.send({status: 'success', payload: cart})
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Cart Not Found');
  }
});

//Agregar un producto al carrito segun ID
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
    
     res.json({ cart: updatedCart });//res.send({status: 'success', payload: updatedCart})
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//Eliminar producto del carrito segun ID
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartService.removeProductFromCart(cartId, productId);

    res.json({ cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//Actualizar el carrito segun ID
cartsRouter.put('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products || [];
    const updatedCart = await cartService.updateCart(cartId, products);
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//Actualizar la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//Eliminar todos los productos del carrito
cartsRouter.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartService.removeAllProducts(cartId);
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//ROUTER ANTERIORES (ya no lo usamos)

/*cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json({ cart: newCart });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCart(cartId);
    res.json({ cart });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Cart Not Found');
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});*/

module.exports = cartsRouter;
