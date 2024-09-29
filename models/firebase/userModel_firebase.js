import db from '../../db/firebase.js';
import XLSX from 'xlsx';
const UserModel = {

//obtener todos los usuarios
async getAllUsers(){

    try {
        const snapshot = await db.collection('usuarios').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users;
      } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw new Error('Error al obtener todos los usuarios');
      }
},

// Obtener usuario por ID
async getUserById(id) {
    try {
      const doc = await db.collection('usuarios').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${id}:`, error);
      throw new Error('Error al obtener el usuario');
    }
  },

  // Método para obtener un usuario por su nombre
async getUserByNombre(nombre) {
  try {
    // Hacer la consulta en la colección 'usuarios' donde el campo 'nombre' sea igual al nombre proporcionado
    const snapshot = await db.collection('usuarios').where('nombre', '==', nombre).get();
    
    // Verificar si se encontró algún documento
    if (snapshot.empty) {
      return null;  // No se encontró ningún usuario con el nombre proporcionado
    }

    // Si se encuentra, devolver el primer usuario (puede haber más de uno)
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
    
  } catch (error) {
    console.error(`Error al obtener el usuario con nombre ${nombre}:`, error);
    throw new Error('Error al obtener el usuario');
  }
},

  // Agregar un nuevo usuario
  async addUser(name, apellido, cedula, email, hashedPassword) {
    try {
      const userRef = await db.collection('usuarios').add({
        nombre: name,
        apellido: apellido,
        cedula: cedula,
        correo: email,
        contraseña: hashedPassword,
      });
      return { id: userRef.id, name, apellido, cedula, email };
    } catch (error) {
      console.error('Error al agregar un nuevo usuario:', error);
      throw new Error('Error al agregar un nuevo usuario');
    }
  },

  async existingCedula(cedula){
    const snapshot = await db.collection('usuarios').where('cedula','==',cedula).get();
    if (snapshot.empty) {
      return null; // No user found with the given cedula
  }

  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };

  },

  async findByEmail(email){
    const snapshot= await db.collection('usuarios').where('correo','==',email).get();
    if(snapshot.empty){
      return null;
    }
    const userDoc = snapshot.docs[0];
    return {id:userDoc.id,...userDoc.data()};
  },

  async insertLoginRecord(userId,code){
   await db.collection('historial_ingresos').add({
    id_usuario : userId,
    fecha : admin.firestore.FieldValue.serverTimestamp(),
    codigo: code
   })
  },

  async deleteUser(id){
    const userRef = db.collection('usuarios').doc(id);
    await userRef.delete();
    return {success: true};
  },

  async searchUsers(name,apellido,cedula){

    console.log('Parameters received:', { name, apellido, cedula });

    let query = db.collection('usuarios');
    

    if(name){
      console.log(`Nombre: ${name}`);
      query= query.where('nombre','>=',name).where('nombre','<=',name + '\uf8ff');
    }

    if(apellido){
      console.log(`Apellido: ${apellido}`);
      query= query.where('apellido','>=',apellido).where('apellido','<=',apellido + '\uf8ff');
    }

    if(cedula){
      console.log(`Cédula: ${cedula}`);
      query = query.where('cedula','==',cedula); 
    }


    const snapshot = await query.get();

    if(snapshot.empty){
      return[];
    }

    const users = snapshot.docs.map(doc => ({id: doc.id,...doc.data()}));
    return users;
  },
  
  async getLoginHistory(nombre){
    try {
        console.log(`Buscando usuario con nombre: ${nombre}`);

        // Obtener el usuario basado en el nombre
        const userSnapshot = await db.collection('usuarios')
            .where('nombre', '==', nombre)
            .get();

        if (userSnapshot.empty) {
            console.log('No se encontró ningún usuario con el nombre proporcionado');
            return []; // No se encontró el usuario
        }

        // Suponiendo que hay un solo usuario con ese nombre
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        console.log(`ID del usuario encontrado: ${userId}`);

        // Obtener el historial de inicios de sesión basado en el ID del usuario
      
      // Buscar el historial de inicios de sesión para el usuario encontrado
      const historySnapshot = await db.collection('historial_ingresos')
        .where('id_usuario', '==', db.collection('usuarios').doc(userId))
        .get();

      // Obtener los datos de los usuarios referenciados
      const historyWithDetails = await Promise.all(historySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const timestamp = data.fecha.toDate(); // Convertir la marca de tiempo a un objeto Date
        const formattedDate = timestamp.toLocaleString('es-ES', { timeZone: 'America/Bogota' }); // Formatear la fecha
        const userRef = data.id_usuario; // Referencia al usuario

        // Obtener los datos del usuario referenciado
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};

        return {
          id: doc.id,
          fecha: formattedDate,
          codigo: data.codigo,
          usuario: userData, // Incluir los datos del usuario referenciado
        };
      }));

      console.log(`Historial de inicios de sesión:`, historyWithDetails);
      return historyWithDetails;
    } catch (error) {
        console.error('Error obteniendo el historial de inicios de sesión', error);
        throw new Error('Error al obtener el historial de inicios de sesión');
    }
},

async getUsersWithPagination(limit,startAfterId=null){
 
 try {
  let query= db.collection('usuarios').orderBy('nombre').limit(limit);

 //Si se proporciona un startAfterId,utilizarlo para empezar despues de este documento
 if(startAfterId){
  const startAfterdoc= await db.collection('usuarios').doc(startAfterId).get();
  if(startAfterdoc.exists){
   query= query.startAfter(startAfterdoc);
  }
 }

 const snapshot = await query.get();

 if(snapshot.empty){
return [];
 }

 const users= snapshot.docs.map(doc=>({id: doc.id,...doc.data()}));

 return users;

 } catch (error) {
  console.error('Error al obtener usuarios con paginación', error);
  throw new Error('Error al obtener usuarios con paginación');
 }

},
async exportUsersData() {
  try {
    // Obtener todos los usuarios desde Firestore
    const users = await this.getAllUsers(); // Asegúrate de tener este método implementado en UserModel

    if (!users || users.length === 0) {
      throw new Error('No se encontraron usuarios');
    }

    // Crear un nuevo libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();

    // Formatear los datos para la hoja de Excel
    const formattedUsers = users.map(user => ({
      id: user.id,
      nombre: user.nombre || '',  // Proporciona un valor por defecto si el campo está vacío
      apellido: user.apellido || '',
      cedula: user.cedula || '',
      correo: user.correo || ''
    }));

    // Crear una hoja de trabajo (worksheet) a partir de los datos de usuarios formateados
    const ws = XLSX.utils.json_to_sheet(formattedUsers, {
      header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
    });

    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    // Convertir el libro de trabajo en un buffer de Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Devolver el buffer de Excel
    return excelBuffer;
  } catch (err) {
    console.error('Error al exportar los datos de usuarios a Excel:', err);
    throw err;
  }
},

async exportUserData(id) {
  try {
    // Obtener todos los usuarios desde Firestore
    const users = await this.getAllUserById(id); // Asegúrate de tener este método implementado en UserModel

    if (!users || users.length === 0) {
      throw new Error('No se encontraron usuarios');
    }

    // Crear un nuevo libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();

    // Formatear los datos para la hoja de Excel
    const formattedUsers = users.map(user => ({
      id: user.id,
      nombre: user.nombre || '',  // Proporciona un valor por defecto si el campo está vacío
      apellido: user.apellido || '',
      cedula: user.cedula || '',
      correo: user.correo || ''
    }));

    // Crear una hoja de trabajo (worksheet) a partir de los datos de usuarios formateados
    const ws = XLSX.utils.json_to_sheet(formattedUsers, {
      header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
    });

    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    // Convertir el libro de trabajo en un buffer de Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Devolver el buffer de Excel
    return excelBuffer;
  } catch (err) {
    console.error('Error al exportar los datos de usuarios a Excel:', err);
    throw err;
  }
},

// Método para exportar los datos de usuario a Excel por nombre
async exportUsersDataByName(nombre) {
  try {
      const user = await this.getUserByNombre(nombre); // Usa el método adaptado a Firestore
      if (!user) {
          throw new Error('No se encontró ningún usuario con ese nombre');
      }

      // Crear un nuevo libro de trabajo
      const wb = XLSX.utils.book_new();

      // Crear una hoja de trabajo desde los datos del usuario
      // Como Firestore devuelve un solo usuario, lo convertimos en un array
      const ws = XLSX.utils.json_to_sheet([user], {
          header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
      });

      // Agregar la hoja de trabajo al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

      // Convertir el libro a un buffer de Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      return excelBuffer;
  } catch (err) {
      console.error('Error al exportar los datos de usuario a Excel:', err);
      throw err;
  }
},

async updateUser(id,updateFields,values){
  try {

    //Referencia al documento del usuario por Id
    const userRef= db.collection('usuarios').doc(id)
    
  //Construir el objeto de actualizacion a partir de los campos y valores proporcionados
    const updateData={};

    updateFields.forEach((field,index)=>{
      updateData[field] = values[index];
    })
    
    //Ejecutar la actualizacion en firestore
  await userRef.update(updateData)

  return {message:'Usuario actualizado correctamente'}

  } catch (error) {
    console.error('Error actualizando el usuario:', error);
    throw error; // Lanzar el error para manejarlo en el controlador
  }
},

async addMultipleUser(users){
  try{
    const  batch = db.batch();
    const usersCollection=  db.collection('usuarios');

    users.forEach(user=>{
      const { name, apellido, cedula, email, hashedPassword } = user;
  
      const userDocRef = usersCollection.doc();
      batch.set(userDocRef, {
        name: user.name,
        apellido: user.apellido,
        cedula: user.cedula,
        email: user.email,
        password: user.hashedPassword, // Contraseña hasheada
        imagePath: user.imagePath,
        createdAt: new Date() // Añadimos un timestamp
      });
    });
    await batch.commit();
  }catch(error){
    console.error('Error agregando usuarios:', error);
  }
}

}

export default UserModel;