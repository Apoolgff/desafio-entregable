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
    type: Types.ObjectId, ref: 'Carts',
  },
  role: {
    type: String,
    required: true
  },
  documents: [{
    name: { type: String },
    reference: { type: String }
  }],
  last_connection: {
    type: Date,
    default: Date.now
  },
  profile: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: Boolean,
    default: false
  }
})

UsersSchema.pre('findOne', function(){
  this.populate('cart')
})

const usersModel = model(usersCollection, UsersSchema)

module.exports = {usersModel}
