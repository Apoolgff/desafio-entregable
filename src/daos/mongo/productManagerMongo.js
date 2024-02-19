const { productsModel } = require('./models/products.model.js')

class ProductDaoMongo {
    constructor() {
        this.model = productsModel
    }

    async create(product) {
        return await this.model.create(product);
    }

    //Muestra todos los productos 
    async get() {
        return await this.model.find();
    }

    async getLimited({ filter, options }) {
        return await this.model.paginate(filter, options);
    } 

    //Mostrar un producto segun ID
    async getBy(filter) { 
        return await this.model.findOne(filter);
    }

    //Actualizar un producto segun ID
    async update(pid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: pid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar producto segun ID
    async delete(pid) { 
        return await this.model.findByIdAndDelete(pid);
    }

}

module.exports = ProductDaoMongo