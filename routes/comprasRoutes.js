import { Router } from 'express';
import authenticateToken from '../middleware/authenticationToken.js';
import comprasController from '../controllers/comprasController.js';


const router = Router();


//Ruta para obtener el listado de las compras
router.get('/',comprasController.getCompras);

//Ruta para obtener las compras de un usuario por su nombre
router.get('/SearchUserCompras/',comprasController.getComprasByusername)

//Rutas para obtener las comprar por fecha
router.get('/fecha', comprasController.getComprasByDate);

//Ruta para obtener estadisticas  de las compras en un rango de tiempo

router.get('/stats',comprasController.getEstadisticasCompras )


//Ruta para obtener las cantidad de compras por usuario
router.get('/comprasByUser',comprasController.getComprasCountByUsuario)

//Ruta para obtener las compras de un usuario
router.get('/:id',comprasController.getComprasByUserId);


//Ruta para comprar un producto
router.post('/',comprasController.compraProduct);



//Ruta para eliminar una compra
router.delete('/:id',comprasController.deleteCompra)


export default router

