const { Schema, model, Types } = require('mongoose');

const usersCollection = "Users"

const UsersSchema = Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  age:{
    type: Number,
    required: true,
    trim: true
  },
  cart: {
  cartId: { type: Types.ObjectId, ref: 'Carts'/*, required: true*/ },
  },
  role: {
    type: String,
    required: true
  }
})

UsersSchema.pre('findOne', function(){
  this.populate('cart.cartId')
})

const usersModel = model(usersCollection, UsersSchema)

module.exports = {usersModel}
