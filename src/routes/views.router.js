
const { Router } = require('express');
const ProductDaoMongo = require('../daos/mongo/productManagerMongo')
const MessageDaoMongo = require('../daos/mongo/messageManagerMongo')
const CartDaoMongo = require('../daos/mongo/cartManagerMongo')
const router= Router();

//Instancia compartida del ProductManager (ya no lo usamos)
//const productManager = ProductManager.getInstance('./src/mock/productos.json');

const productService = new ProductDaoMongo()
const messageService = new MessageDaoMongo()
const cartService = new CartDaoMongo()

router.get('/login', async (req, res) => {
    res.render('login', { title: 'Login', style: 'login.css', body: 'login' });
});

router.get('/register', async (req, res) => {
    res.render('register', { title: 'Register', style: 'login.css', body: 'register' });
});

//Ruta para home
router.get('/', async (req, res) => {
    const products = await productService.getProducts();
    res.render('home', { title: 'Home', style: 'products.css', body: 'home', products });
});

// Ruta para realTimeProducts
router.get('/realtimeproducts', async (req, res) => {
    const products =  await productService.getProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', style: 'realTimeProducts.css', body: 'realTimeProducts', products });
});

//Ruta para el chat
router.get('/chat', async (req, res) => {
    const messages =  await messageService.getMessages();
    res.render('chat', { title: 'Chat', style: 'chat.css', body: 'chat', messages });
});

//Ruta para productos
router.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const user = req.session.user;
        //MODIFICAR LIMIT, PAGE, SORT, QUERY SEGUN LO QUE SE QUIERA PARA PODER PROBAR QUE TODO FUNCIONA tanto desde aca como desde el url
        const result = await productService.getProductsLimited({ limit, page, sort, query });//query: 'Computacion' o 'Electrónicos'
        res.render('products', { title: 'Products', style: 'products.css', body: 'products', products: result.payload, pagination: result, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

//Ruta para el carrito
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCart({ _id: cid });
        res.render('carts', { title: 'Cart', style: 'carts.css', body: 'carts', cart });
    } catch (error) {
        console.error(error.message);
        res.status(404).send('Cart Not Found');
    }
});





module.exports = router;
