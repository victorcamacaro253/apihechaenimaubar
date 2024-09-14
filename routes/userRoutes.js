import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';


const router = Router();

//Ruta para obtener los datos de la base de datos

//Ruta para obtener todos los usuarios de la base de datos
router.get('/users',userController.getAllUser);


//Ruta para obtener los usuarios filtrados
router.get('/users/searchUser',userController.searchUsers);

//Ruta para obtener el perfi de los usuarios
router.get('/users/getperfil',authenticateToken ,userController.getPerfil)

//Ruta para exportar los datos de un usuario
router.get('/users/export/name',userController.exportUsersDataByName)

//Ruta para obtener el historial de ingresos del usuario por el nombre
router.get('/users/loginHistorial',userController.getLoginHistory)

//Ruta para exportar los datos de los usuarios 
router.get('/users/export', userController.exportUsersData);


//Ruta para obtener el perfil del usuario
router.get('/users/getUserPerfil/:id',authenticateToken ,userController.getUserPerfil)


//Ruta para obtener los usarios con paginacion
router.get('/users/pagination',userController.getUsersWithPagination)


//Ruta para agregar un nuevo usuario

router.post('/users',authenticateToken,userController.addUser);

//Ruta para logearse

router.post('/users/login', userController.loginUser);


//Ruta para obetenr un usuario por id

router.get('/users/:id',userController.getUserById);




//Ruta para actualizar un usuario

router.put('/users/:id', userController.updateUser);

//Ruta para eliminar un producto

router.delete('/users/:id', userController.deleteUser);

//Ruta para actualizar un producto parcial

router.patch('/users/:id', userController.partialUpdateUser)


export default router;