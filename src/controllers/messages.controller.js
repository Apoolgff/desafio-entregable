const MessagesDaoMongo = require('../daos/mongo/messageManagerMongo')

class MessagesController{
    constructor(){
        this.messagesService = new MessagesDaoMongo()
    }

}

module.exports = MessagesController