const { Router } = require('express');
const { generateMockProducts } = require('../../utils/generateProducts')
const testRouter = Router();

testRouter.get('/mockingproducts', (req, res) =>{
    let products = []

    for(let i = 0; i < 100; i++){
        products.push(generateMockProducts())
    }
    res.json({Productos: products});
})

testRouter.get('/compress', (req, res)=>{
    let string = 'string ridiculamente largo'
    for(let i=0; i<5e3;i++){
        string += 'string ridiculamente largo'
    }
    res.send(string)
})

testRouter.get('/loggerTest', (req, res) => {
    // Ejemplo de uso del logger
    req.logger.info('Ruta /loggerTest accedida');
    res.send('Logger test endpoint');
});

module.exports = testRouter