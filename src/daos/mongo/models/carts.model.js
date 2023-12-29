const { Schema, model, Types} = require('mongoose')

const cartsCollection = 'Carts'

const CartsSchema = Schema({   
    products: {
      type: [{
        productId: { type: Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true },
      }],
    }
})

CartsSchema.pre('findOne', function(){
  this.populate('products.productId')
})

const cartsModel = model(cartsCollection, CartsSchema)

module.exports = {cartsModel}