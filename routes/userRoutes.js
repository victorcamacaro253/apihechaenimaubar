import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticationToken.js';
import comprasController from '../controllers/comprasController.js';

//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

router.get('/users/searchUser',userController.searchUsers);
router.get('/users/getperfil',authenticateToken ,userController.getPerfil)

router.get('/users/export/name',userController.exportUsersDataByName)

router.get('/users/loginHistorial',userController.getLoginHistory)

router.get('/users/export/:id', userController.exportUserData);

router.get('/users/export', userController.exportUsersData);

 
router.get('/users/exportPDF',userController.exportUserDataPdf)

router.get('/users/exportPDF/:id',userController.exportUserDataById)

router.get('/users/getUserPerfil/:id',userController.getUserPerfil)

router.get('/users/pagination',userController.getUsersWithPagination)

//Ruta para agregar un nuevo usuario

router.post('/users',userController.addUser);

router.post('/users/login', userController.loginUser);

router.get('/users/:id',userController.getUserById);


router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);


router.patch('/users/:id', userController.partialUpdateUser)


router.post('/users/addMultipleUsers',userController.addMultipleUsers)


router.post('/users/deleteMultipleUsers',userController.deleteMultipleUsers)


export default router;