const { ticketsModel } = require('./models/ticket.model')

class TicketDaoMongo {
    constructor() {
        this.model = ticketsModel
    }

    //Crea un Ticket
    async create(ticket) {
        return await this.model.create(ticket);
    }

    //Muestra todos los Tickets 
    async get() {
        return await this.model.find();
    }

    //Muestra un ticket segun el filtro
    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Mostrar un ticket segun ID
    async getById(id) {
        return await this.model.findById(id);
    }

}

module.exports = TicketDaoMongo