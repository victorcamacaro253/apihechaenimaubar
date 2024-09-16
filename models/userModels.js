import { query as _query } from '../db/db1.js';
import bcrypt from 'bcrypt';
import XLSX from 'xlsx';

const UserModel = {

    async getAllUsers() {
        try {
            // Realiza la consulta para obtener todos los usuarios
            const results = await _query('SELECT * FROM usuario');
            return results; // Devuelve los resultados de la consulta
        } catch (err) {
            // Maneja cualquier error que pueda ocurrir durante la consulta
            console.error('Error al obtener todos los usuarios:', err);
            throw new Error('Error al obtener todos los usuarios'); // Lanza un nuevo error para que el controlador lo maneje
        }
    },

   
    
    async getUserById(id) {
        try {
            const results = await _query('SELECT * FROM usuario WHERE id = ?', [id]);
            return results.length ? results[0] : null;
        } catch (err) {
            console.error('Error en el modelo al obtener usuario por ID:', err);
            throw err; // Lanza el error para que pueda ser manejado por el controlador
        }
    },

    async getUserByNombre(nombre){

  const result= await _query('SELECT * FROM usuario WHERE nombre = ?',[nombre]);
  return result;

    },

    async existingCedula(connection,cedula) {
        const [results] = await connection.query('SELECT * FROM usuario WHERE cedula = ?',[cedula]);
        return results;
    },

    async addUser (connection, name, apellido, cedula, email, hashedPassword){
        const [result]= await connection.query( 'INSERT INTO usuario (nombre, apellido, cedula, correo, contraseña) VALUES (?, ?, ?, ?, ?)',
            [name, apellido, cedula, email, hashedPassword] );

            return result;
    },
    // Modelo: updateUser
async updateUser(id, updateFields, values) {
    // Construir la consulta SQL
    const query = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;

    // Añadir el ID al final de los valores
    const finalValues = values.concat(id);

    // Ejecutar la consulta
    const results = await _query(query, finalValues);

    return results; // Retornar el resultado de la consulta
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
            return results; // Asegúrate de que esto sea un array
     
         
        },
    
        async getPerfil(){
try {
    const results= await _query('Select id,nombre,apellido,cedula from usuario')
    return results;
} catch (err) {
    console.error('Error en el modelo al obtener usuario:', err);
    throw err; // Lanza el error para que pueda ser manejado por el controlador
}
    

        },

       
    async getUserPerfil(id) {
        try {
            const results = await _query('SELECT * FROM usuario WHERE id = ?', [id]);
            return results;
        } catch (err) {
            console.error('Error en el modelo al obtener usuario por ID:', err);
            throw err; // Lanza el error para que pueda ser manejado por el controlador
        }
    },

    /*
    async getLoginHistory(id){
        try {
            const result= await _query('SELECT * FROM historial_ingresos WHERE id =?',[id]);
            return result;
        } catch (error) {
            console.error('Error ',error);
            throw err;
        }
    }
   */

    async getLoginHistory(nombre){
        try {
            const result= await _query('SELECT * FROM `historial_ingresos` INNER JOIN usuario ON historial_ingresos.id_usuario=usuario.id WHERE usuario.nombre=?',[nombre])
            return result;
        } catch (error) {
            console.error('Error ',error);
            throw err;
        }
    },

    async getUsersWithPagination(limit,offset){

        try {

            const result = await _query('SELECT * FROM usuario LIMIT ? OFFSET ?',[limit,offset])
            return result;
            
        } catch (error) {
            console.error('Error al obtener usuarios con paginacion',error)
            throw error;
        }
    },

    async exportUserData(id) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Create a worksheet from user data
            const ws = XLSX.utils.json_to_sheet([user], {
                header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
            });

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Usuario');

            // Convert workbook to buffer
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            return excelBuffer;
        } catch (err) {
            console.error('Error al exportar los datos del usuario a Excel:', err);
            throw err;
        }
    },

    
    // Method to export user data to Excel
    async exportUsersData() {
        try {
            const users = await this.getAllUsers(); // Use the corrected method
            if (!users || users.length === 0) {
                throw new Error('No users found');
            }

            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Create a worksheet from user data
            const ws = XLSX.utils.json_to_sheet(users, {
                header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
            });

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

            // Convert workbook to buffer
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            return excelBuffer;
        } catch (err) {
            console.error('Error exporting user data to Excel:', err);
            throw err;
        }
    },
        
    // Method to export user data to Excel
    async exportUsersDataByName(nombre) {
        try {
            const users = await this.getUserByNombre(nombre); // Use the corrected method
            if (!users || users.length === 0) {
                throw new Error('No users found');
            }

            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Create a worksheet from user data
            const ws = XLSX.utils.json_to_sheet(users, {
                header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
            });

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

            // Convert workbook to buffer
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            return excelBuffer;
        } catch (err) {
            console.error('Error exporting user data to Excel:', err);
            throw err;
        }
    }




};






export default  UserModel ;
