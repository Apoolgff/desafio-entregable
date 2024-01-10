
const { usersModel } = require('./models/user.model');

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }

    // Muestra un usuario especifico segun su Email
    async getUser(email, password) {
        try {
            const user = await this.model.findOne({ email, password });
            return user;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    // Crea un usuario
    async createUser(user) {
        try {
            if (!user.first_name || !user.last_name || !user.email || !user.password) {
                console.error('Todos los campos son obligatorios.');
                return { error: 'Todos los campos son obligatorios.' };
            }
            const existingUser = await this.model.findOne({ email: user.email });
            if (existingUser) {
                console.error('Ese Email ya esta en uso.');
                return { error: 'Ese Email ya está en uso.' };
            }


            const newUser = await this.model.create({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
            });
            console.log('Created User:', newUser.first_name, newUser.last_name, newUser.email);
            return newUser;

        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }
}

module.exports = UserDaoMongo;