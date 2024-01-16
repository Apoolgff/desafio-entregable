const passport = require('passport')
const local = require('passport-local')
const userDaoMongo = require('../daos/mongo/userManagerMongo')
const { createHash, isValidPassword } = require('../utils/hashPassword')

const LocalStrategy = local.Strategy
const userService = new userDaoMongo()

exports.initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, confirmPassword } = req.body;
            
            if (password !== confirmPassword) {
                return done(null, false)
              }
            
            let userFound = await userService.getUser({ email: username })
            if (userFound) return done(null, false)

            let newUser = {
                first_name,
                last_name,
                email: username,
                password: await createHash(password)
            }
            let result = await userService.createUser(newUser)
            return done(null, result, { successRedirect: '/login', status: 200 })
        } catch (error) {
            return done('Error al crear usuario' + error)
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUser({ _id: id })
        done(null, user)
    })

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userService.getUser({ email: username })
            if (!user) {
                console.log('User not found')
                return done(null, false)
            }
            if(!(await isValidPassword(password, user.password))) return done(null, false)

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))
}