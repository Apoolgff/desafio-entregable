const { Schema, model, Types} = require('mongoose')

const cartsCollection = 'Carts'

const CartsSchema = Schema({   
    products: [{
        productId: { type: Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true },
      }],
})

const cartsModel = model(cartsCollection, CartsSchema)

module.exports = {cartsModel}