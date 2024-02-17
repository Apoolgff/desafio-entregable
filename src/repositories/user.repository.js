const { UserDto } = require('../dtos/userDto')

class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    getUsers = async () => await this.dao.get()

    getUser = async (filter) => await this.dao.getBy(filter)

    createUser = async (user) => await this.dao.create(user)

    getCurrent = async (filter) => {
        const user = await this.dao.getBy(filter);
        return new UserDto(user); 
    }
    

    updateProduct = async (uid, updatedFields) => await this.dao.update(uid, updatedFields)

    deleteProduct = async (uid) => await this.dao.delete(uid)

}

module.exports = { UserRepository }