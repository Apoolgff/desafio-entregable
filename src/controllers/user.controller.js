const UserDaoMongo = require('../daos/mongo/userManagerMongo')
const { createHash, isValidPassword } = require('../utils/hashPassword')
const { createToken } = require('../utils/jwt');


class UserController {
  constructor() {
    this.userService = new UserDaoMongo()
  }

  getCurrentUser(req, res) {
    try {
      res.send({ message: 'Datos del usuario actual', user: req.user });
    } catch (error) {
      console.error('Error al obtener datos del usuario actual:', error.message);
      res.status(500).send('Error al obtener datos del usuario actual');
    }
  }

  userLogout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }


  userLogin = async (req, res) => {
    const { email, password } = req.body;

    //En el form del login yo puse como que los campos son "required" lo que hace que este error no pueda darse, pero por las dudas...
    if (!email || !password) {
      return res.send('Todos los campos son obligatorios')
    }

    const user = await this.userService.getUser({ email });

    // Verifica si se encontró el usuario
    if (!user) {
      return res.status(400).send('El Usuario NO Existe');
    }

    // Verifica si la contraseña es válida usando isValidPassword
    if (!(await isValidPassword(password, user.password))) {
      return res.status(401).send('Contraseña inválida');
    }

    const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role })
    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
    }).json({
      status: 'success',
      message: 'logged in',
      redirectUrl: '/products',
    })
  }

  userRegister = async (req, res) => {
    const { first_name, last_name, email, password, confirmPassword, age, role } = req.body;

    const existingUser = await this.userService.getUser({ email });
    if (existingUser) {
      console.error('Ese Email ya esta en uso.');
      return { error: 'Ese Email ya está en uso.' };
    }
    try {
      // Verifica si la contraseña y su confirmación coinciden
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

      // Crea un nuevo usuario
      const result = await this.userService.createUser(newUser);

      const token = createToken({ id: result._id })

      if (result.error) {
        return res.send(result.error);
      }
      res.cookie('token', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
      }).json({
        status: 'success',
        message: 'logged in',
        redirectUrl: '/login',
      })

    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      res.send('Error al registrar usuario. Inténtalo de nuevo.');
    }
  }
}

module.exports = UserController