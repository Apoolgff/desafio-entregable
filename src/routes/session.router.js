const { Router } = require('express');
const UserDaoMongo = require('../daos/mongo/userManagerMongo');
const sessionRouter= Router();
const userService = new UserDaoMongo();

//Ruta para el login
sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password ){
        return res.send('Todos los campos son obligatorios')
    }

    //Verifica si es el admin (que no vive en la base de datos) para poder ingresar
    //Como esta especificado en el proceso de testing.
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { first_name: 'Admin', email, role: 'admin' };
        console.log('Es admin');
        return res.redirect('/products'); 
    }

    const user = await userService.getUser(email)
    if(!user){
        return res.send('Email o Password invalidos')
    }

    //Si todas las verificaciones estan correctas ingresa como usuario
    req.session.user = { first_name: user.first_name, last_name: user.last_name, email, role: 'usuario' };
    console.log('Es usuario');
    res.redirect('/products');
});

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

//Ruta para registrarse
sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, confirmPassword } = req.body;

    try {
      // Verifica si la contraseña y su confirmación coinciden
      if (password !== confirmPassword) {
        return res.send('Las contraseñas no coinciden');
      }
  
      const newUser = {
        first_name,
        last_name,
        email,
        password
      }
      // Crea un nuevo usuario
      const result = await userService.createUser(newUser);
  
      res.redirect('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      res.send('Error al registrar usuario. Inténtalo de nuevo.');
    }
  });

  module.exports = sessionRouter;