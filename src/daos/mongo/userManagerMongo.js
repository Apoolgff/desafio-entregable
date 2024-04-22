const { usersModel } = require('./models/user.model');

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }

    //muestra todos los usuarios
    async get() {
        return await this.model.find();
    }

    // Muestra un usuario especifico segun un filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Obtiene producto por Id
    async getById(userId){
        return await this.model.findById({ _id: userId })
    }

    // Crea un usuario
    async create(user) {
        //const cart = await cartService.create();
        //user.cart = cart._id;
        return await this.model.create(user);
    }
    
    //modifica usuario
    async update(uid, updatedFields) {
        return await this.model.findOneAndUpdate(
            { _id: uid },
            { $set: updatedFields },
            { new: true }
        );
    }

    //Eliminar usuario segun ID
    async delete(uid) { 
        return await this.model.findByIdAndDelete(uid); 
    }
      
    //Elimina varios usuario por filtro
    async deleteBy(filter) {
        return await this.model.deleteMany(filter);
    }
      
      
}

module.exports = UserDaoMongo;