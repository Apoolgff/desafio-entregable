
const { Router } = require('express');
const ProductDaoMongo = require('../daos/mongo/productManagerMongo')
const MessageDaoMongo = require('../daos/mongo/messageManagerMongo')
const router= Router();

//Instancia compartida del ProductManager
//const productManager = ProductManager.getInstance('./src/mock/productos.json');
const productService = new ProductDaoMongo()
const messageService = new MessageDaoMongo()

//Ruta para home
router.get('/', async (req, res) => {
    const products = await productService.getProducts();
    res.render('home', { title: 'Home', style: 'home.css', body: 'home', products });
});

// Ruta para realTimeProducts
router.get('/realtimeproducts', async (req, res) => {
    const products =  await productService.getProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', style: 'realTimeProducts.css', body: 'realTimeProducts', products });
});

router.get('/chat', async (req, res) => {
    const messages =  await messageService.getMessages();
    res.render('chat', { title: 'Chat', style: 'chat.css', body: 'chat', messages });
});



module.exports = router;
