const jwt = require('jsonwebtoken');
const { configObject } = require('../config/index')
const { sendMail } = require('../utils/sendMail')

const { productService, messageService, cartService, userService } = require('../repositories/services')



class ViewsController {
    constructor() {
        this.productService = productService
        this.messageService = messageService
        this.cartService = cartService
        this.userService = userService
    }

    login = async (req, res) => {
        //ELIMINA A LOS USUARIOS CON 2 O MAS DIAS SIN CONECTARSE, NO NOS HAN EXPLICADO COMO HACER FUNCIONES QUE FUNCIONEN AUTOMATICAMENTE
        //SIN QUE NADIE ENTRE A LA PAGINA, ENTONCES SE ME OCURRIO HACERLO CUANDO ALGUIEN ENTRE A LA PAGINA PRINCIPAL.
        //SEGURO HAY FORMAS DE HACERLO MAS OPTIMO PERO NO NOS LO HAN EXPLICADO.
        const now = new Date(); 
        const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
        const filter = {
            last_connection: { $lt: twoDaysAgo },
            role: { $ne: 'admin' }
        };
    
        const inactiveUsers = await this.userService.getUsers(filter);

        if (inactiveUsers.length > 0) {
            await Promise.all(inactiveUsers.map(async (inactiveUser) => {
                const to = inactiveUser.email;
                const subject = 'Cuenta Eliminada por Inactividad';
                const html = `<div>
                                <h1>Su cuenta ha sido eliminada por inactividad de 2 días o más.</h1>
                                <p>Si desea seguir utilizando nuestros servicios, por favor regístrese nuevamente.</p>
                             </div>`;
                await sendMail(to, subject, html);
            }));
    
            await this.userService.deleteBy(filter);
        }
    
        res.render('login', { title: 'Login', style: 'login.css', body: 'login'});
    }
    

    register = async (req, res) => {
        res.render('register', { title: 'Register', style: 'login.css', body: 'register' });
    }

    home = async (req, res) => {
        const products = await this.productService.getProducts();
        res.render('home', { title: 'Home', style: 'products.css', body: 'home', products });
    }

    realTimeProducts = async (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }
        
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
        const products = await this.productService.getProducts();
        res.render('realTimeProducts', { title: 'Real-Time Products', style: 'realTimeProducts.css', body: 'realTimeProducts', products, user:decodedToken });
    }

    chat = async (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }
        
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
        const messages = await this.messageService.getMessages();
        res.render('chat', { title: 'Chat', style: 'chat.css', body: 'chat', messages, user:decodedToken });
    }

    products = async (req, res) => {
        try {
            const { limit = 2, page = 1, sort, query } = req.query;
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            };

            let filter = {};

            if (query) {
                const isStatus = query.toLowerCase() === 'true' || query.toLowerCase() === 'false';

                if (isStatus) {
                    filter.status = query.toLowerCase() === 'true';
                } else {
                    filter.category = query;
                }
            }

            const token = req.cookies.token;

            if (!token) {
                return res.redirect('/login');
            }

            const decodedToken = jwt.verify(token, configObject.jwt_secret_key);


            const result = await this.productService.getProductsLimited({ filter, options });
            const response = {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}` : null,
            };

            res.render('products', { title: 'Products', style: 'products.css', body: 'products', products: response.payload, pagination: response, user: decodedToken });
        } catch (error) {
            logger.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }

    manager = async (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }
        
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
        const products = await this.productService.getProducts();
        res.render('manager', { title: 'Product Manager', style: 'realTimeProducts.css', body: 'manager', products, user:decodedToken });
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

    role = async (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }
        
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
        res.render('role', { title: 'Profile', style: 'role.css', body: 'role', user:decodedToken });
    }

    recover = async (req, res) => {

        res.render('recover', { title: 'Password recovery', style: 'login.css', body: 'recover'});
    }

    passRecovery = async (req, res) => {
        const token = req.params.token;
    
        if (!token) {
            return res.redirect('/login');
        }
    
        try {
            const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
            res.render('passRecovery', { title: 'Password recovery', style: 'login.css', body: 'passRecovery', user: decodedToken });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Invalid token');
        }
    }
    
    admin = async (req, res) => {
        const token = req.cookies.token;
    
        if (!token) {
            return res.redirect('/login');
        }
        
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key);
        const users = await this.userService.getUsers();
    
        //Filtra los usuarios para excluir al "admin"
        const filteredUsers = users.filter(user => user.role !== 'admin');
    
        res.render('admin', { title: 'Admin Manager', style: 'realTimeProducts.css', body: 'admin', users: filteredUsers, user: decodedToken });
    }
    
    
}

module.exports = ViewsController