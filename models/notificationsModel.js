import { query } from '../db/db1.js';



const notificacionModel ={



 
// Función para obtener notificaciones para un usuario
async  getNotifications(){
    
    const results = await query('SELECT * FROM notificaciones');
    return results;
},


// Función para guardar una notificación en la base de datos
async saveNotification  (message,type)  {
    
    const results = await query('INSERT INTO notificaciones (message,created_at,type) VALUES (?, NOW(),?)', [message,type]);
    return results.insertId;
}



}
export default notificacionModel;