import { Router } from 'express'
import productController from "../controllers/productController.js"
import authenticateToken from "../middleware/authenticationToken.js"
import upload from '../middleware/multerConfig.js'

const router = Router()




router.get('/Products',productController.getProducts)

router.get('/Products/categoria/',productController.getProductsByCategoria)

router.get('/Products/price',productController.getProductsByPrinceRange)

router.post('/Products/addMultipleProducts',upload.single('image'),productController.addMultipleProducts)


router.get('/Products/:id',productController.getProductsById)


router.post('/Products',upload.single('image'),productController.addProduct);


router.delete('/Products/:id',productController.deleteProduct)


export default router ;