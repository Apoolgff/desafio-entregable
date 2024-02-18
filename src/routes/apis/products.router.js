const { Router } = require('express');

const productsRouter = Router();
const { uploader } = require('../../utils/multer')//nuevo
const ProductsController = require('../../controllers/products.controller')

const productsController = new ProductsController()

//Mostrar productos con diferentes filtros y paginacion
productsRouter.get('/', productsController.getProductsLimited);

//Mostrar producto segun ID
productsRouter.get('/:pid', productsController.getProductBy);

//Agregar producto
productsRouter.post('/', uploader.array('thumbnails', 5), productsController.createProduct);//cambiado

//Modificar un producto segun su ID
productsRouter.put('/:pid', productsController.updateProduct);

//Eliminar un producto segun su ID
productsRouter.delete('/:pid', productsController.deleteProduct);


module.exports = productsRouter;
