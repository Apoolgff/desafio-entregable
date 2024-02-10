const jwt = require('jsonwebtoken');
const { configObject } = require('../config/index')

exports.handlePolicies = policies => (req, res, next) => {
    // Verificar si la ruta es pública
    if (policies[0] === 'PUBLIC') {
        return next();
    }

    // Verificar si hay un token de JWT en las cookies
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized' });
    }

    // Verificar el token JWT y extraer la información del usuario
    let user;
    try {
        user = jwt.verify(token, configObject.jwt_secret_key); // Reemplaza 'YourJWTSecretKey' con tu clave secreta JWT
    } catch (error) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized' });
    }

    // Verificar si el usuario es un administrador o un usuario normal
    if (policies.includes('ADMIN') && user.role.toUpperCase() === 'ADMIN') {
        // Si la ruta es solo para administradores y el usuario es un administrador, permitir acceso
        req.user = user;
        return next();
    } else if (policies.includes('USER') && user.role.toUpperCase() === 'USER') {
        // Si la ruta es solo para usuarios normales y el usuario es un usuario normal, permitir acceso
        req.user = user;
        return next();
    } else {
        // Si el usuario no tiene los permisos necesarios, devolver un error de "No permissions"
        return res.status(403).send({ status: 'error', error: 'No permissions' });
    }
};


