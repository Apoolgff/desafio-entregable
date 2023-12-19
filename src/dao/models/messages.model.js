const { Schema, model} = require('mongoose')

const messagesCollection = 'Messages'

const MessagesSchema = Schema({
    user: {
        type: String,
        required: true,
        unique
    },
    message: {
        type: String,
        required: true
    }
})

const messagesModel = model(messagesCollection, MessagesSchema)

module.exports = {messagesModel}