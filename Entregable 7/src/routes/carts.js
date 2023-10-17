import { Router } from 'express';
import { addCart, addProduct, cleanCart, deleteProduct, getCart, updateCart, updateQuantity } from '../controllers/carts.js';

const router = Router();

router.post('/', addCart)

router.get('/:cid', getCart)

router.post('/:cid/product/:pid', addProduct)

router.delete('/:cid/product/:pid', deleteProduct)

router.put('/:cid', updateCart)

router.put('/:cid/product/:pid', updateQuantity)

router.delete('/:cid', cleanCart)


export default router;

