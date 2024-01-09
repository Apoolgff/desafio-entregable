
const {usersModel} = require('./models/user.model');

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }

    // Muestra todos los usuarios
    async getUser(email) {
        try {
            const users = await this.model.findOne({email});
            return users;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    // Agrega un usuario
    async createUser(user) {
        try {
            if (!user.first_name || !user.last_name || !user.email || !user.password) {
                console.error('Todos los campos son obligatorios.');
                return null;
            }
            const existingUser = await this.model.findOne({ email: user.email });
            if (existingUser) {
                console.error('Ese Email ya esta en uso.');
                return;
            }

            
            const newUser = await this.model.create({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
            });
            console.log('Created User:', newUser.first_name, newUser.last_name, newUser.email);
            return newUser;

            /*const newUser = new this.model(user);
            await newUser.save();
            return newUser;*/
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }
}

module.exports = UserDaoMongo;