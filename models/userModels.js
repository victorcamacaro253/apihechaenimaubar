import { query as _query,pool } from '../db/db1.js';
import bcrypt from 'bcrypt';
import XLSX from 'xlsx';

const UserModel = {

    async getAllUsers() {
        const results = await _query('SELECT * FROM usuario');
        return results;
    },

    async getUserById(id) {
        const results = await _query('SELECT * FROM usuario WHERE id = ?', [id]);
        return results;
    },

    async getUserByNombre(nombre){

        const result= await _query('SELECT * FROM usuario WHERE nombre = ?',[nombre]);
        return result;
      
          },

    async existingCedula(cedula) {
        const results = await _query('SELECT * FROM usuario WHERE cedula = ?',[cedula]);
          // Si el arreglo `results` contiene al menos un resultado, retorna `true`, si no, retorna `false`
        return results.length > 0;
    },

    async addUser (name, apellido, cedula, email, hashedPassword){
        const result= await _query( 'INSERT INTO usuario (nombre, apellido, cedula, correo, contraseña) VALUES (?, ?, ?, ?, ?)',
            [name, apellido, cedula, email, hashedPassword] );

            return result;
    },
    async addUserGoogle({ google_id, nombre, correo, imagen }) {
        const result = await _query('INSERT INTO usuario (google_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)',
            [google_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
  const insertedUser = await _query('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    },

    async addUserFacebook({ facebook_id, nombre, correo, imagen }) {
        const result = await _query('INSERT INTO usuario (facebook_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)',
            [facebook_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
  const insertedUser = await _query('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    },

    async addUserGithub({ github_id, nombre, correo, imagen }) {
        const result = await _query('INSERT INTO usuario (github_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)',
            [github_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
  const insertedUser = await _query('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    },

    
    async addUserTwitter({ twitter_id, nombre, correo, imagen }) {
        const result = await _query('INSERT INTO usuario (twitter_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)',
            [twitter_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
  const insertedUser = await _query('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    },
    
    // Modelo: updateUser
async updateUser(id, updateFields, values) {

     //construir la parte de SET para la consulta , añadiendo un signo de interrogacion para cada campo
     const setClause= updateFields.map(field => `${field} = ? `).join(', '); 

    // Construir la consulta SQL
    const query = `UPDATE usuario SET ${setClause} WHERE id = ?`;

    // Añadir el ID al final de los valores
    const finalValues = values.concat(id);

    // Ejecutar la consulta
    const results = await _query(query, finalValues);

    return results; // Retornar el resultado de la consulta
},

async updatePartialUser(updateFields,values){
  // Construir la consulta SQL
  const sql = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;
  const result = await _query(sql, values);
  return result
},

// Modelo: searchUsers
async searchUsers({ name, apellido, cedula }) {
    // Construir la consulta SQL
    let query = 'SELECT * FROM usuario WHERE 1=1'; // 1=1 para simplificar la concatenación
    let params = [];

    if (name) {
        query += ' AND nombre LIKE ?';
        params.push(`%${name}%`);
    }

    if (apellido) {
        query += ' AND apellido LIKE ?';
        params.push(`%${apellido}%`);
    }

    if (cedula) {
        query += ' AND cedula = ?';
        params.push(cedula);
    }

    console.log('Consulta SQL:', query); // Depuración
    console.log('Parámetros:', params); // Depuración

    // Ejecutar la consulta
    const [results] = await _query(query, params);

    return results; // Retornar los resultados de la consulta
},




    async deleteUser(id) {
        const result = await _query('DELETE FROM usuario WHERE id = ?', [id]);
        return result.affectedRows;
    },

    async insertLoginRecord(userId, code) {
        await _query(
            'INSERT INTO historial_ingresos (id_usuario, fecha, codigo) VALUES (?, NOW(), ?)',
            [userId, code]
        );
    },

    async findByEmail(email) {
        const results = await _query('SELECT * FROM usuario WHERE correo = ?', [email]);
        return results;
    },


async getPerfil(){
    const results= await _query('SELECT nombre,apellido,cedula FROM usuario');
    return results;
},

async getUserPerfil(id){
    const result= await _query('SELECT * FROM usuario WHERE id=?',[id])
    return result;
},

/*
async getLoginHistory(id){
    
    try{

        const result= await _query('SELECT * FROM  hsitorial_ingresos WHERE id=?',[id]);
        return result;
    
    }catch(error){
    console.error('Error',error);
    throw error;
    }
}
*/

async getLoginHistory(nombre){
    try {
        const result = await _query('SELECT * FROM `historial_ingresos` INNER JOIN usuario ON historial_ingresos.id_usuario=usuario.id WHERE usuario.nombre=?', [nombre]);
        return result;
      } catch (error) {
        console.error('Error getting login history', error);
        throw error;
      }
    
},

async getUsersWithPagination(limit,offset){
    try {
        const result= await _query('SELECT * FROM usuario LIMIT ? OFFSET ?',[limit,offset])
        return result;

    } catch (error) {
        console.error('Error al obtener usuarios con paginacion',error)
        throw error;
    }
},

         
  

    async addMultipleUser(users){
        console.log(users)
        const queries = users.map(user=>{
            const {name,apellido,cedula,email,hashedPassword,rol,imagen} = user;

            return _query('INSERT INTO usuario (nombre, apellido, cedula, correo, contraseña,rol,imagen) VALUES (?, ?, ?, ?, ?,?,?) ',
                [name,apellido,cedula,email,hashedPassword,rol,imagen]
            )
        })  

        const result = await Promise.all(queries);
        return result

    },
    async findUserByGoogleId(googleId) {
        const query = 'SELECT * FROM usuario WHERE google_id = ?';
        const [rows] = await _query(query, [googleId]);
        return rows;
    },
    async findUserByFacebookId(facebookId) {
        const query = 'SELECT * FROM usuario WHERE google_id = ?';
        const [rows] = await _query(query, [facebookId]);
        return rows;
    },
    async findUserByGithubId(githubId) {
        const query = 'SELECT * FROM usuario WHERE github_id = ?';
        const [rows] = await _query(query, [githubId]);
        return rows;
    },
    async findUserByTwitterId(twitterId) {
        const query = 'SELECT * FROM usuario WHERE twitter_id = ?';
        const [rows] = await _query(query, [twitterId]);
        return rows;
    },
    async changeStatus(status,id){
        const result = await _query('UPDATE usuario SET estatus = ? WHERE id = ?',[status,id])
        return result
     },

     async getUserStatus(id){
        const sql = "SELECT estatus FROM usuario WHERE id= ?"
        const [result]= await _query(sql,[id])
        return result 
     }
    

};







export default UserModel;