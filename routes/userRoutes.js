const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Ruta para obtener los datos de la base de datos

router.get('/users',userController.getAllUser);

//Ruta para agregar un nuevo usuario

router.post('/users',userController.addUser);

router.get('/users/:id',userController.getUserById);

router.put('/users/:id', userController.updateUser);

module.exports = router;