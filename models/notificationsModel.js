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

    async deleteNotification(id){

        try{
            const result= await query('DELETE FROM notificaciones WHERE id = ?',[id]);
            return result;
        }catch(error){
            console.error('Erro al eliminar la notificacion',error)
        }

    },
    
     async getUserNotification(username){
        
        try {
            const result = await query('SELECT * FROM notificaciones_usuarios INNER JOIN usuario ON notificaciones_usuarios.id_usuario=usuario.id WHERE usuario.nombre = ?',[username])

            return result;

        } catch (error) {
            console.error('Erro al obtener la notificacion',error)

        }

    },

    async createAndNotifyUser(id_notificacion,id_usuario){
        const result = await query('INSERT INTO notificaciones_usuarios (id_notificacion,id_usuario,datetime) VALUES (?,?, NOW())',[id_notificacion,id_usuario]);
        return result.insertId;
    },

    
async updateUserNotification (notificacionId,updateFields){


    try {
     
     const queryStr = 'UPDATE notificaciones_usuarios SET ? WHERE id = ?';
     
     const result = await query(queryStr,[updateFields,notificacionId]);
     return result;
 
    } catch (error) {
     console.error('Error al actualizar todos los usuarios:', error);
     throw new Error('Error al actualizar todos los usuarios');
    }
 
     
     },


     async deleteUserNotification(id){
        const result= await query('DELETE FROM notificaciones_usuarios WHERE id=?',[id]);
        return result;
     }


}
export default notificacionModel;