
const { messagesModel } = require('./models/messages.model');

class MessageDaoMongo {
    constructor() {
        this.model = messagesModel;
    }

    //Muestra todos los mensajes
    async get() {
        return await this.model.find();
    }

    async getBy(filter) {
        return await this.model.findOne(filter);
    }

    //Agrega un mensaje
    async create(user, message) {
        return await this.model.create({ user, message });
    }

    async getByUser(userEmail) {
        return await this.model.findOne({ user: userEmail });
    }

    async addOrUpdateMessage(userEmail, message) {
        const existingMessage = await this.getMessagesByUser(userEmail);
    
        if (existingMessage) {
            await this.model.updateOne(
                { user: userEmail },
                { $push: { messages: { message } } } // Aquí debería ser { $push: { messages: { message: message } } }
            );
            return existingMessage;
        } else {
            return await this.model.create({ user: userEmail, messages: [{ message }] });
        }
    }
    
}

module.exports = MessageDaoMongo;

