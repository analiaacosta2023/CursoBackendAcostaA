import ProductManager from './Managers/ProductManager.js'
import express from "express"

const productManager = new ProductManager()

const app = express();
const port = 8080;


app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

app.get('/products', async (req, res) => {

    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (!limit) {
        res.send(products);
        return;
    }

    let productsWithLimit = products.slice(0, limit);
    res.send(productsWithLimit);
})

app.get('/products/:pid', async (req, res) => {

    const pid = parseInt(req.params.pid);

    try {
        const product = await productManager.getProductById(pid);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: error.message })
    }


})

app.listen(port, () => {
    console.log(`Servidor funcionando en puerto`, port)
})

