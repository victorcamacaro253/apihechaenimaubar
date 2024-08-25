const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticationToken');
const productController = require('../controllers/productController');


//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

router.get('/users/searchUser',userController.searchUsers);
router.get('/users/getperfil',authenticateToken,userController.getPerfil)

router.get('/users/getProducts',productController.getProducts)
router.get('/users/getProducts/:id',productController.getProductsById)


//Ruta para agregar un nuevo usuario

router.post('/users',authenticateToken,userController.addUser);

router.post('/users/login', userController.loginUser);

router.get('/users/:id',userController.getUserById);

router.post('/users/addProduct',productController.addProduct);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

router.patch('/users/:id', userController.partialUpdateUser)



module.exports = router;