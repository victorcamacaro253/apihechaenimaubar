import notificationService from '../services/notificationService.js';

// Ruta para crear una notificación
const createNotification = async (req, res) => {
    const { message, type } = req.body;

    try {
        const notificationId = await notificationService.createAndNotify(message, type);
        res.status(201).json({ notificationId });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creando notificación' });
    }
};
/*
// Ruta para actualizar una notificación
const updateNotification = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const affectedRows = await notificationService.updateNotificationAndNotify(id, updateFields);
        res.status(200).json({ affectedRows });
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando notificación' });
    }
};*/

// Ruta para obtener notificaciones para un usuario
const getNotifications = async (req, res) => {
    

    try {
        const notifications = await notificationService.getNotifications();
        res.status(200).json( notifications );
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo notificaciones' });
        console.error(error)
    }
};


export default { getNotifications,createNotification };
