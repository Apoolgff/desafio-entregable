const { Schema, model } = require('mongoose');

const usersCollection = "Users"

const usersSchema = Schema({
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
  role: {
    type: String,
    required: true
  }
})

const usersModel = model(usersCollection, usersSchema)

module.exports = {usersModel}
