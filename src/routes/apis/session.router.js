const { Router } = require('express');
//const UserDaoMongo = require('../../daos/mongo/userManagerMongo');
const sessionRouter = Router();
//const userService = new UserDaoMongo();
//const { createHash, isValidPassword } = require('../../utils/hashPassword') 

const UserController = require('../../controllers/user.controller.js')
const userController = new UserController()
const passport = require('passport');
//const { createToken } = require('../../utils/jwt');
const { passportCall } = require ('../../utils/passportCall.js')
const { authenticationJwtCurrent } = require('../../middlewares/jwtPassport.middleware')
const { uploader } = require('../../utils/multer')


sessionRouter.get('/current', passportCall('jwt'), authenticationJwtCurrent, userController.getCurrentUser);

sessionRouter.get('/logout', passport.authenticate('jwt', { session: false }),  userController.userLogout);

sessionRouter.post('/login', userController.userLogin);

sessionRouter.post('/register', userController.userRegister);//Aca es donde envio el mail al registrarte

sessionRouter.put('/premium/:uid',userController.updateUser)

sessionRouter.post('/:uid/documents', uploader.fields([{ name: 'identificacion', maxCount: 1 }, { name: 'domicilio', maxCount: 1 }, { name: 'cuenta', maxCount: 1 }]), userController.updateUser)

sessionRouter.get('/:uid', userController.getUserBy)

sessionRouter.post('/recover', userController.userRecovery);

sessionRouter.post('/resetpass', userController.resetPass)



module.exports = sessionRouter;