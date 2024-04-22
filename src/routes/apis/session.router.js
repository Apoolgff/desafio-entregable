const { Router } = require('express');
const sessionRouter = Router();


const UserController = require('../../controllers/user.controller.js')
const userController = new UserController()
const passport = require('passport');
const { passportCall } = require ('../../utils/passportCall.js')
const { authenticationJwtCurrent } = require('../../middlewares/jwtPassport.middleware')
const { uploader } = require('../../utils/multer')

//Obtiene Usuario Actual
sessionRouter.get('/current', passportCall('jwt'), authenticationJwtCurrent, userController.getCurrentUser);

//Cierre de session
sessionRouter.get('/logout', passport.authenticate('jwt', { session: false }),  userController.userLogout);

//Inicio de session
sessionRouter.post('/login', userController.userLogin);

//Registro de usuario
sessionRouter.post('/register', userController.userRegister);//Aca es donde envio el mail al registrarte

//Modifica el rol del usuario
sessionRouter.put('/premium/:uid',userController.updateUser)

//Subida de documentos
sessionRouter.post('/:uid/documents', uploader.fields([{ name: 'identificacion', maxCount: 1 }, { name: 'domicilio', maxCount: 1 }, { name: 'cuenta', maxCount: 1 }, { name: 'profile', maxCount: 1 }]), userController.uploadFiles)

//Obtiene usuario por Id
sessionRouter.get('/:uid', userController.getUserBy)

//Recuperacion de password
sessionRouter.post('/recover', userController.userRecovery);

//Reset de password
sessionRouter.post('/resetpass', userController.resetPass)

//Update de usuario por el admin
sessionRouter.put('/admin/:uid',userController.updateUserAdmin)

//Eliminacion de usuarios
sessionRouter.delete('/:uid',userController.deleteUser)



module.exports = sessionRouter;