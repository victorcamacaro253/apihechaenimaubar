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



// Obtener notificaciones para un usuario
const getNotifications = async () => {
    notifyClients("se han cargado los datos ");
    return notificacionModel.getNotifications();
}


const getUserNotification= async (username)=>{
    notifyClients("se han obtenido laa notificaciones de usuario")
    const  notification=await notificacionModel.getUserNotification(username);
    return  notification;


}


export default {notifyClients,createAndNotify,getNotifications,getUserNotification}