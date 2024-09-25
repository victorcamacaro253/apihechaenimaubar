import { Router } from 'express';
import productController from '../controllers/productController.js';
import upload from '../middleware/multerConfig.js';

const router = Router();

//Ruta para obtener los productos filtrado por nombre
router.get('/products/searchProductByName',productController.searchProductByName)

//Ruta para obtener todos los productos
router.get('/products',productController.getProducts)

//Ruta para obtener los porductos por categoria
router.get('/products/categoria/',productController.getProductsByCategoria)

//Ruta para obtener los productos por un rango de precio
router.get('/products/price',productController.getProductsByPriceRange)


//Ruta para obtener los productos por id
router.get('/products/:id',productController.getProductsById)

//Ruta para ingresar multiples productos
router.post('/products/addMultipleProducts',upload.single('image'),productController.addMultipleProducts)


//Ruta para añadir un producto

router.post('/products',upload.single('image'),productController.addProduct);


//Ruta para actualizar un producto

router.put('/products/:id',productController.updateProduct)

//Ruta para eliminar multiples productos
router.post('/products/deleteMultipleProducts',productController.deleteMultipleProducts)



//Ruta para eliminar el producto

router.delete('/products/:id',productController.deleteProduct)




export default router;