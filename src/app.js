
const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager'); 
const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager('../productos.json');
const cartManager = new CartManager('../cart.json');

// Rutas para manejo de productos y carrito
const productsRouter = express.Router();
const cartsRouter = express.Router();

//PRODUCTOS

//GET para mostrar todos los productos o por un limite
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await productManager.getProductsLimited(limit);
    res.json({ products });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//GET para mostrar un producto por el ID
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

//POST para crear y agregar un producto nuevo
productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.json({ product: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

//PUT para modificar un producto segun su ID
productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    res.json({ product: updatedProduct });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

//DELETE para eliminar un producto segun su ID
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const deletedProduct = await productManager.deleteProduct(productId);
    res.json({ product: deletedProduct });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

app.use('/api/products', productsRouter);

//CARRITO

//POST para crear un carrito nuevo
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json({ cart: newCart });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//GET para obtener un carrito segun su ID
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

//POST para agregar productos al carrito
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
});

app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

