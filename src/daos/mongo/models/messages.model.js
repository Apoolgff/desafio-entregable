const { Schema, model } = require('mongoose')

const messagesCollection = 'Messages'

const MessagesSchema = Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String
    }
})

const messagesModel = model(messagesCollection, MessagesSchema)

module.exports = messagesModel