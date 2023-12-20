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
            let existingUser = await this.model.findOne({ user });
    
            if (existingUser) {
              
                existingUser.messages.push({ message });
            } else {

                existingUser = await this.model.create({ user, messages: [{ message }] });
            }
    
            
            const result = await existingUser.save();
    
            return result;
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
            throw error;
        }
    }
}

module.exports = MessageDaoMongo;
