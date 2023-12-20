// daos/mongo/messageDaoMongo.js
const MessageModel = require('./models/messages.model');

class MessageDaoMongo {
    constructor() {
        this.model = MessageModel;
    }

    async getMessages() {
        try {
            const messages = await this.model.find();
            return messages;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.message);
            throw error;
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = await this.model.create({ user, message });
            return newMessage;
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
            throw error;
        }
    }
}

module.exports = MessageDaoMongo;
