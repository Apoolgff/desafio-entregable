const ProductDaoMongo = require('../daos/mongo/productManagerMongo')
const MessageDaoMongo = require('../daos/mongo/messageManagerMongo')
const CartDaoMongo = require('../daos/mongo/cartManagerMongo')
const jwt = require('jsonwebtoken');

class ViewsController{
    constructor(){
        this.productService = new ProductDaoMongo()
        this.messageService = new MessageDaoMongo()
        this.cartService = new CartDaoMongo()
    }

    login = async (req, res) => {
        res.render('login', { title: 'Login', style: 'login.css', body: 'login' });
    }

    register = async (req, res) => {
        res.render('register', { title: 'Register', style: 'login.css', body: 'register' });
    }

    home = async (req, res) => {
        const products = await this.productService.getProducts();
        res.render('home', { title: 'Home', style: 'products.css', body: 'home', products });
    }

    realTimeProducts = async (req, res) => {
        const products = await this.productService.getProducts();
        res.render('realTimeProducts', { title: 'Real-Time Products', style: 'realTimeProducts.css', body: 'realTimeProducts', products });
    }

    chat = async (req, res) => {
        const messages = await this.messageService.getMessages();
        res.render('chat', { title: 'Chat', style: 'chat.css', body: 'chat', messages });
    }

    products = async (req, res) => {
        try {
            const { limit, page, sort, query } = req.query;
    
            //Obtener el token de la cookie
            const token = req.cookies.token;
    
            //Verificar si no hay token
            if (!token) {
                //Maneja el caso en el que el usuario no está autenticado
                return res.redirect('/login'); // Redirigir al usuario al login
            }
    
            //Decodificar el token para obtener la información del usuario
            const decodedToken = jwt.verify(token, 'CoderSecretJasonWebToken');
    
            //decodedToken contiene la información del usuario
    
            const result = await this.productService.getProductsLimited({ limit, page, sort, query });
            res.render('products', { title: 'Products', style: 'products.css', body: 'products', products: result.payload, pagination: result, user: decodedToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }

    cart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await this.cartService.getCart({ _id: cid });
            res.render('carts', { title: 'Cart', style: 'carts.css', body: 'carts', cart });
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Cart Not Found');
        }
    }
}

module.exports = ViewsController