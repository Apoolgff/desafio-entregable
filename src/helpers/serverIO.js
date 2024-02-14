const { Server } = require('socket.io')
const ProductsManagerMongo = require('../daos/mongo/productManagerMongo')
const MessagesManagerMongo =require('../daos/mongo/messageManagerMongo')

const productDao = new ProductsManagerMongo()
const messageDao = new MessagesManagerMongo()

const ProductsController = require('../controllers/products.controller')
const MessagesController = require('../controllers/messages.controller')

const productsController = new ProductsController()
const messagesController = new MessagesController()

function SocketIO(server) {
    const io = new Server(server);
  
    io.on('connection', async (socket) => {
      console.log('Un cliente se ha conectado');
  
      try {
        //const initialProducts = await productDao.getProducts();
        const initialProducts = await productsController.getProducts()
        socket.emit('updateProducts', initialProducts);
      } catch (error) {
        console.error('Error al obtener los productos:', error.message);
      }
  
      socket.on('createProduct', async (newProduct) => {
        //await productDao.addProduct(newProduct);
        await productsController.createProduct(newProduct)
        //io.emit('updateProducts', await productDao.getProducts());
        io.emit('updateProducts', await productsController.getProducts());
      });
  
      socket.on('deleteProduct', async (productId) => {
        try {
          //await productDao.deleteProduct(productId);
          await productsController.deleteProduct(productId);
          io.emit('deleteProduct', productId.toString());
        } catch (error) {
          console.error(error.message);
          socket.emit('deleteProductError', { productId, error: error.message });
        }
      });
  
      console.log('Nuevo cliente conectado');
  
      try {
        //const messages = await messageDao.getMessages();
        const messages = await messagesController.getMessages();
        socket.emit('updateMessages', messages);
      } catch (error) {
        console.error('Error al obtener mensajes:', error.message);
      }
  
      // Escucha eventos de mensajes
      socket.on('sendMessage', async (user, message) => {
        try {
          //await messageDao.addOrUpdateMessage(user, message);
          await messagesController.addOrUpdateMessage(user, message);
          //const messages = await messageDao.getMessages();
          const messages = await messagesController.getMessages();
          io.emit('updateMessages', messages);
      } catch (error) {
          console.error('Error al enviar mensaje:', error.message);
      }
      });
    });
  }
  
  module.exports = SocketIO;