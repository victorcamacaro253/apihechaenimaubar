// services/notificationService.js
import { getIo } from './websocketServer.js';
import notificacionModel from '../models/notificationsModel.js';

// Función para notificar a los clientes
 const notifyClients = (notification) => {
    const io = getIo();
    if (io) {
        console.log('Emitiendo notificación:', notification); 
        io.emit('notification', notification);
    } else {
        console.error('WebSocket no está inicializado');
    }
};

// Función para crear una notificación y notificar a los clientes
 const createAndNotify = async (message,type) => {
    const notificationId = await notificacionModel.saveNotification(message,type);
    notifyClients(message);
    return notificationId;
};



// Obtener notificaciones 
const getNotifications = async () => {
    notifyClients("se han cargado los datos ");
    return notificacionModel.getNotifications();
}



const deleteNotification= async(id) => {
const notification = await notificacionModel.deleteNotification(id);
notifyClients('Se ha eliminado',notification);

return notification;
}


// Función para actualizar una notificación y notificar a los clientes
const updateNotificationAndNotify = async (notification_id, updateFields) => {
    const affectedRows = await notificacionModel.updateNotification(notification_id, updateFields);
    if (affectedRows > 0) {
        const notification = await  notificacionModel.getNotificationById(notification_id);
      console.log(notification)
        notifyClients('Actualizado')
    }
    return affectedRows;
};

const createAndNotifyUser= async (id_notificacion,id_usuario)=>{
    
    const result = await notificacionModel.createAndNotifyUser(id_notificacion,id_usuario);
    notifyClients('Notificacion creada');

    return result;

}


const getUserNotification = async (username)=>{

    const result= await notificacionModel.getUserNotification(username);

    
        notifyClients('obtenido la notificaciones',result)
    
    return result;
}




// Función para actualizar una notificación y notificar a los clientes
const updateUserNotificationAndNotify = async (notification_id, updateFields) => {
    const affectedRows = await notificacionModel.updateUserNotification(notification_id, updateFields);
  
   notifyClients('Actualizado')
    return affectedRows;
};


const deleteUserNotification = async (id)=>{
    const result = await notificacionModel.deleteUserNotification(id);
    notifyClients('Eliminado');
    return result
}


export default {notifyClients,createAndNotify,getNotifications,updateNotificationAndNotify,deleteNotification,getUserNotification,createAndNotifyUser, updateUserNotificationAndNotify,deleteUserNotification}