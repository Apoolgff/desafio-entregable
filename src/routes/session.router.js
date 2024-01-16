const { Router } = require('express');
const UserDaoMongo = require('../daos/mongo/userManagerMongo');
const sessionRouter= Router();
const userService = new UserDaoMongo();//Sin uso aca
const { createHash, isValidPassword} = require ('../utils/hashPassword')//Sin uso aca
const passport = require('passport')


//Ruta para logout
sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/login');
        }
    });
});

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
  //Esta funcion se ejecuta despues de un registro exitoso
  res.redirect('/login');  //Redirige al usuario a la página de inicio de sesion despues del registro exitoso
});
sessionRouter.get('/failregister', (req, res) => {
  console.log('Fail strategy')
  res.send({status: 'error', error: 'Failed'})
})

//Ruta para el login(USANDO PASSPORT, QUEDA COMENTADO POR LAS DUDAS)

/*sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //En el form del login yo puse como que los campos son "required" lo que hace que este error no pueda darse, pero por las dudas...
    if(!email || !password ){
        return res.send('Todos los campos son obligatorios')
    }

    //Verifica si es el admin (que no vive en la base de datos) para poder ingresar
    //Como esta especificado en el proceso de testing.
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { first_name: 'Coder', email, role: 'admin' };
        console.log('Es admin');
        return res.redirect('/products'); 
    }

    const user = await userService.getUser(email);

    // Verifica si se encontró el usuario
    if (!user) {
        return res.status(400).send('El Usuario NO Existe');
    }

    // Verifica si la contraseña es válida usando isValidPassword
    if (!(await isValidPassword(password, user.password))) {
        return res.status(401).send('Contraseña inválida');
    }

    //Si todas las verificaciones estan correctas ingresa como usuario
    req.session.user = { first_name: user.first_name, last_name: user.last_name, email, role: 'usuario' };
    console.log('Es usuario');
    res.redirect('/products');
});*/


//Ruta para registrarse (USANDO PASSPORT, QUEDA COMENTADO POR LAS DUDAS)

/*sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, confirmPassword } = req.body;

    try {
      // Verifica si la contraseña y su confirmación coinciden
      if (password !== confirmPassword) {
        return res.send('Las contraseñas no coinciden');
      }
      console.log(typeof password);
      const newUser = {
        first_name,
        last_name,
        email,
        password: await createHash(password)
      }
      console.log(typeof password);
      // Crea un nuevo usuario
      const result = await userService.createUser(newUser);

      if (result.error) {
        return res.send(result.error);
    }
  
      res.redirect('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      res.send('Error al registrar usuario. Inténtalo de nuevo.');
    }
  });*/

  module.exports = sessionRouter;