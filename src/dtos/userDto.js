
class UserDto{
    constructor(newUser){
        this.first_name = newUser.first_name
        this.last_name = newUser.last_name
        this.email = newUser.email
        this.age = newUser.age
        this.cart = newUser.cart
        this.role = newUser.role
    }
}

module.exports = { UserDto }