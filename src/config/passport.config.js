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
