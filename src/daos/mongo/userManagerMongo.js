const { usersModel } = require('./models/user.model');
const CartDaoMongo = require('./cartManagerMongo')

const cartService = new CartDaoMongo()

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }

    // Muestra un usuario especifico segun un filtro
    async getUser(filter) {
        return await this.model.findOne(filter);
    }

    // Crea un usuario
    async createUser(user) {
        const cart = await cartService.createCart();
        user.cart = cart._id;
        return await this.model.create(user);
    }
    
      
      
      
}

module.exports = UserDaoMongo;