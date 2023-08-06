import fs from 'fs'

class ProductManager {

    constructor() {
        this.path = 'Productos.json';
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const productos = JSON.parse(data);
            return productos;
        } else {
            return [];
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        if (title && description && price && thumbnail && code && stock) {

            const productos = await this.getProducts();

            if (productos.some(product => product.code === code)) {
                throw new Error(`Ya existe un producto con el código # ${code}`)
            }

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            if (productos.length === 0) {
                product.id = 1;
            } else {
                product.id = productos[productos.length - 1].id + 1;
            }

            productos.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(productos))

            return product

        } else {
            throw new Error('Todos los campos son obligatorios')
        }

    }

    getProductById = async (idProducto) => {

        const productos = await this.getProducts();

        const productIndex = productos.findIndex(product => product.id === idProducto);

        if (productIndex >= 0) {
            return productos[productIndex];
        } else {
            throw new Error(`Producto con id ${idProducto} no existe`);
        }
    }

    updateProduct = async (idProducto, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) => {
        const productos = await this.getProducts();

        const productIndex = productos.findIndex(product => product.id === idProducto);

        if (productIndex >= 0) {
            if (productos[productIndex].code != newCode && (productos.some(product => product.code === newCode))) {
                throw new Error(`Ya existe un producto con el código # ${newCode}`)
            }
            productos[productIndex].title = newTitle
            productos[productIndex].description = newDescription
            productos[productIndex].price = newPrice
            productos[productIndex].thumbnail = newThumbnail
            productos[productIndex].code = newCode
            productos[productIndex].stock = newStock
            await fs.promises.writeFile(this.path, JSON.stringify(productos))
            return productos[productIndex];
        }
    }

    deleteProduct = async (idProducto) => {
        let productos = await this.getProducts();
        const productIndex = productos.findIndex(product => product.id === idProducto);
        if (productIndex >= 0) {
            productos = productos.filter(product => product.id != idProducto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos))
            return console.log('producto eliminado con exito')
        }
    }

}

export default ProductManager;






