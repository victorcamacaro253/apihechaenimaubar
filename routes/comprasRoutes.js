import { Router } from 'express'
import comprasController from '../controllers/comprasController.js'
import authenticateToken from '../middleware/authenticationToken.js'


const router = Router()


router.get('/compra',comprasController.getCompras);

router.get('/compra/:id',comprasController.getCompraById)

router.post('/compra',comprasController.compraProduct);


router.delete('/compra/:id',comprasController.deleteCompra);


export default router;