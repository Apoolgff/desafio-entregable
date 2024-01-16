const passport = require('passport')
const local = require('passport-local')
const userDaoMongo = require('../daos/mongo/userManagerMongo')
const { createHash, isValidPassword } = require('../utils/hashPassword')

const LocalStrategy = local.Strategy
const userService = new userDaoMongo()


/*NOTA 1:
Agregue a la base de datos el email: 'adminCoder@coder.com' password 'adminCod3r123' y un formato para elegir si ser admin o usuario
porque aunque en entregas pasadas pedia que no viva en la base de datos, con el serializeUser, deserializeUser y otras cuestiones no dimos como hacerlo 
sin que de error el hardcodear un usuario/admin */

/*NOTA 2:
Elegi este passport para hacer ya que el profesor dijo que podiamos elegir entre el local y el de github. */

exports.initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, confirmPassword, role } = req.body;
            
            if (password !== confirmPassword) {
                return done('Las passwords no coinciden', false)
              }
            
            let userFound = await userService.getUser({ email: username })
            if (userFound) return done('Ese Email ya esta registrado', false)

            let newUser = {
                first_name,
                last_name,
                email: username,
                password: await createHash(password),
                role
            }
            let result = await userService.createUser(newUser)
            return done(null, result, { successRedirect: '/login', status: 200 })
        } catch (error) {
            return done('Error al crear usuario' + error)
        }
    }))


    passport.serializeUser((user, done) => {
        try {
            done(null, user.id);
        } catch (error) {
            done(error);
        }
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.getUser({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {          
            const user = await userService.getUser({ email: username })
            if (!user) {
                console.log('User not found')
                return done('El usuario no existe', false)
            }
            if(!(await isValidPassword(password, user.password))) return done('Password Incorrecta', false)

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))
}