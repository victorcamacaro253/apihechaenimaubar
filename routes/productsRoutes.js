import { Router } from 'express';
import productController from '../controllers/productController.js';


const router = Router();

//Ruta para obtener todos los productos
router.get('/products',productController.getProducts)


//Ruta para obtener los productos por id
router.get('/products/:id',productController.getProductsById)

//Ruta para obtener los productos filtrado por nombre
router.get('/products/searchProductByName',productController.searchProductByName)

//Ruta para añadir un producto

router.post('/products',productController.addProduct);


//Ruta para actualizar un producto

router.put('/products/:id',productController.updateProduct)


//Ruta para eliminar el producto

router.delete('/products/:id',productController.deleteProduct)



export default router;