const MessagesDaoMongo = require('../daos/mongo/messageManagerMongo');
const { messageService } = require('../repositories/services');

class MessagesController {
    constructor() {
        this.messagesService = messageService;
    }

    async getMessages(req, res) {
        try {
            const messages = await this.messagesService.getMessages();
            res.json(messages);
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.message);
            res.status(500).json({ error: 'Error al obtener los mensajes' });
        }
    }

    async getMessage(req, res) {
        try {
            const messageId = req.params.messageId;
            const message = await this.messagesService.getMessage({ _id: messageId });
            if (!message) {
                res.status(404).json({ error: 'Mensaje no encontrado' });
            } else {
                res.json(message);
            }
        } catch (error) {
            console.error('Error al obtener el mensaje:', error.message);
            res.status(500).json({ error: 'Error al obtener el mensaje' });
        }
    }

    async createMessage(req, res) {
        try {
            const { user, message } = req.body;
            if (!user || !message) {
                res.status(400).json({ error: 'El usuario y el mensaje son obligatorios' });
                return;
            }
            const newMessage = await this.messagesService.addMessage(user, message);
            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error al crear el mensaje:', error.message);
            res.status(500).json({ error: 'Error al crear el mensaje' });
        }
    }

    async getMessagesByUser(req, res) {
        try {
            const userEmail = req.params.userEmail;
            const messages = await this.messagesService.getMessagesByUser(userEmail);
            res.json(messages);
        } catch (error) {
            console.error('Error al obtener los mensajes del usuario:', error.message);
            res.status(500).json({ error: 'Error al obtener los mensajes del usuario' });
        }
    }

    async addOrUpdateMessage(req, res) {
        try {
            const { userEmail, message } = req.body;
            if (!userEmail || !message) {
                res.status(400).json({ error: 'El usuario y el mensaje son obligatorios' });
                return;
            }
            const updatedMessage = await this.messagesService.addOrUpdateMessage(userEmail, message);
            res.json(updatedMessage);
        } catch (error) {
            console.error('Error al agregar o actualizar el mensaje:', error.message);
            res.status(500).json({ error: 'Error al agregar o actualizar el mensaje' });
        }
    }
}

module.exports = MessagesController;
