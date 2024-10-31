import usersRoutes from './userRoutes.js'
import productRoutes from  './productosRoutes.js'
import comprasRoutes from  './comprasRoutes.js'
import notificationRoutes  from  './notificationsRoutes.js'
import notificationUserRoutes   from  './notificationUserRoutes.js'
import exportRoutes  from  './exportRoutes.js'
import { Router } from 'express'
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import rolesPermisosRoutes from  './rolesPermisosRoutes.js'

const csrfProtection = csrf({cookie:true})





const router= Router();


router.use(cookieParser());

router.use('/users',usersRoutes)


router.use('/products',productRoutes)

router.use('/compras',csrfProtection,comprasRoutes);


router.use('notifications',notificationRoutes)

router.use('userNotification',notificationUserRoutes)

router.use('export',exportRoutes)
 
router.use('rolesPermisos',rolesPermisosRoutes)

export default router