const winston = require('winston')
const configObject = require('../config/index')
const { mode } = require('../config/index')

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}

const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,

    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning',
            format: winston.format.simple()
        })
    ]
});

const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,

    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
});

const logger = mode === 'production' ? productionLogger : developmentLogger;


const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`); 
    req.logger.info(`${mode}`)
    next();
};

module.exports = { addLogger, logger };
