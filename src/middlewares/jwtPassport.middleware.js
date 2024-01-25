// jwtPassport.middleware.js
const passport = require('passport');  // Añade esta línea al inicio del archivo

exports.authorizationJwt = role => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role !== role) return res.status(401).send({ error: 'Not permissions' });
        next();
    };
};

exports.authenticationJwtCurrent = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'No auth token' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
