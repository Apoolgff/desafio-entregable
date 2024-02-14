const { configObject } = require('../config/index.js')

let UserDao
let ProductDao
let CartDao
let MessageDao
let TicketDao

//USO FACTORY SOLO PARA DEJAR CONSTANCIA DE QUE SE HACERLO, SOLO USARE MONGO.

switch (configObject.persistence) {
    case 'MONGO':
        const UserDaoMongo = require('./mongo/userManagerMongo')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/productManagerMongo')
        ProductDao = ProductDaoMongo

        const CartDaoMongo = require('./mongo/cartManagerMongo')
        CartDao = CartDaoMongo

        const MessageDaoMongo = require('./mongo/messageManagerMongo')
        MessageDao = MessageDaoMongo

        const TicketDaoMongo = require('./mongo/ticketManagerMongo')
        TicketDao = TicketDaoMongo

        break;

    case 'FILE':
        //SOLO ESTAN ESTOS FILES PORQUE SON LOS QUE SE PIDIERON EN SU MOMENTO Y QUE YA NO USAMOS.
        //EN ESTE CASO NO HARIA FALTA USAR FACTORY YA QUE SOLO USARE MONGO, PERO LO DEJO HECHO PARA QUE QUEDE CONSTANCIA QUE LO SE HACER

        //const CartDaoMongo = require('./file/managers/cartManager')
        //CartDao = CartDaoMongo

        //const ProductDaoFile = require('./file/managers/productManager')
        //ProductDao = ProductDaoFile

        break

    default:
        break;
}

module.exports = {
    ProductDao,
    UserDao,
    CartDao,
    MessageDao,
    TicketDao
}