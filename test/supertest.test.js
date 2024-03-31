const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Testing Ecommerce', () => {
    describe('Test de Productos', () => {
        beforeEach(function () {
            this.timeout(5000)
        })
        it('Prueba del endpoint para crear producto GET /api/products. Debe obtener todos los productos correctamente', async function () {
            const res = await requester.get('/api/products/all');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
        it('Prueba del endpoint para obtener productos limitados GET /api/products/. Debe obtener productos limitados correctamente', async function () {
            const res = await requester.get('/api/products/');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
        it('Prueba del endpoint para crear producto POST /api/products. Debe crear un producto correctamente', async function () {

            let productMock = {
                title: "Laptop 3",
                description: "Laptop Eficiente",
                code: "lapt12345",
                price: 199.99,
                status: true,
                stock: 25,
                category: "Computacion",
                owner: "pedro@gmail.com",
            }

            const res = await requester
                .post('/api/products')
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('status', productMock.status)
                .field('stock', productMock.stock)
                .field('category', productMock.category)
                .field('owner', productMock.owner)
                .attach('thumbnails', 'src/public/images/1711087053174-laptop2.webp');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        })
    })
    describe('Test de carts', () => {
         it('Prueba del endpoint para crear un carrito POST /api/carts. Debe crear un carrito correctamente', async function () {
             const res = await requester.post('/api/carts');
             expect(res.status).to.equal(200);
             expect(res.body).to.be.an('object');
         });
 
         it('Prueba del endpoint para obtener un carrito GET /api/carts/:cid. Debe obtener un carrito correctamente', async function () {
 
             const res = await requester.get('/api/carts/65f124deaed549bfefd727dc');
             expect(res.status).to.equal(200);
             expect(res.body).to.be.an('object');
         });
 
 
         it('Prueba del endpoint para agregar un producto al carrito POST /api/carts/:cid/product/:pid. Debe agregar un producto al carrito correctamente', async function () {
             const res = await requester
                 .post('/api/carts/65f124deaed549bfefd727dc/product/65fd1dcd160af1b292008db8')
                 .send({ quantity: 1 });
             expect(res.status).to.equal(200);
             expect(res.body).to.be.an('object');
         });
    })
    describe('Test de Session', () => {
        it('Prueba del endpoint para registrar un nuevo usuario POST /api/user/register. Debe registrar un nuevo usuario correctamente', async function () {
            this.timeout(25000)
            const newUser = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                age: 30,
                role: 'user'
            };

            const res = await requester
                .post('/api/user/register')
                .send(newUser);

            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('logged in');
            expect(res.body.redirectUrl).to.equal('/login');

            
            expect(res.header['set-cookie']).to.be.an('array').that.is.not.empty;
            expect(res.header['set-cookie'][0]).to.include('token=');
        });
        it('Prueba del endpoint para obtener un usuario GET /api/user/:uid. Debe obtener un usuario correctamente', async function () {
            const userId = '65f124dfaed549bfefd727de';

            const res = await requester
                .get(`/api/user/${userId}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });

        it('Prueba del endpoint para iniciar sesión POST /api/session/login. Debe iniciar sesión correctamente', async function () {
            const res = await requester
                .post('/api/user/login')
                .send({ email: 'johndoe@example.com', password: 'password123' });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
        });
    })
})