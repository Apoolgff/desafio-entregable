const CartDaoMongo = require('../daos/mongo/cartManagerMongo')
const ProductDaoMongo = require('../daos/mongo/productManagerMongo')

const productService = new ProductDaoMongo()

class CartController{
    constructor(){
        this.cartService = new CartDaoMongo()
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.json({ cart: newCart });//res.send({status: 'success', payload: newCart})
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }

    getCart = async (req, res) => {
        try {
            //const cartId = req.params.cid;(anterior)
            const { cid } = req.params
            const cart = await this.cartService.getCart({ _id: cid });
            res.json({ cart });//res.send({status: 'success', payload: cart})
        } catch (error) {
            console.error(error.message);
            res.status(404).send('Cart Not Found');
        }
    }

    addProductToCart = async (req, res) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const quantity = req.body.quantity || 1;
      
          const cart = await this.cartService.getCart(cartId);
          if (!cart) {
            throw new Error('El carrito no fue encontrado.');
          }
      
          const product = await productService.getProductById(productId)
          if (!product) {
            throw new Error('El producto no fue encontrado.');
          }
      
          // Llama a addProductToCart sin esperar el resultado
          this.cartService.addProductToCart(cartId, productId, quantity);
      
          // Retorna el carrito actualizado después de la operación
          const updatedCart = await this.cartService.getCart(cartId);
          res.json({ cart: updatedCart });
        } catch (error) {
          console.error(error.message);
          res.status(400).send('Bad Request');
        }
      }
      

    removeProductFromCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await this.cartService.removeProductFromCart(cartId, productId);

            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const products = req.body.products || [];
            const updatedCart = await this.cartService.updateCart(cartId, products);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
            const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, quantity);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }

    removeAllProducts = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const updatedCart = await this.cartService.removeAllProducts(cartId);
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error(error.message);
            res.status(400).send('Bad Request');
        }
    }
}

module.exports = CartController