import { Router } from 'express';
import authenticateToken from '../middleware/authenticationToken.js';
import comprasController from '../controllers/comprasController.js';


const router = Router();


//Ruta para obtener el listado de las compras
router.get('/compras',comprasController.getCompras);



//Ruta para obtener las compras de un usuario
router.get('/compras/:id',comprasController.getComprasByUsuarioId);

//Ruta para obtener las compras de un usuario por su nombre
router.get('/compras/SearchUserCompras/',comprasController.getComprasByUsuario)



//Ruta para comprar un producto
router.post('/compras',comprasController.compraProduct);


//Ruta para eliminar una compra
router.delete('/compras/:id',comprasController.deleteCompra)


export default router

