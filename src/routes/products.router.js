const { Router } = require('express');
const ProductManager = require('../managers/productManager');

const productsRouter = Router();
const productManager = new ProductManager('./src/mock/productos.json');


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
    
    res.json({ product: deletedProduct });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

module.exports = productsRouter;
