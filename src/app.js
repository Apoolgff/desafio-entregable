const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const { connectDB, configObject } = require('./config/index')
const ProductDaoMongo = require('./daos/mongo/productManagerMongo');
const MessageDaoMongo = require('./daos/mongo/messageManagerMongo');
const cookieParser = require('cookie-parser');
const appRouter = require('./routes/index')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config')
const io = require('./helpers/serverIO');
const { handleError } = require('./middlewares/error/handleError');
const { addLogger } = require('./utils/logger')



const app = express();
const port = configObject.PORT||8080;

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

app.use(cookieParser(configObject.cookie_secret_key))

initializePassport()
app.use(passport.initialize())

app.use(addLogger)
app.use(appRouter)
app.use(handleError)


const serverHttp = app.listen(port, err => {
  if (err) console.log(err)
  console.log(`Escuchando en el puerto ${port}`)
})
io(serverHttp)
//const io = new Server(serverHttp);
console.log(`Socket.io server listening on port ${port}`);
