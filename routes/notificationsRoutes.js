import { Router } from 'express'
import notificationsController from '../controllers/notificationsController.js';

const router = Router();

//Ruta para obtener notificaciones

router.get('/notifications',notificationsController.getNotifications);

//Ruta para crear una notificacion

router.post('/notifications',notificationsController.createNotification); 

//Ruta para actualizar una notificacion

router.put('/notifications/:id',notificationsController.updateNotification);

//Router para eliminar una notiificacion
router.delete('/notifications/:id',notificationsController.deleteNotification);


export default router;
