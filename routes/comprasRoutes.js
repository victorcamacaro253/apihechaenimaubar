import { Router } from 'express'
import comprasController from '../controllers/comprasController.js'
import authenticateToken from '../middleware/authenticationToken.js'
import userController from '../controllers/userController.js';


const router = Router()

//Ruta para obtener  todas las compras

router.get('/',comprasController.getCompras);

//Ruta para obtener las compras dentro de un rango de fecha

router.get('/fecha', comprasController.getComprasByDate);

//Ruta para  obtener las compras de un usuario por un rango de fecha

router.get('/:id/userFecha',comprasController.getComprasByUserDate)

//Ruta para  obtener las compras por usuario

router.get('/user/name',comprasController.getComprasByusername)

//Ruta para obtener estadisticas  de las compras en un rango de tiempo

router.get('/stats',comprasController.getEstadisticasCompras )

//Ruta para obtener  las compras de Id de usuario 


router.get('/user/:userId', comprasController.getComprasByUserId);


 //Ruta para obtener una compra por id

router.get('/:id',comprasController.getCompraById)

//Ruta para agregar una compra 

router.post('/',comprasController.compraProduct);

//Ruta para eliminar  una compra

router.delete('/:id',comprasController.deleteCompra);


export default router;