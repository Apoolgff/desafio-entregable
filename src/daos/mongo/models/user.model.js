const { Schema, model } = require('mongoose');

const usersCollection = "Users"

// Definir el esquema del usuario
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
  }
})

// Crear el modelo de usuario basado en el esquema
const usersModel = model(usersCollection, usersSchema)

module.exports = {usersModel}
