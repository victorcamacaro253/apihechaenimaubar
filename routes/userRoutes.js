const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {check,validationResult} = require('express-validator');


//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

//Ruta para agregar un nuevo usuario

router.post('/users',userController.addUser);

router.get('/users/:id',userController.getUserById);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

module.exports = router;