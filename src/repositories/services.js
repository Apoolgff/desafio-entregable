const { ProductDao, CartDao, UserDao, TicketDao, MessageDao } = require('../daos/factory.js')
const { ProductRepository }   = require('./products.repository')
const { CartRepository } = require('./cart.repository')
const { UserRepository } = require('./user.repository')
const { TicketRepository } = require('./ticket.repository')
const { MessageRepository } = require('./messages.repository')


const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())
const userService = new UserRepository(new UserDao())
const ticketService = new TicketRepository(new TicketDao())
const messageService = new MessageRepository(new MessageDao())

module.exports = {
    productService,
    cartService,
    userService,
    ticketService,
    messageService
}