const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
//const productsRouter = require('./routes/apis/products.router');
//const cartsRouter = require('./routes/apis/cart.router');
//const viewsRouter = require('./routes/views.router');
//const sessionRouter = require('./routes/apis/session.router')
const { connectDB } = require('./config')
const ProductDaoMongo = require('./daos/mongo/productManagerMongo');
const MessageDaoMongo = require('./daos/mongo/messageManagerMongo');

const cookieParser = require('cookie-parser');
//const session = require('express-session')
//const MongoStore = require('connect-mongo');

const appRouter = require('./routes/index')

const passport = require('passport')
const { initializePassport } = require('./config/passport.config')

const app = express();
const port = 8080;

connectDB()

// Configuración de Handlebars
const hbs = exphbs.create({
  extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts'), runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser())

//YA NO USAMOS SESSION
/*app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://paologff:Databasecoder@cluster0.ssinb4w.mongodb.net/ecommerce?retryWrites=true&w=majority',
    ttl: 60000,
  }),
  secret: 'secretCoder',
  resave: true,
  saveUninitialized: true,
}))*/

initializePassport()
app.use(passport.initialize())

//app.use(passport.initialize()) YA NO USAMOS
//app.use(passport.session()) YA NO USAMOS

/*app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/session', sessionRouter)
app.use('/', viewsRouter);*/

app.use(appRouter)

//Para que la primer pagina se el login
/*app.get('/', (req, res) => {
  res.redirect('/login');
});*/

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


  socket.on('createProduct', async (newProduct) => {
    await productDao.addProduct(newProduct);
    io.emit('updateProducts', await productDao.getProducts());
  });


  socket.on('deleteProduct', async (productId) => {
    try {
      await productDao.deleteProduct(productId);

      io.emit('deleteProduct', productId.toString());
    } catch (error) {
      console.error(error.message);

      socket.emit('deleteProductError', { productId, error: error.message });
    }
  });

  console.log('Nuevo cliente conectado');

  try {

    const messages = await messageDao.getMessages();
    socket.emit('updateMessages', messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error.message);
  }

  //Escucha eventos de mensajes
  socket.on('sendMessage', async (user, message) => {
    try {

      await messageDao.addMessage(user, message);

      const messages = await messageDao.getMessages();

      io.emit('updateMessages', messages);
    } catch (error) {
      console.error('Error al enviar mensaje:', error.message);
    }
  });
  
});