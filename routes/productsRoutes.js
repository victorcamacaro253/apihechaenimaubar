import { Router } from 'express';
import productController from '../controllers/productController.js';
import upload from '../middleware/multerConfig.js';

const router = Router();

//Ruta para obtener los productos filtrado por nombre
router.get('/getProductByName',productController.getProductByName)

//Ruta para obtener todos los productos
router.get('/',productController.getProducts)

//Ruta para obtener los porductos por categoria
router.get('/categoria/',productController.getProductsByCategoria)

//Ruta para obtener los productos por un rango de precio
router.get('/price',productController.getProductsByPrinceRange)

//Ruta para obtener los productos mas vendidos

router.get('/topSelling',productController.getTopSelling)

router.get('/availability',productController.getAvailableProducts)


//Ruta para obtener los productos por id
router.get('/:id',productController.getProductsById)

//Ruta para ingresar multiples productos
router.post('/addMultipleProducts',upload.array('image'),productController.addMultipleProducts)


//Ruta para añadir un producto

router.post('/',upload.single('image'),productController.addProduct);


//Ruta para actualizar un producto

router.put('/:id',productController.updateProduct)

//Ruta para eliminar multiples productos
router.post('/deleteMultipleProducts',productController.deleteMultipleProducts)


//Ruta para eliminar el producto

router.delete('/:id',productController.deleteProduct)




export default router;