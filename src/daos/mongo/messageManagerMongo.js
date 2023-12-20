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
            const existingUser = await this.model.findOne({ user });

            if (existingUser) {
                // Si el usuario ya existe, agregar el nuevo mensaje al array
                existingUser.messages.push({ message });
                await existingUser.save();
            } else {
                // Si el usuario no existe, crear un nuevo documento con el mensaje
                await this.model.create({ user, messages: [{ message }] });
            }
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
            throw error;
        }
    }
}

module.exports = MessageDaoMongo;
