const { productsModel } = require('./models/products.model.js')

class ProductDaoMongo {
    constructor() {
        this.model = productsModel
    }

    async addProduct(product) {
        return await this.model.create(product);
    }

    //Muestra todos los productos 
    async getProducts() {
        return await this.model.find();
    }

    async getProductsLimited({ filter, options }) {
        return await this.model.paginate(filter, options);
    } 

    //Mostrar un producto segun ID
    async getProductById(id) { 
        return await this.model.findById(id);
    }

    //Actualizar un producto segun ID
    async updateProduct(pid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: pid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar producto segun ID
    async deleteProduct(pid) { 
        return await this.model.findByIdAndDelete(pid);
    }

}

module.exports = ProductDaoMongo