
const { userService, cartService } = require('../repositories/services');
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
    this.cartService = cartService
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

  userLogout = async (req, res) => {
    try {
      const userId = req.user._id;
      await this.userService.updateUser(userId, { last_connection: new Date() });
      res.clearCookie('token');
      res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
      logger.error('Error al cerrar sesión:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }


  userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.error('No ingreso todos los campos necesarios')
      return res.send('Todos los campos son obligatorios')
    }

    const user = await this.userService.getUser({ email });

    if (!user) {
      logger.error('El usuario no existe')
      return res.status(400).send('El Usuario NO Existe');
    }

    if (!(await isValidPassword(password, user.password))) {
      logger.error('Password incorrecta')
      return res.status(401).send('Contraseña inválida');
    }

    const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role, profile: user.profile, status: user.status })
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
      const cart = await this.cartService.createCart()

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
        logger.error('Ese Email ya esta en uso.')
        return { error: 'Ese Email ya está en uso.' };
      }

      if (password !== confirmPassword) {

        return res.send('Las contraseñas no coinciden');
      }

      const newUser = {
        first_name,
        last_name,
        email,
        password: await createHash(password),
        age,
        cart: cart._id,
        role,
        documents: []
      }

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
      next(error)
    }
  }

  uploadFiles = async (req, res) => {
    try {
      const userId = req.params.uid;
      const { identificacion, domicilio, cuenta, profile } = req.files;
      const user = await this.userService.getUserBy(userId);

      if (user.role === 'user' && (identificacion && domicilio && cuenta) && !profile && user.status === false) {
        console.log('aqui en documents')
        const updatedDocuments = [
          { name: 'Identificación', reference: `/files/documents/${identificacion[0].filename}` },
          { name: 'Comprobante de domicilio', reference: `/files/documents/${domicilio[0].filename}` },
          { name: 'Comprobante de estado de cuenta', reference: `/files/documents/${cuenta[0].filename}` }
        ];

        await this.userService.updateUser(userId, { documents: updatedDocuments, status: true });
      }
      else if (profile && (!identificacion || !domicilio || !cuenta)) {
        console.log('aqui en profile')
        const updatedProfile = `/files/profiles/${profile[0].filename}`;

        await this.userService.updateUser(userId, { profile: updatedProfile });
      }
      const userUpdated = await this.userService.getUserBy(userId);
      const token = createToken({ id: userUpdated._id, first_name: userUpdated.first_name, last_name: userUpdated.last_name, email: userUpdated.email, cart: userUpdated.cart, role: userUpdated.role, profile: userUpdated.profile, status: userUpdated.status })
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
      }).json({
        status: 'success',
        message: 'Updated',
        redirectUrl: '/role',
      })
    } catch (error) {
      logger.error(error.message);
      res.status(404).send('User Not Found');
    }
  }

  updateUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await this.userService.getUserBy(userId);



      if (user.role === 'user' && user.status === true) {
        console.log('aqui en premium')
        await this.userService.updateUser(userId, { role: 'premium' });
      }
      else if (user.role === 'premium') {
        console.log('rol a user')

        await this.userService.updateUser(userId, { role: 'user' });

      }
      const userUpdated = await this.userService.getUserBy(userId);
      const token = createToken({ id: userUpdated._id, first_name: userUpdated.first_name, last_name: userUpdated.last_name, email: userUpdated.email, cart: userUpdated.cart, role: userUpdated.role, profile: userUpdated.profile, status: userUpdated.status })
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
      logger.info(user)
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

      if (newPass !== repPass) {
        return res.status(400).send('Las contraseñas no coinciden.');
      }

      const user = await this.userService.getUser({ email });

      if (!user) {
        return res.status(400).send('Usuario no encontrado.');
      }

      const hashedNewPass = await createHash(newPass);

      await this.userService.updateUser(user._id, { password: hashedNewPass });

      res.send('Contraseña restablecida con éxito.');
    } catch (error) {
      logger.error(error.message);
      res.status(500).send('Error interno del servidor');
    }
  }

  updateUserAdmin = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await this.userService.getUserBy(userId);
      logger.info(userId, user.role)


      if (user.role === 'user') {
        console.log('aqui en premium')
        await this.userService.updateUser(userId, { role: 'premium', status: true });
      }
      else if (user.role === 'premium') {
        console.log('rol a user')

        await this.userService.updateUser(userId, { role: 'user' });

      }
      const userUpdated = await this.userService.getUserBy(userId);

      res.json({ userUpdated });//res.send({status: 'success', payload: updatedUser})
    } catch (error) {
      logger.error(error.message);
      res.status(404).send('User Not Found');
    }
  }

  deleteUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await this.userService.getUserBy(userId);

      if (!user) {
        return res.status(400).send('Usuario no encontrado.');
      }

      await this.userService.deleteUser(userId)
    } catch (error) {
      logger.error(error.message);
      res.status(404).send('User Not Found');
    }
  }

  deleteUsers = async (req, res) => {
    try {
      const now = new Date();
      const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
      const filter = {
        last_connection: { $lt: twoDaysAgo },
        role: { $ne: 'admin' }
      };

      const inactiveUsers = await this.userService.getUsers(filter);

      if (inactiveUsers.length > 0) {
        await Promise.all(inactiveUsers.map(async (inactiveUser) => {
          const lastConnection = new Date(inactiveUser.last_connection);
          const daysSinceLastConnection = Math.floor((now - lastConnection) / (1000 * 60 * 60 * 24));

          if (daysSinceLastConnection >= 2) {
            const to = inactiveUser.email;
            const subject = 'Cuenta Eliminada por Inactividad';
            const html = `<div>
                                    <h1>Su cuenta ha sido eliminada por inactividad de 2 días o más.</h1>
                                    <p>Si desea seguir utilizando nuestros servicios, por favor regístrese nuevamente.</p>
                                </div>`;
            await sendMail(to, subject, html);
          }
        }));

        await this.userService.deleteBy(filter);
      }
      res.status(200).send({status: 'success'})
    }
    catch (error) {
      logger.error(error.message);
      res.status(404).send('Error al eliminar usuarios');
    }
  }

}

module.exports = UserController