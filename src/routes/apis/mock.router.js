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

module.exports = mockRouter