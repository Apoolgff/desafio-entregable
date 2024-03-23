const { Router } = require('express')
const router = Router()
const productsRouter = require('./apis/products.router')
const cartsRouter = require ('./apis/cart.router')
const sessionRouter = require ('./apis/session.router')
const viewsRouter = require ('./views.router')
const testRouter = require('./apis/test.router')
const compression = require('express-compression')
//const { addLogger, logger } = require('../utils/logger');
const { handleError } = require('../middlewares/error/handleError');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const { swaggerOptions } = require('../config')


router.use(compression({
    brotli:{
        enabled: true,
        zlib: {}
    }
}))

const specs = swaggerJsDoc(swaggerOptions)

router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//router.use(addLogger);

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/user', sessionRouter)
router.use('/', viewsRouter);

router.use('/test', testRouter)


//ERROR QUE ME OBLIGA A USAR LA RUTA EXACTA, NO LO NECESITO POR AHORA PORQUE AL IR A LA RUTA 'http://localhost:8080/' ME DA ERROR
//SI NO LA UTILIZO ME LLEVA AL LOGIN AL COLOCAR DICHA RUTA QUE ES LO QUE QUIERO.
/*router.use('*', (req, res)=>{
    res.status(404).send('Not Found')
})*/ 
router.use(handleError)
router.use((err, req, res, next)=>{
    req.logger.error(err.message)
    res.status(500).send('Error Server')
})

router.get('/', (req, res) => {
    res.redirect('/login');
  });

module.exports = router