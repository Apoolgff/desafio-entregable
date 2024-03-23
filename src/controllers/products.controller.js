//const ProductDaoMongo = require('../daos/mongo/productManagerMongo')
const { productService } = require('../repositories/services')
const { EErrors } = require('../services/errors/enums');
const { generateProductErrorInfo } = require('../services/errors/errorGenerator');
const CustomError = require('../services/errors/CustomError')
const { logger } = require('../utils/logger')
const fs = require('fs');

class ProductsController {
    constructor() {
        this.productService = productService
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productService.getProducts();
            if (res) {
                res.json(products);
            } else {
                return products;
            }
        } catch (error) {
            logger.error('Error al obtener los productos:', error.message);
            if (res) {
                res.status(500).json({ error: 'Error al obtener los productos' });
            } else {
                throw error;
            }
        }
    }

    getProductsLimited = async (req, res) => {
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
            logger.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }



    getProductBy = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await this.productService.getProductBy({_id: productId});
            res.json({ product });//res.send({status: 'success', payload: product})
        } catch (error) {
            logger.error(error.message);
            res.status(404).send('Product Not Found');
        }
    }

    createProduct = async (req, res, next) => {
        try {
            const { title, description, price, code, stock, category, owner } = req.body;

            if (!req.files || !req.files.length) {
                logger.error('No se proporcionó ningún archivo.');
                return res.status(400).send('Bad Request');
            }
            let updatedOwner = owner; // Inicialmente, asigna el valor original de owner

            if (owner === 'adminCoder@coder.com') {
                updatedOwner = 'Admin'; // Cambia el valor de owner si es 'adminCoder@coder.com'
            }

            logger.info(updatedOwner)

            if (!title || !description || !price || !code || !stock || !category) {
                CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({ title, description, price, code, stock, category }),
                    message: 'Error trying to create product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            const thumbnails = req.files.map(file => `/images/${file.filename}`);

            // Crear el producto con la ruta de la imagen
            const newProduct = await this.productService.createProduct({
                title,
                description,
                price,
                code,
                stock,
                category,
                owner: updatedOwner,
                thumbnails,
            });

            res.json({ product: newProduct });
        } catch (error) {
            //logger.error(error.message);
            //res.status(400).send('Bad Request');
            req.files.forEach(file => {
                fs.unlinkSync(file.path); // Eliminar archivo
            });
            next(error)
        }
    }



    updateProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedProduct = await this.productService.updateProduct(productId, req.body);
            res.json({ product: updatedProduct });//res.send({status: 'success', payload: updatedProduct})
        } catch (error) {
            logger.error(error.message);
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
            logger.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = ProductsController