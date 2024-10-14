import { Router } from 'express'
import comprasController from '../controllers/comprasController.js'
import authenticateToken from '../middleware/authenticationToken.js'
import userController from '../controllers/userController.js';


const router = Router()


router.get('/compras',comprasController.getCompras);

router.get('/compras/fecha', comprasController.getComprasByDate);

router.get('/compras/:id/userFecha',comprasController.getComprasByUserDate)


router.get('/compras/user/name',comprasController.getComprasByusername)


router.get('/compras/user/:userId', comprasController.getComprasByUserId);



router.get('/compras/:id',comprasController.getCompraById)



router.post('/compras',comprasController.compraProduct);


router.delete('/compras/:id',comprasController.deleteCompra);


export default router;