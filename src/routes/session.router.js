const { Router } = require('express');
const UserDaoMongo = require('../daos/mongo/userManagerMongo');
const sessionRouter = Router();
const userService = new UserDaoMongo();
const { createHash, isValidPassword } = require('../utils/hashPassword') 
const passport = require('passport');
const { createToken } = require('../utils/jwt');
const { passportCall } = require ('../utils/passportCall.js')
const { authorizationJwt,  authenticationJwtCurrent  } = require('../middlewares/jwtPassport.middleware')


sessionRouter.get('/current', passportCall('jwt'), authenticationJwtCurrent, (req, res) => {
  res.send({ message: 'Datos del usuario actual', user: req.user });
});

sessionRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Borra la cookie del token
  res.clearCookie('token');

  res.status(200).json({ status: 'success', message: 'Logout successful' });
});

//PASSPORT SIN JWT, YA NO LO USO PERO POR LAS DUDAS QUEDA ACA POR AHORA
//Ruta para logout
/*sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/login');
        }
    });
});*/
/*
//Ruta para el Login
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/faillogin'}), async (req, res) => {
  if(!req.user) return res.status(401).send({status: 'error', error: 'Invalid Credential'})

  req.session.user = { first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email, role: req.user.role };
  res.redirect('/products');//Redirige al usuario a la página de productos despues del login exitoso
  //res.send({status: 'success', message: 'Login success'})
})
sessionRouter.get('/faillogin', (req, res) => {
  console.log('Fail strategy')
  res.send({status: 'error', error: 'Failed login'})
})

//Ruta para el Registro
sessionRouter.post('/register', passport.authenticate('register', { 
  failureRedirect: '/api/session/failregister'
}), (req, res) => {
  res.redirect('/login');  //Redirige al usuario a la página de inicio de sesion despues del registro exitoso
});
sessionRouter.get('/failregister', (req, res) => {
  console.log('Fail strategy')
  res.send({status: 'error', error: 'Failed'})
})*/



sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  //En el form del login yo puse como que los campos son "required" lo que hace que este error no pueda darse, pero por las dudas...
  if (!email || !password) {
    return res.send('Todos los campos son obligatorios')
  }

  //Verifica si es el admin (que no vive en la base de datos) para poder ingresar
  //Como esta especificado en el proceso de testing.
  /*if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    req.session.user = { first_name: 'Coder', email, role: 'admin' };
    console.log('Es admin');
    return res.redirect('/products');
  }*/

  const user = await userService.getUser({email});

  // Verifica si se encontró el usuario
  if (!user) {
    return res.status(400).send('El Usuario NO Existe');
  }

  // Verifica si la contraseña es válida usando isValidPassword
  if (!(await isValidPassword(password, user.password))) {
    return res.status(401).send('Contraseña inválida');
  }
console.log(user)
  const token = createToken({id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role })
  res.cookie('token', token,{
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
  }).json({
      status: 'success',
      message: 'logged in',
      redirectUrl: '/products',
  })
  //Si todas las verificaciones estan correctas ingresa como usuario
  //req.session.user = { first_name: user.first_name, last_name: user.last_name, email, role: 'usuario' };
});


//Ruta para registrarse (USANDO PASSPORT, QUEDA COMENTADO POR LAS DUDAS)

sessionRouter.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, confirmPassword, age, role } = req.body;

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
    const result = await userService.createUser(newUser);

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
});

module.exports = sessionRouter;