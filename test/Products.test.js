const mongoose = require('mongoose')
const Product = require('../src/daos/mongo/productManagerMongo')
const Assert = require('assert')
const { configObject } = require('../src/config')

mongoose.connect(configObject.mongo_uri)

const assert = Assert.strict

describe('Testing Products Dao', () => {
    before(function () {
        this.productsDao = new Product()
    })
    beforeEach(function () {
        this.timeout(5000)
    })
    it('El dao debe poder obtener un array de productos', async function () {
        const res = await this.productsDao.get()
        assert.strictEqual(Array.isArray(res), true)
    })
    it('El dao debe agregar un producto a la base de datos', async function () {
        let productMock = {
            title: "Laptop 3",
            description: "Laptop Eficiente",
            code: "lapt12345",
            price: 199.99,
            status: true,
            stock: 25,
            category: "Computacion",
            owner: "pedro@gmail.com",
            thumbnails: ['/images/1711087053174-laptop2.webp']
        }
        const res = await this.productsDao.create(productMock)
        assert.ok(res._id)
    })
})