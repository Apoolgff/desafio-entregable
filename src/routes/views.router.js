
const { Router } = require('express');
const router = Router();

const ViewsController = require('../controllers/views.controller')
const viewsController = new ViewsController()

const { handlePolicies } = require('../middlewares/handlePolicies.middleware');


router.get('/login', handlePolicies(['PUBLIC']), viewsController.login);

//Ruta para el registro
router.get('/register', handlePolicies(['PUBLIC']), viewsController.register);

//Ruta para home (cambie la ruta de '/' a '/home' para que al entrar al localhost la primer pagina sea el login)
router.get('/home', handlePolicies(['PUBLIC']), viewsController.home);

//Ruta para realTimeProducts
router.get('/realtimeproducts', handlePolicies(['ADMIN', 'PREMIUM']), viewsController.realTimeProducts);

//Ruta para el chat
router.get('/chat', handlePolicies(['USER', 'PREMIUM']), viewsController.chat);

//Ruta para productos
router.get('/products', handlePolicies(['USER', 'PREMIUM']), viewsController.products);

//Ruta Administrador de productos (crud)
router.get('/manager', handlePolicies(['ADMIN', 'PREMIUM']), viewsController.manager);

//Ruta Administrador de productos (crud)
router.get('/role', handlePolicies(['USER','PREMIUM']), viewsController.role);

//Ruta para el carrito
router.get('/carts/:cid', handlePolicies(['USER', 'PREMIUM']), viewsController.cart);

//Ruta para el carrito
router.get('/recover', handlePolicies(['PUBLIC']), viewsController.recover);

//Ruta para el carrito
router.get('/passrecovery/:token', handlePolicies(['PUBLIC']), viewsController.passRecovery);


module.exports = router;
