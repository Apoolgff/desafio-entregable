const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productsCollection = "Products"

const ProductsSchema = Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array
    }
})

ProductsSchema.plugin(mongoosePaginate)
const productsModel = model(productsCollection, ProductsSchema)

module.exports = {productsModel}
