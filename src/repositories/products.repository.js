
class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async () => await this.dao.get()

    getProductsLimited = async ({filter, options}) => await this.dao.getLimited({filter, options})

    getProductBy = async (filter) => await this.dao.getBy(filter)

    createProduct = async (product) => await this.dao.create(product)

    updateProduct = async (pid, updatedFields) => await this.dao.update(pid, updatedFields)

    deleteProduct = async (pid) => await this.dao.delete(pid)


}

module.exports = { ProductRepository }