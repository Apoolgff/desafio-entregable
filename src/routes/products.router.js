const { Router } = require('express');
const ProductManager = require('../managers/productManager');

const productsRouter = Router();
const productManager = new ProductManager('./src/mock/productos.json');

const { Server } = require('socket.io');

let io;

function configureSocketIO(server) {
    io = new Server(server);
  
    io.on('connection', (socket) => {
      console.log('Un cliente se ha conectado');
  
      // Envia datos iniciales al cliente cuando se conecta
      const initialProducts = productManager.getProducts();
      socket.emit('updateProducts', initialProducts);
    });
  }

  function checkSocketIO(req, res, next) {
    if (!io) {
      return res.status(500).send('Socket.IO no está configurado correctamente');
    }
    next();
  }

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

productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    io.emit('updateProducts', productManager.getProducts());//provisorio

    res.json({ product: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

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

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const deletedProduct = await productManager.deleteProduct(productId);
    
    io.emit('updateProducts', productManager.getProducts());//provisorio
    
    res.json({ product: deletedProduct });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

module.exports = { productsRouter, configureSocketIO, checkSocketIO };
