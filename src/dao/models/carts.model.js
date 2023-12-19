const { Schema, model} = require('mongoose')

const cartsCollection = 'Carts'

const CartsSchema = Schema({
    quantity: {
        type: Number,
        required: true
    }
})

const cartsModel = model(cartsCollection, CartsSchema)

module.exports = {cartsModel}