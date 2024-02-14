
class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    getTickets = async () => await this.dao.get()

    getTicket = async (filter) => await this.dao.getBy(filter)

    createTicket = async (ticket) => await this.dao.create(ticket)

    getTicketById = async (id) => await this.dao.getById(id)

}

module.exports = { TicketRepository }