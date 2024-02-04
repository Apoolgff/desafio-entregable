
const { Router } = require('express');

const router = Router();

const ViewsController = require('../controllers/views.controller')
const viewsController = new ViewsController()


router.get('/login', viewsController.login);

//Ruta para el registro
router.get('/register', viewsController.register);

//Ruta para home (cambie la ruta de '/' a '/home' para que al entrar al localhost la primer pagina sea el login)
router.get('/home', viewsController.home);

// Ruta para realTimeProducts
router.get('/realtimeproducts', viewsController.realTimeProducts);

//Ruta para el chat
router.get('/chat', viewsController.chat);

// Ruta para productos
router.get('/products', viewsController.products);


//Ruta para el carrito
router.get('/carts/:cid', viewsController.cart);


module.exports = router;
