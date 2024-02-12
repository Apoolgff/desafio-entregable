const { Schema, model, Types } = require('mongoose')

const messagesCollection = 'Messages'

const MessagesSchema = Schema({
    user: {
        type: String,
        required: true,
    },
    messages: [{
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }]
})

MessagesSchema.pre('findOne', function () {
    this.populate('user')
})

const messagesModel = model(messagesCollection, MessagesSchema)

module.exports = {messagesModel}