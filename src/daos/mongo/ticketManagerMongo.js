const { ticketsModel } = require('./models/ticket.model')

class TicketDaoMongo {
    constructor() {
        this.model = ticketsModel
    }

    //Crea un Ticket
    async createTicket(ticket) {
        return await this.model.create(ticket);
    }

    //Muestra todos los Tickets 
    async getTickets() {
        return await this.model.find();
    }

    //Muestra un ticket segun el filtro
    async getTicket(filter) {
        return await this.model.findOne(filter);
    }

    //Mostrar un ticket segun ID
    async getTicketById(id) {
        return await this.model.findById(id);
    }

}

module.exports = TicketDaoMongo