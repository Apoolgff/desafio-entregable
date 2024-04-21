const { UserDto } = require('../dtos/userDto')

class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    getUsers = async () => await this.dao.get()

    getUser = async (filter) => await this.dao.getBy(filter)

    getUserBy = async (userId) => await this.dao.getById(userId)

    createUser = async (user) => await this.dao.create(user)

    getCurrent = async (filter) => {
        const user = await this.dao.getBy(filter);
        return new UserDto(user); 
    }
    
    updateUser = async (uid, updatedFields) => await this.dao.update(uid, updatedFields)

    deleteUser = async (uid) => await this.dao.delete(uid)

    deleteBy = async (filter) => await this.dao.deleteBy(filter)

}

module.exports = { UserRepository }