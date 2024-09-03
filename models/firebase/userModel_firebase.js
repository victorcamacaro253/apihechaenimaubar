import db from '../firebase.js'

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

}