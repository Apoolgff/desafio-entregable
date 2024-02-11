
const { messagesModel } = require('./models/messages.model');

class MessageDaoMongo {
    constructor() {
        this.model = messagesModel;
    }

    //Muestra todos los mensajes
    async getMessages() {
        return await this.model.find();
    }

    async getMessage(filter) {
        return await this.model.findOne(filter);
    }

    //Agrega un mensaje
    async addMessage(user, message) {
        return await this.model.create({ user, message });
    }
}

module.exports = MessageDaoMongo;

