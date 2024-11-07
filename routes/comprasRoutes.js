import { Router } from 'express';
import authenticateToken from '../middleware/authenticationToken.js';
import comprasController from '../controllers/comprasController.js';


const router = Router();


//Ruta para obtener el listado de las compras
router.get('/compras',comprasController.getCompras);

//Ruta para obtener las compras de un usuario por su nombre
router.get('/compras/SearchUserCompras/',comprasController.getComprasByUsuario)

router.get('/compra/fecha', comprasController.getComprasByDate);

//Ruta para obtener estadisticas  de las compras en un rango de tiempo

router.get('/stats',comprasController.getEstadisticasCompras )

router.get('/compras/comprasByUser',comprasController.getComprasCountByUsuario)

//Ruta para obtener las compras de un usuario
router.get('/compras/:id',comprasController.getComprasByUsuarioId);


//Ruta para comprar un producto
router.post('/compras',comprasController.compraProduct);


//Ruta para eliminar una compra
router.delete('/compras/:id',comprasController.deleteCompra)


export default router

