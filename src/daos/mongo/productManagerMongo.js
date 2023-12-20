const { productsModel } = require('./models/products.model.js')

class ProductDaoMongo {
    constructor() {
        this.model = productsModel
    }

    async addProduct(product) {
        try {
            if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
                console.error('Todos los campos son obligatorios.');
                return null;
            }

            // Verificar si ya existe un producto con el mismo código
            const existingProduct = await this.model.findOne({ code: product.code });
            if (existingProduct) {
                console.error('El campo "code" ya está en uso.');
                return null;
            }

            // Agregar las imágenes en miniatura si están presentes
            const thumbnails = product.thumbnails || [];


            // Crear un nuevo producto utilizando el modelo de Mongoose
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


    async getProducts() {
        try {
            const products= await this.model.find();
            return products
          } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            throw error;
          }
    }

    async getProductsLimited(limit) {
        if (limit) {
            return this.model.find().limit(limit);
        } else {
            return this.model.find();
        }
    }

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