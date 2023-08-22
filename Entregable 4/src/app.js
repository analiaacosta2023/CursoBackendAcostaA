import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js"
import cartsRouter from "./routes/carts.js"
import viewsRouter from "./routes/views.js"
import ProductManager from './Managers/ProductManager.js'

const productManager = new ProductManager()

const app = express();

const port = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter)

//http server
const server = app.listen(port, () => {
    console.log(`Servidor funcionando en puerto`, port)
})

// socket server
const io = new Server(server)

io.on('connection', socket => {
    console.log("Nuevo cliente conectado")
    socket.on('new-product', async data => {

        try {
            await productManager.addProduct(
                data.message.title,
                data.message.description,
                data.message.code,
                data.message.price,
                data.message.stock,
                data.message.category,
            );

            const products = await productManager.getProducts();

            io.emit('products', products);

        } catch (error) {
            io.emit('error', error);
        }
    })

    socket.on('delete-product', async data => {

        try {
            await productManager.deleteProduct(
                parseInt(data.message)
            );

            const products = await productManager.getProducts();

            io.emit('products', products);

        } catch (error) {
            io.emit('error', error);
        }
    })

})