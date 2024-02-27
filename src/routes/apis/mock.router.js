const { Router } = require('express');
const { generateMockProducts } = require('../../utils/generateProducts')
const mockRouter = Router();

mockRouter.get('/mockingproducts', (req, res) =>{
    let products = []

    for(let i = 0; i < 100; i++){
        products.push(generateMockProducts())
    }
    res.json({Productos: products});
})

mockRouter.get('/compress', (req, res)=>{
    let string = 'string ridiculamente largo'
    for(let i=0; i<5e3;i++){
        string += 'string ridiculamente largo'
    }
    res.send(string)
})

module.exports = mockRouter