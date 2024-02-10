const { Schema, model, Types } = require('mongoose')

const ticketsCollection = "Tickets"

const TicketsSchema = Schema({

    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: Types.ObjectId, ref: 'Users',
        required: true
    },
})

TicketsSchema.pre('findOne', function(){
    this.populate('purchaser')
  })

const ticketsModel = model(ticketsCollection, TicketsSchema)

module.exports = {ticketsModel}