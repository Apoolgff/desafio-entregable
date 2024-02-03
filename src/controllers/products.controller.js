const ProductDaoMongo = require('../daos/mongo/productManagerMongo')

class ProductsController {
    constructor(){
        this.productService = new ProductDaoMongo()
    }
    getProductsLimited = async (req, res) => {
        try {
            const { limit, page, sort, query } = req.query;
            const result = await this.productService.getProductsLimited({ limit, page, sort, query });
            res.json(result);//res.send({status: 'success', payload: result})
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }

    getProductById = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await this.productService.getProductById(productId);
            res.json({ product });//res.send({status: 'success', payload: product})
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Product Not Found');
        }
    }

    addProduct = async (req, res) => {
        try {
            const newProduct = await this.productService.addProduct(req.body);

            res.json({ product: newProduct });//res.send({status: 'success', payload: newProduct})
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