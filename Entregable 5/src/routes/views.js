import { Router, query } from 'express';
import ProductManager from '../dao/db-managers/productManager.js'
import CartManager from '../dao/db-managers/cartManager.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/', async (req, res) => {

    const { docs } = await productManager.getAll({});

    res.render('home', { style: "index.css", docs })
})

router.get('/realtimeproducts', async (req, res) => {

    res.render('realTimeProducts', { style: "index.css" })
})

router.get('/chat', privateAccess, async (req, res) => {

    res.render('chat', { style: "index.css", user: req.session.user })
})

router.get('/products', privateAccess, async (req, res) => {

    const query = req.query

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page } = await productManager.getAll(query);

    res.render('products', { style: "index.css", user: req.session.user, docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages, page })
})

router.get('/carts/:cid', privateAccess, async (req, res) => {

    try {
        const cid = req.params.cid

        const cart = await cartManager.getCartById(cid)

        res.render('cart', { cart })

    } catch (error) {
        res.status(404).send(`Cart not found: ${error.message}`);
    }

})

router.get('/login', publicAccess, (req, res)=> {
    res.render('login', {style: "index.css"})
})

router.get('/register', publicAccess, (req, res)=> {
    res.render('register', {style: "index.css"})
})

export default router;