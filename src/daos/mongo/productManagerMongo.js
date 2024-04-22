const { productsModel } = require('./models/products.model.js')

class ProductDaoMongo {
    constructor() {
        this.model = productsModel
    }

    //Crea un producto
    async create(product) {
        return await this.model.create(product);
    }

    //Muestra todos los productos 
    async get() {
        return await this.model.find();
    }

    //Obtiene los productos con sus limites
    async getLimited({ filter, options }) {
        return await this.model.paginate(filter, options);
    } 

    //Mostrar un producto segun ID
    async getBy(filter) { 
        return await this.model.findOne(filter);
    }

    async getById(productId){
        return await this.model.findById({ _id: productId })
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