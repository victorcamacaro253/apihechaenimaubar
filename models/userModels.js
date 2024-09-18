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
        return results.length ? results[0] : null;
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
        const [result] = await _query('DELETE FROM usuario WHERE id = ?', [id]);
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
        console.log(`Executing query: SELECT * FROM historial_ingresos INNER JOIN usuario ON historial_ingresos.id_usuario=usuario.id WHERE usuario.nombre=?`, [nombre]);
        const result = await _query('SELECT * FROM `historial_ingresos` INNER JOIN usuario ON historial_ingresos.id_usuario=usuario.id WHERE usuario.nombre=?', [nombre]);
        console.log(`Query result:`, result);
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


async exportUserData(id){
    try {
        const user = await this.getUserById(id);
        
        if(!user){
            throw new Error('Usuario no encontrado');
        }

        //Create a new workbook

        const wb = XLSX.utils.book_new();

        //create a worksheet from user data
        const ws = XLSX.utils.json_to_sheet([user],{
            header:['id','nombre','apellido','cedula','correo']
        });

        XLSX.utils.book_append_sheet(wb,ws,'Usuario');

        //convert workbook to buffer
        const excelBuffer = XLSX.write(wb,{booktype:'xlsx',type:'buffer'});

        return excelBuffer;

    } catch (error) {
        console.error('Error exporting user data',error);
        throw error;
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







export default UserModel;
