import { Router } from 'express'
import productController from "../controllers/productController.js"
import authenticateToken from "../middleware/authenticationToken.js"

const router = Router()




router.get('/Products',productController.getProducts)


router.get('/Products/:id',productController.getProductsById)

router.post('/Products',productController.addProduct);

router.delete('/products/:id',productController.deleteProduct)


export default router ;