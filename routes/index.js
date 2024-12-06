import express from 'express';
import userRoutes from './userRoutes.js';
import productsRoutes from './productsRoutes.js';
import comprasRoutes from './comprasRoutes.js';
import exportRoutes from './exportRoutes.js';
import authRoutes from './authRoutes.js';  // Rutas de autenticación
import paymentRoutes from  './paymentRoutes.js'; // Rutas de pago
import rolesPermisosRoutes from './rolesPermisosRoutes.js'
import notificationsRoutes from  './notificationsRoutes.js'
import notificationsUserRoutes from  './notificationUserRoutes.js'
import importRoutes from './importRoutes.js'
import webhooksRoutes from './webhooksRoutes.js'
import apiKeyRoutes from './apiKeyRoutes.js'
import notFoundAndErrorHandler from '../middleware/routeNotFound.js'
import cookieParser from 'cookie-parser';
import csrf from '../middleware/csrfToken.js'


const router = express.Router();

router.use(cookieParser())

router.get('/csrftoken',csrf.setCsrfToken)

// Rutas de autenticación
router.use('/v1/auth',authRoutes);

// Rutas de usuarios
router.use('/v1/users', userRoutes);

// Rutas de productos
router.use('/v1/products', productsRoutes);

// Rutas de compras
router.use('/v1/compras', csrf.csrfMiddleware,comprasRoutes);

// Rutas para exportar documentos
router.use('/v1/export', exportRoutes);

//Rutas para manejar los pagos
router.use('/v1/payment', paymentRoutes);


//Rutas para manejar los permisos y roles
router.use('/v1/rolesPermisos',rolesPermisosRoutes)

//Rutas para manejar las notificaciones
router.use('/v1/notifications',notificationsRoutes)

//Rutas para manejar las notificaciones de usuarios
router.use('/v1/userNotifications',notificationsUserRoutes)

router.use('/v1/import',importRoutes)

router.use('/v1/webhook',webhooksRoutes)

router.use('/v1/apiKey',apiKeyRoutes)



router.use(notFoundAndErrorHandler.routeNotFound)

router.use(notFoundAndErrorHandler.serverError)

export default router;
