const passport = require('passport');
const userDaoMongo = require('../daos/mongo/userManagerMongo');
const jwt = require('passport-jwt');


const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const { cookieExtractor, JWT_PRIVATE_KEY } = require('../utils/jwt');
const { configObject } = require('./index')

const userService = new userDaoMongo();


exports.initializePassport = () => {
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_secret_key,
    }, async (jwt_payload, done) => {
        try {
            const user = await userService.getBy({ _id: jwt_payload.id });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_secret_key,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
};







//YA NO LO USAMOS PARA ESTA ENTREGA
/*exports.initializePassport = () => {

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
}*/