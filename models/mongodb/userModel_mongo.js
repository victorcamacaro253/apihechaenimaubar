import { ObjectId } from 'mongodb'
import {connect} from '../db/db_mongo.js'

let db; // Variable global para la conexión a la base de datos


// Función para inicializar la conexión a la base de datos
async function initializeDb() {
    try {
        if (!db) {
            db = await connect(); // Conectar a la base de datos solo si aún no está conectada
        }
    } catch (error) {
        console.error('Error inicializando la conexión a la base de datos:', error);
        throw error;
    }
}

initializeDb()

const  UserModel = {

    async getAllUsers (){
       
        const collection = db.collection('usuario')

        try{
            const users = db.collection.find({}).toArray()
            return users
        } catch(error){
            console.error('Error retrieving users:', error)
            throw new Error('Error retrieving users')
        }
    },


    async getUserById (id){
        const objectId = new ObjectId(id);
        return await db.collection('usuario').findOne({ _id: objectId });
    },

    async existingCedula(cedula){
        const results= await db.collection('usuario').findOne({ cedula });
        return results; 
    },

    async addNewUser (name,apellido,cedula,email,hashedPassword){
        const result = await db.collection('usuario').insertOne({
            nombre: name,
            apellido,
            cedula,correo: email,
            constraseña: hashedPassword

        });
        return result;
      

        
    },

    async updateUser(id,updateFields){
  const objectId = new  ObjectId(id);
  const result = await db.collection('usuario').updateOne(
    {_id: objectId},
    {$set: updateFields}
  );
  return result;

    } ,


     async searchUserss({name,apellido,cedula}){
        const query ={};

        if (name) {
            query.nombre = { $regex: name, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        if (apellido) {
            query.apellido = { $regex: apellido, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }
        if (cedula) {
            query.cedula = { $regex: cedula, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        const result= await db.collection('usuario').find(query).toArray();
        return result;
     },
    
     async deleteUser(id){
        const objectId = new ObjectId(id);
        const result = await db.collection('usuario').deleteOne({_id: ObjectId});
        return result.deleteCount;
     },

     async insertLoginRecord(userId,code){
        await db.collection('hisotrial_ingreso').insertOne({
            id_usuario : new ObjetId(userId),
            fecha : new Date(),
            codigo:code
        });
     },

     async findByEmail(email){

        const result =  await db.collection('usuario').findOne({correo:email})
        return result;
     },


     async getPerfil(){
     const result= await db.collection('usuario').find({},{projection:{nombre:1,apellido:1,cedula:1}}).toArray();
    return result;

      },


     async getPerfilUser(id){
        const objectId = new  objectId(id);
        const result= await db.collection('usuario').findOne({id:objectId})
        return result;
     }

} 


export default UserModel;
