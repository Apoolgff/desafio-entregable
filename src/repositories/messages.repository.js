class MessageRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getMessages() {
        return await this.dao.get();
    }

    async getMessage(filter) {
        return await this.dao.getBy(filter);
    }

    async createMessage(user, message) {
        return await this.dao.create(user, message);
    }

    async getMessagesByUser(userEmail) {
        return await this.dao.getByUser(userEmail);
    }

    async addOrUpdateMessage(userEmail, message) {
        return await this.dao.addOrUpdateMessage(userEmail, message);
    }
}

module.exports = { MessageRepository }
