const { Server } = require('socket.io')
const ProductsManagerMongo = require('../daos/mongo/productManagerMongo')
const MessagesManagerMongo =require('../daos/mongo/messageManagerMongo')

const productDao = new ProductsManagerMongo()
const messageDao = new MessagesManagerMongo()


function SocketIO(server) {
    const io = new Server(server);
  
    io.on('connection', async (socket) => {
      console.log('Un cliente se ha conectado');
  
      try {
        const initialProducts = await productDao.get();
        //const initialProducts = await productsController.getProducts()
        socket.emit('updateProducts', initialProducts);
      } catch (error) {
        console.error('Error al obtener los productos:', error.message);
      }
  
      socket.on('createProduct', async (newProduct) => {
        await productDao.create(newProduct);
        //await productsController.createProduct(newProduct)
        io.emit('updateProducts', await productDao.get());
        //io.emit('updateProducts', await productsController.getProducts());
      });
  
      socket.on('deleteProduct', async (productId) => {
        try {
          await productDao.delete(productId);
          //await productsController.deleteProduct(productId);
          io.emit('deleteProduct', productId.toString());
        } catch (error) {
          console.error(error.message);
          socket.emit('deleteProductError', { productId, error: error.message });
        }
      });
  
      console.log('Nuevo cliente conectado');
  
      try {
        const messages = await messageDao.get()
        //const messages = await messagesController.getMessages();
        socket.emit('updateMessages', messages);
    } catch (error) {
        console.error('Error al obtener mensajes:', error.message);
    }

    // Escucha eventos de mensajes
    socket.on('sendMessage', async (user, message) => {
        try {
            await messageDao.addOrUpdateMessage(user, message);
            //await messagesController.addOrUpdateMessage(user, message);
            //const messages = await messagesController.getMessages();
            const messages = await messageDao.get();
            io.emit('updateMessages', messages);
        } catch (error) {
            console.error('Error al enviar mensaje:', error.message);
        }
    });
});
  }
  
  module.exports = SocketIO;