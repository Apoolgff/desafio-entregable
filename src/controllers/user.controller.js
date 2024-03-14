//const UserDaoMongo = require('../daos/mongo/userManagerMongo')
const { userService } = require('../repositories/services');
const { EErrors } = require('../services/errors/enums');
const { generateUserErrorInfo } = require('../services/errors/errorGenerator');
const { createHash, isValidPassword } = require('../utils/hashPassword')
const { createToken } = require('../utils/jwt');
const { sendMail } = require('../utils/sendMail')
const CustomError = require('../services/errors/CustomError')
const { logger } = require('../utils/logger')


class UserController {
  constructor() {
    this.userService = userService
  }

  getCurrentUser = async (req, res) => {
    try {
      const userDto = await this.userService.getCurrent(req.user);
      res.send({ message: 'Datos del usuario actual', user: userDto });
    } catch (error) {
      logger.error('Error al obtener datos del usuario actual:', error.message);
      res.status(500).send('Error al obtener datos del usuario actual');
    }
  }

  userLogout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
      logger.error('Error al cerrar sesión:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }


  userLogin = async (req, res) => {
    const { email, password } = req.body;

    //En el form del login yo puse como que los campos son "required" lo que hace que este error no pueda darse, pero por las dudas...
    if (!email || !password) {
      logger.error('No ingreso todos los campos necesarios')
      return res.send('Todos los campos son obligatorios')
    }

    const user = await this.userService.getUser({ email });

    // Verifica si se encontró el usuario
    if (!user) {
      logger.error('El usuario no existe')
      return res.status(400).send('El Usuario NO Existe');
    }

    // Verifica si la contraseña es válida usando isValidPassword
    if (!(await isValidPassword(password, user.password))) {
      logger.error('Password incorrecta')
      return res.status(401).send('Contraseña inválida');
    }

    const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role })
    res.cookie('token', token, {
      maxAge: 3600000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
    }).json({
      status: 'success',
      message: 'logged in',
      redirectUrl: '/products',
    })
  }

  userRegister = async (req, res, next) => {
    try {
      const { first_name, last_name, email, password, confirmPassword, age, role } = req.body;

      if (!first_name || !last_name || !email || !age) {
        CustomError.createError({
          name: 'User creation error',
          cause: generateUserErrorInfo({ first_name, last_name, email, age }),
          message: 'Error trying to register user',
          code: EErrors.INVALID_TYPES_ERROR
        })
      }
      const existingUser = await this.userService.getUser({ email });
      if (existingUser) {
        //console.error('Ese Email ya esta en uso.');
        logger.error('Ese Email ya esta en uso.')
        return { error: 'Ese Email ya está en uso.' };
      }

      //Verifica si la contraseña y si confirmación coinciden
      if (password !== confirmPassword) {

        return res.send('Las contraseñas no coinciden');
      }

      const newUser = {
        first_name,
        last_name,
        email,
        password: await createHash(password),
        age,
        role
      }

      //Crea un nuevo usuario
      const result = await this.userService.createUser(newUser);

      //Envio del mail al registrar el usuario
      const to = newUser.email
      const subject = 'Mail de Registro'
      const html = `<div>
          <h2>Su cuenta fue creada satisfactoriamente ${newUser.first_name} ${newUser.last_name}</h2>
      </div>`
      try {
        await sendMail(to, subject, html);
      } catch (error) {
        logger.error('Error al enviar el correo electrónico:', error);
        return res.status(500).send('Error al enviar el correo electrónico.');
      }

      const token = createToken({ id: result._id })

      if (result.error) {
        return res.send(result.error);
      }
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
      }).json({
        status: 'success',
        message: 'logged in',
        redirectUrl: '/login',
      })

    } catch (error) {
      logger.error('Error al registrar usuario:', error.message);
      //res.send('Error al registrar usuario. Inténtalo de nuevo.');
      next(error)
    }
  }

  updateUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const updatedUser = await this.userService.updateUser(userId, req.body);
      const user = await this.userService.getUserBy(userId)

      const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, cart: user.cart, role: user.role })
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
      }).json({
        status: 'success',
        message: 'Role Updated',
        redirectUrl: '/role',
      })
      //const user = await this.userService.getUserBy({id: userId})
      logger.info(updatedUser)
      //res.json({ updatedUser });//res.send({status: 'success', payload: updatedUser})
    } catch (error) {
      logger.error(error.message);
      res.status(404).send('User Not Found');
    }
  }

  getUserBy = async (req, res) => {
    try {
      const userId = req.params.pid;
      const user = await this.userService.getUser(userId);
      res.json({ user });//res.send({status: 'success', payload: user})
    } catch (error) {
      logger.error(error.message);
      res.status(404).send('User Not Found');
    }
  }

  userRecovery = async (req, res) => {
    try {
      const { email } = req.body

      const user = await this.userService.getUser({ email });

      if (!user) {
        //console.error('Ese Email ya esta en uso.');
        logger.error('No existen usuarios con ese mail')
        return { error: 'No existen usuarios con ese mail' };
      }

      const token = createToken({ email: user.email, password: user.password })
      logger.info(user.email, user.password)

      const to = email
      const subject = 'Recuperacion de Password'
      const html = `
      <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <p><a href="http://localhost:8080/passrecovery/${token}">Restablecer contraseña</a></p>
      <p>Este enlace expirará en 1 hora.</p>
    `

      await sendMail(to, subject, html);

      logger.info('Mail Enviado');
      return res.status(200).send('Mail Enviado.');


    } catch (error) {
      logger.error(error.message);
      res.status(400).send('Invalid Email')
    }
  }

  resetPass = async (req, res) => {
    try {
        const { email, newPass, repPass } = req.body;

        // Verificar si las contraseñas nuevas coinciden
        if (newPass !== repPass) {
            return res.status(400).send('Las contraseñas no coinciden.');
        }

        // Obtener el usuario por su correo electrónico
        const user = await this.userService.getUser({ email });

        // Verificar si se encontró el usuario
        if (!user) {
            return res.status(400).send('Usuario no encontrado.');
        }

        // Generar el hash de la nueva contraseña
        const hashedNewPass = await createHash(newPass);

        // Actualizar la contraseña del usuario con el hash generado
        const updatedUser = await this.userService.updateUser(user._id, { password: hashedNewPass });

        // Mostrar un mensaje de éxito y redirigir a la página de inicio de sesión
        res.send('Contraseña restablecida con éxito.');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor');
    }
}


}

module.exports = UserController