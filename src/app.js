const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/cart.router');
const viewsRouter = require('./routes/views.router');
const { connect } = require('mongoose')

const ProductManager = require('./managers/productManager');

const app = express();
const port = 8080;
const connectDB = async () => {
  await connect('mongodb+srv://paologff:Databasecoder@cluster0.ssinb4w.mongodb.net/ecommerce?retryWrites=true&w=majority')
  console.log('Base de datos conectada')
}
connectDB()

// Configuración de Handlebars
const hbs = exphbs.create({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts')  });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));



const productManager = ProductManager.getInstance('./src/mock/productos.json');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const serverHttp = app.listen(port,err =>{
  if (err)  console.log(err)
  console.log(`Escuchando en el puerto ${port}`)
})
const io = new Server(serverHttp);
console.log('Socket.io server listening on port 8080');


//Sockets

io.on('connection', (socket) => {
  
  console.log('Un cliente se ha conectado');


  const initialProducts = productManager.getProducts();
  socket.emit('updateProducts', initialProducts);

  // Escucha eventos de creación de producto desde el cliente
  socket.on('createProduct', (newProduct) => {
    productManager.addProduct(newProduct);
    io.emit('updateProducts', productManager.getProducts());
  });

  // Escucha eventos de eliminación de producto desde el cliente
  socket.on('deleteProduct', (productId) => {
    try {
      productManager.deleteProduct(productId);
      // Emite el evento 'deleteProduct' a todos los clientes
      io.emit('deleteProduct', productId);
    } catch (error) {
      console.error(error.message);
      // Envia un mensaje de error al cliente si el producto no fue encontrado
      socket.emit('deleteProductError', { productId, error: error.message });
    }
  });
});

