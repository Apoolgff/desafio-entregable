const { connect } = require('mongoose')

exports.connectDB = async () => {
    await connect('mongodb+srv://paologff:Databasecoder@cluster0.ssinb4w.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('Base de datos conectada')
  }