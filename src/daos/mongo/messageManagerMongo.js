
const MessageModel = require('./models/messages.model');

class MessageDaoMongo {
    constructor() {
        this.model = MessageModel;
    }

    //Muestra todos los mensajes
    async getMessages() {
        try {
            const messages = await this.model.find();
            return messages;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.message);
            throw error;
        }
    }

    //Agrega un mensaje
    async addMessage(user, message) {
        try {
           return await this.model.create({ user, message });
            
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
            throw error;
        }
    }
}

module.exports = MessageDaoMongo;

