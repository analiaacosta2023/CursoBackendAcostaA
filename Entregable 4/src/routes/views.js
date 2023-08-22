import express from "express";
import ProductManager from '../Managers/ProductManager.js'

const productManager = new ProductManager()

const router = express.Router();

router.get('/', async (req, res) => {

    const products = await productManager.getProducts();

    res.render('home', {style: "index.css", products})
})

router.get('/realtimeproducts', async (req, res) => {

    const products = await productManager.getProducts();

    res.render('realTimeProducts', {style: "index.css", products})
})

export default router;