const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/cart.router');
const viewsRouter = require('./routes/views.router');
const { connectDB } = require('./config')
const ProductDaoMongo = require('./daos/mongo/productManagerMongo');
const MessageDaoMongo = require('./daos/mongo/messageManagerMongo');
//const ProductManager = require('./managers/productManager');

const app = express();
const port = 8080;

connectDB()

// Configuración de Handlebars
const hbs = exphbs.create({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts'),runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
}, });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));



//const productManager = ProductManager.getInstance('./src/mock/productos.json');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const serverHttp = app.listen(port, err => {
  if (err) console.log(err)
  console.log(`Escuchando en el puerto ${port}`)
})
const io = new Server(serverHttp);
console.log('Socket.io server listening on port 8080');

const productDao = new ProductDaoMongo();
const messageDao = new MessageDaoMongo();

//Sockets

io.on('connection', async (socket) => {

  console.log('Un cliente se ha conectado');


  try {
    const initialProducts = await productDao.getProducts();
    socket.emit('updateProducts', initialProducts);
  } catch (error) {
    console.error('Error al obtener los productos:', error.message);
  }

  // Escucha eventos de creación de producto desde el cliente
  socket.on('createProduct', async (newProduct) => {
    await productDao.addProduct(newProduct);
    io.emit('updateProducts', await productDao.getProducts());
  });

  // Escucha eventos de eliminación de producto desde el cliente
  socket.on('deleteProduct', async (productId) => {
    try {
      await productDao.deleteProduct(productId);
      // Emite el evento 'deleteProduct' a todos los clientes
      io.emit('deleteProduct', productId.toString());
    } catch (error) {
      console.error(error.message);
      // Envia un mensaje de error al cliente si el producto no fue encontrado
      socket.emit('deleteProductError', { productId, error: error.message });
    }
  });

  console.log('Nuevo cliente conectado');

    try {
        // Obtener mensajes al conectarse un nuevo cliente
        const messages = await messageDao.getMessages();
        socket.emit('updateMessages', messages);
    } catch (error) {
        console.error('Error al obtener mensajes:', error.message);
    }

    // Escuchar eventos de mensajes
    socket.on('sendMessage', async (data) => {
        try {
            // Guardar el mensaje en la base de datos
            await messageDao.addMessage(data);
            // Obtener todos los mensajes después de agregar uno nuevo
            const messages = await messageDao.getMessages();
            // Emitir a todos los clientes la actualización de mensajes
            io.emit('updateMessages', messages);
        } catch (error) {
            console.error('Error al enviar mensaje:', error.message);
        }
    });

});

