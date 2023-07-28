class ProductManager {


    constructor() {
        this.products = [];
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {

        if (title && description && price && thumbnail && code && stock) {

            if (this.products.some(product => product.code === code)) {
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

            // id autoincrementable

            if (this.products.length === 0) {
                product.id = 1;
            } else {
                product.id = this.products[this.products.length - 1].id + 1;
            }

            // Mostrar por consola el producto creado
            console.log(product);
            // Agregar el producto al arreglo
            this.products.push(product);

        } else {
            console.error('Error: Todos los campos son obligatorios')
        }

    }

    getProducts = () => {
        return this.products;
    }

    getProductById = (idProducto) => {
        const productIndex = this.products.findIndex(product => product.id === idProducto);
        if (productIndex === -1) {
            console.error('Error: Producto no encontrado');
            return;
        }

        const productoElegido = this.products[productIndex];

        console.log(productoElegido)
    }
}

const arregloProductos = new ProductManager()
arregloProductos.addProduct('zapato', 'blabla', 99, 'img/p1', 123, 5);
// prueba si funciona no repetir codigos
arregloProductos.addProduct('zapato2', 'blabla2', 99, 'img/p1', 123, 5);
// prueba si estan todos los campos completos
arregloProductos.addProduct('zapato2', 'blabla2', 99, 'img/p1', 124);
// Prueba getProducts 
console.log('Arreglo completo', arregloProductos.getProducts());
// Prueba getProductById
console.log('product by id')
arregloProductos.getProductById(1)

