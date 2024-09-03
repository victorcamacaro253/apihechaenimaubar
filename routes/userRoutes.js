import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';
import productController from '../controllers/productController.js';


//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

router.get('/users/searchUser',userController.searchUsers);
router.get('/users/getperfil',authenticateToken ,userController.getPerfil)


router.get('/products',productController.getProducts)
router.get('/products/:id',productController.getProductsById)
router.get('/users/getUserPerfil/:id',authenticateToken ,userController.getUserPerfil)

//Ruta para agregar un nuevo usuario

router.post('/users',authenticateToken,userController.addUser);

router.post('/users/login', userController.loginUser);

router.get('/users/:id',userController.getUserById);

router.post('/products',productController.addProduct);

router.put('/users/:id', userController.updateUser);

router.put('/products/:id',productController.updateProduct)

router.delete('/users/:id', userController.deleteUser);

router.patch('/users/:id', userController.partialUpdateUser)

router.delete('/products/:id',productController.deleteProduct)


export default router;