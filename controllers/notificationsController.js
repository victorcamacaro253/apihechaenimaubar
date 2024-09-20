import notificacionModel from '../models/notificationsModel.js';
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


const updateNotification = async (req,res)=>{
 const {id}= req.params
 const updateFields= req.body;

 try {
    const result= await notificationService.updateNotificationAndNotify(id,updateFields)
    
    return res.status(200).json(result);
 } catch (error) {
    console.error(error)
    res.status(500).json({error:'Error actualizando notificacion'})
 }
}

//Ruta para crear una notificacion para un usuario
const createUserNotification= async (req,res)=>{
const { id_notificacion,id_usuario}= req.body

  try {
    const result = await notificationService.createAndNotifyUser(id_notificacion,id_usuario)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error:'Error creando notificacion al usuario'})
  }
}

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

const deleteNotification = async (req,res)=>{
    const { id }= req.params;
    console.log(id)
    
    try {
        const notification = await notificationService.deleteNotification(id);
        if (!notification) {
            res.status(404).json({error});
            
        }
        res.status(200).json(notification);
        
    } catch (error) {
        res.status(500).json({error:'Error eleminiando notificacion'})
    }
}


const getUserNotification = async (req,res)=>{
    const { username } = req.query;
try {
    const userNotification= await notificationService.getUserNotification(username);

    if (userNotification.length === 0) {
        res.status(404).json('No se encontraron resultados')
    }

    return res.status(200).json(userNotification);
} catch (error) {
    console.error(error)
     res.status(500).json({ error: 'Error obteniendo notificaciones' });
        
}
}



const updateUserNotification = async (req,res)=>{
    const {id}= req.params
    const updateFields= req.body;
   
    try {
       const result= await notificationService.updateUserNotificationAndNotify(id,updateFields)
       
       return res.status(200).json(result);
    } catch (error) {
       console.error(error)
       res.status(500).json({error:'Error actualizando notificacion'})
    }
   }


const deleteUserNotification= async (req,res)=>{
    const {id} =req.params

    try {
        const result = await notificationService.deleteUserNotification(id);
        if(!result){
            res.status(404).json('No se encontraron resultados')

        }

        return res.json(result);
    } catch (error) {
        console.error(error)
       res.status(500).json({error:'Error eliminando notificacion'})
    }
}



export default { getNotifications,createNotification,updateNotification,deleteNotification,getUserNotification,createUserNotification,updateUserNotification,deleteUserNotification};
