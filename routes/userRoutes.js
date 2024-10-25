import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';
import upload from '../middleware/multerConfig.js';
import checkPermissions from '../middleware/checkPermission.js';

const router = Router();

//Ruta para obtener los datos de la base de datos

//Ruta para obtener todos los usuarios de la base de datos
router.get('/',userController.getAllUser);


//Ruta para obtener los usuarios filtrados
router.get('/searchUser',userController.searchUsers);

//Ruta para obtener el perfi de los usuarios
router.get('/getperfil',authenticateToken,checkPermissions('read') ,userController.getPerfil)



//Ruta para obtener el historial de ingresos del usuario por el nombre
router.get('/loginHistorial',userController.getLoginHistory)



//Ruta para obtener el perfil del usuario
router.get('/getUserPerfil/:id',authenticateToken ,userController.getUserPerfil)


//Ruta para obtener los usarios con paginacion
router.get('/pagination',userController.getUsersWithPagination)


//Ruta para agregar un nuevo usuario

router.post('/',authenticateToken,userController.addUser);

//Ruta para logearse

router.post('/login', userController.loginUser);


//Ruta para obetenr un usuario por id

router.get('/:id',userController.getUserById);


//Ruta para insertar multiples usuarios
router.post('/addMultipleUsers',userController.addMultipleUsers)

//Ruta para eliminar multiple usuarios
router.post('/deleteMultipleUsers',userController.deleteMultipleUsers)

//Ruta para solicitar el password reset
router.post('/requestPasswordRequest',userController.requestPasswordReset)

//Ruta para resetear el password
router.post('/resetPassword/:token',userController.resetPassword)

//Ruta para actualizar un usuario

router.put('/:id', userController.updateUser);

//Ruta para eliminar un producto

router.delete('/:id', userController.deleteUser);

//Ruta para actualizar un producto parcial

router.patch('/:id', userController.partialUpdateUser)


export default router;