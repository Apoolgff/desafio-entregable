const { Router } = require('express')
const router = Router()
const productsRouter = require('./apis/products.router')
const cartsRouter = require ('./apis/cart.router')
const sessionRouter = require ('./apis/session.router')
const viewsRouter = require ('./views.router')
const mockRouter = require('./apis/mock.router')
const compression = require('express-compression')

router.use(compression({
    brotli:{
        enabled: true,
        zlib: {}
    }
}))

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/session', sessionRouter)
router.use('/', viewsRouter);

router.use('/test', mockRouter)

//ERROR QUE ME OBLIGA A USAR LA RUTA EXACTA, NO LO NECESITO POR AHORA PORQUE AL IR A LA RUTA 'http://localhost:8080/' ME DA ERROR
//SI NO LA UTILIZO ME LLEVA AL LOGIN AL COLOCAR DICHA RUTA QUE ES LO QUE QUIERO.
/*router.use('*', (req, res)=>{
    res.status(404).send('Not Found')
})*/ 

router.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).send('Error Server')
})

router.get('/', (req, res) => {
    res.redirect('/login');
  });

module.exports = router