const { Router } = require('express');
const ProductManager = require('../managers/productManager');
const ProductDaoMongo = require('../daos/mongo/productManagerMongo.js')

const productsRouter = Router();
const productManager = new ProductManager('./src/mock/productos.json');

const productService = new ProductDaoMongo()

productsRouter.get('/', async (req, res) =>{
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await productService.getProductsLimited(limit);
    res.json({ products });//res.send({ status: 'success', payload: products})
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productService.getProductById(productId);
    res.json({ product });//res.send({status: 'success', payload: product})
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = await productService.addProduct(req.body);

    res.json({ product: newProduct });//res.send({status: 'success', payload: newProduct})
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = await productService.updateProduct(productId, req.body);
    res.json({ product: updatedProduct });//res.send({status: 'success', payload: updatedProduct})
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});

/*productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await productManager.getProductsLimited(limit);
    res.json({ products });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});*/

/*productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});*/

/*productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    res.json({ product: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(400).send('Bad Request');
  }
});*/

/*productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    res.json({ product: updatedProduct });
  } catch (error) {
    console.error(error.message);
    res.status(404).send('Product Not Found');
  }
});*/

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
