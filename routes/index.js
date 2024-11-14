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
import webhooksRoutes from './webhooksRoutes.js'




const router = express.Router();

// Rutas de autenticación
router.use(authRoutes);

// Rutas de usuarios
router.use('/users', userRoutes);

// Rutas de productos
router.use('/products', productsRoutes);

// Rutas de compras
router.use('/compras', comprasRoutes);

// Rutas para exportar documentos
router.use('/export', exportRoutes);

//Rutas para manejar los pagos
router.use('/payment', paymentRoutes);


//Rutas para manejar los permisos y roles
router.use('/rolesPermisos',rolesPermisosRoutes)

//Rutas para manejar las notificaciones
router.use('/notifications',notificationsRoutes)

//Rutas para manejar las notificaciones de usuarios
router.use('/userNotifications',notificationsUserRoutes)

router.use('/webhook',webhooksRoutes)



export default router;
