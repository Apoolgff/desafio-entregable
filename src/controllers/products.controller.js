//const ProductDaoMongo = require('../daos/mongo/productManagerMongo')
const { productService } = require('../repositories/services')

class ProductsController {
    constructor(){
        this.productService = productService
    }

    async getProducts(req, res) {
        try {
            const products = await this.productService.getProducts();
            if (res) {
                res.json(products);
            } else {
                return products;
            }
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            if (res) {
                res.status(500).json({ error: 'Error al obtener los productos' });
            } else {
                throw error;
            }
        }
    }

    async getProductsLimited(req, res) {
        try {
            const { limit = 3, page = 1, sort, query } = req.query;
    
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
    
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
    


    getProductBy = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await this.productService.getProductBy(productId);
            res.json({ product });//res.send({status: 'success', payload: product})
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Product Not Found');
        }
    }

    createProduct = async (req, res) => {
        try {
            
            const { title, description, price, code, stock, category, thumbnails } = req.body;
    
            if (!title || !description || !price || !code || !stock || !category) {
                console.error('Todos los campos son obligatorios.');
                return res.status(400).send('Bad Request');
            }
    
            const existingProduct = await this.productService.getProductBy({code: code});
    
            if (existingProduct) {
                console.error('El campo "code" ya está en uso.');
                return res.status(400).send('Bad Request');
            }
    
            const newProduct = await this.productService.createProduct({ 
                title, 
                description, 
                price, 
                code, 
                stock, 
                category,
                thumbnails });
    
            res.json({ product: newProduct });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }
    

    updateProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedProduct = await this.productService.updateProduct(productId, req.body);
            res.json({ product: updatedProduct });//res.send({status: 'success', payload: updatedProduct})
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Product Not Found');
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const deletedProduct = await this.productService.deleteProduct(productId);

            if (deletedProduct) {
                res.json({ product: deletedProduct });//res.send({status: 'success', payload: deletedProduct})
            } else {
                res.status(404).send('Product Not Found');
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = ProductsController