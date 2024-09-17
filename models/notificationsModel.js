import { query } from '../db/db1.js';



const notificacionModel ={



 
// Función para obtener notificaciones para un usuario
async  getNotifications(){
    
    const results = await query('SELECT * FROM notificaciones');
    return results;
},

async getNotificationById(id){
    const results = await query('SELECT * FROM notificaciones WHERE id=?',[id]);
    return results;
}
,

// Función para guardar una notificación en la base de datos
async saveNotification  (message,type)  {
    
    const results = await query('INSERT INTO notificaciones (message,created_at,type) VALUES (?, NOW(),?)', [message,type]);
    return results.insertId;
},

    

async updateNotification (notificacionId,updateFields){


   try {
    
    const queryStr = 'UPDATE notificaciones SET ? WHERE id = ?';
    
    const result = await query(queryStr,[updateFields,notificacionId]);
    return result;

   } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw new Error('Error al obtener todos los usuarios');
   }

    
    },



}
export default notificacionModel;