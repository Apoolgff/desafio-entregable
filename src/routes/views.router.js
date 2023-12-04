
const { Router } = require('express');
const ProductManager = require('../managers/productManager');

const router= Router();

//Instancia compartida del ProductManager
const productManager = ProductManager.getInstance('./src/mock/productos.json');


//Ruta para home
router.get('/',  (req, res) => {
    const products =  productManager.getProducts();
    res.render('home', { title: 'Home', style: 'home.css', body: 'home', products });
});

// Ruta para realTimeProducts
router.get('/realtimeproducts',  (req, res) => {
    const products =  productManager.getProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', style: 'realTimeProducts.css', body: 'realTimeProducts', products });
});



module.exports = router;
