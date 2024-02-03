const { Router } = require('express');

const productsRouter = Router();

const ProductsController = require('../../controllers/products.controller')

const productsController = new ProductsController()

//Mostrar productos con diferentes filtros y paginacion
productsRouter.get('/', productsController.getProductsLimited);

//Mostrar producto segun ID
productsRouter.get('/:pid', productsController.getProductById);

//Agregar producto
productsRouter.post('/', productsController.addProduct);

//Modificar un producto segun su ID
productsRouter.put('/:pid', productsController.updateProduct);

//Eliminar un producto segun su ID
productsRouter.delete('/:pid', productsController.deleteProduct);


module.exports = productsRouter;
