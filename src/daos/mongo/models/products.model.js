/*const mongoose = require('mongoose')*/
const { Schema, model } = require('mongoose')

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
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array
    }
})

const productsModel = model(productsCollection, ProductsSchema)

module.exports = {productsModel}
