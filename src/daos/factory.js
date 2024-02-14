const { configObject } = require('../config/index')

let UserDao
let ProductDao
let CartDao
let MessageDao
let TicketDao


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
        
        //const CartDaoMongo = require('./file/managers/cartManager')
        //CartDao = CartDaoMongo

        //const ProductDaoFile = require('./file/managers/productManager')
        //ProductDao = ProductDaoFile

        break;

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