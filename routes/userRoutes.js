import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';
import { getProducts, getProductsById, addProduct } from '../controllers/productController.js';


//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

router.get('/users/searchUser',userController.searchUsers);
router.get('/users/getperfil',authenticateToken,userController.getPerfil)

router.get('/users/getProducts',getProducts)
router.get('/users/getProducts/:id',getProductsById)


//Ruta para agregar un nuevo usuario

router.post('/users',authenticateToken,userController.addUser);

router.post('/users/login', userController.loginUser);

router.get('/users/:id',userController.getUserById);

router.post('/users/addProduct',addProduct);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

router.patch('/users/:id', userController.partialUpdateUser)



export default router;