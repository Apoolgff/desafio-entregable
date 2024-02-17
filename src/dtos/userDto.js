
class UserDto{
    constructor(newUser){
        this.full_name = `${newUser.first_name} ${newUser.last_name}`
        this.email = newUser.email
        this.role = newUser.role
    }
}

module.exports = { UserDto }