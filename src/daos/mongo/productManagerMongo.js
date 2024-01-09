const { productsModel } = require('./models/products.model.js')

class ProductDaoMongo {
    constructor() {
        this.model = productsModel
    }

    //Agrega/Crea un producto
    async addProduct(product) {
        try {
            if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
                console.error('Todos los campos son obligatorios.');
                return null;
            }

           
            const existingProduct = await this.model.findOne({ code: product.code });
            if (existingProduct) {
                console.error('El campo "code" ya está en uso.');
                return null;
            }

           
            const thumbnails = product.thumbnails || [];


          
            const newProduct = await this.model.create({
                title: product.title,
                description: product.description,
                price: product.price,
                code: product.code,
                stock: product.stock,
                category: product.category,
                status: true,
                thumbnails: thumbnails,
            });
            console.log('Created Product:', newProduct);
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
            throw error;
        }
    }

    //Muestra todos los productos 
    async getProducts() {
        try {
            const products= await this.model.find();
            return products
          } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            throw error;
          }
    }

    // Muestra los productos con paginacion segun los filtros deseados
    async getProductsLimited({ limit = 2, page = 1, sort, query } = {}) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            };
    
            let filter = {};
    
            if (query) {
                // Verifica si query es un estado valido (true o false)
                const isStatus = query.toLowerCase() === 'true' || query.toLowerCase() === 'false';
    
                if (isStatus) {
                    filter.status = query.toLowerCase() === 'true';
                } else {
                    // Si no es un estado, entonces es una categoría y mostrara solo la categoria deseada y no todos los productos
                    filter.category = query;
                }
            }
    
            const result = await this.model.paginate(filter, options);
    
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
    
            return response;
        } catch (error) {
            console.error('Error al obtener los productos paginados:', error.message);
            throw error;
        }
    }


    //Mostrar un producto segun ID
    async getProductById(id) { 
        try {
            const product = await this.model.findById(id);
      
            if (!product) {
                throw new Error('El producto no fue encontrado.');
            }
      
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error.message);
            throw error;
        }
    }

    //Actualizar un producto segun ID
    async updateProduct(pid, updatedFields) {
        try {
            const updatedProduct = await this.model.findOneAndUpdate(
                { _id: pid },
                { $set: updatedFields },
                { new: true }
            );

            if (updatedProduct) {
                return updatedProduct;
            } else {
                console.error('No se encontró el producto para actualizar.');
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error.message);
            throw error;
        }
    }

    //Eliminar producto segun ID
    async deleteProduct(pid) { 
        try {
            const deletedProduct = await this.model.findByIdAndDelete(pid);
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
            throw error;
        }
    }

}

module.exports = ProductDaoMongo