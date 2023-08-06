const fs = require('fs');

class ProductManager {

    constructor() {
        this.path = 'Productos.json';
    }

    getProducts = () => {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            const productos = JSON.parse(data);
            return productos;
        } else {
            return [];
        }
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {

        if (title && description && price && thumbnail && code && stock) {

            const productos = this.getProducts();

            if (productos.some(product => product.code === code)) {
                console.error(`Error: Ya existe un producto con el código # ${code}`)
                return
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

            fs.writeFileSync(this.path, JSON.stringify(productos))

            return product

        } else {
            console.error('Error: Todos los campos son obligatorios')
        }

    }

    findProductById = (idProducto) => {

        const productos = this.getProducts();

        const productIndex = productos.findIndex(product => product.id === idProducto);
        if (productIndex === -1) {
            return console.error('Error: Producto no encontrado');;
        } else {
            return productIndex
        }
    }

    getProductById = (idProducto) => {

        const productos = this.getProducts();

        const productIndex = this.findProductById(idProducto)
        if (productIndex >= 0) {
            console.log(productIndex)
            return productos[productIndex];
        }
    }

    updateProduct = (idProducto, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) => {
        const productos = this.getProducts();
        const productIndex = this.findProductById(idProducto)
        if (productIndex>= 0) {
            if (productos[productIndex].code != newCode && (productos.some(product => product.code === newCode))) {
                console.error(`Error: Ya existe un producto con el código # ${newCode}`)
                return
            }
            productos[productIndex].title = newTitle
            productos[productIndex].description = newDescription
            productos[productIndex].price = newPrice
            productos[productIndex].thumbnail = newThumbnail
            productos[productIndex].code = newCode
            productos[productIndex].stock = newStock
            fs.writeFileSync(this.path, JSON.stringify(productos))
            return productos[productIndex];
        }
    }

    deleteProduct = (idProducto) => {
        let productos = this.getProducts();
        const productIndex = this.findProductById(idProducto)
        if (productIndex>= 0) {
            productos = productos.filter(product => product.id != idProducto);
            fs.writeFileSync(this.path, JSON.stringify(productos))
            return console.log('producto eliminado con exito')
        }
    }

}

const arregloProductos = new ProductManager()

// Prueba add products

/* arregloProductos.addProduct('zapato', 'blabla', 99, 'img/p1', 123, 5);
arregloProductos.addProduct('zapato2', 'blabla2', 99, 'img/p1', 125, 5);
arregloProductos.addProduct('zapato2', 'blabla2', 99, 'img/p1', 124, 4);
 */

// Prueba get products

/* const pro = arregloProductos.getProducts()
console.log(pro) */

// Prueba get product by id

/* const producto1 = arregloProductos.getProductById(1)
console.log(producto1) */

// prueba edit

/* arregloProductos.updateProduct(3, 'zap', 'bla', 87, 'img/p7', 128, 10) */

// prueba delete

/* arregloProductos.deleteProduct(2); */






