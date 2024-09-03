import { query as _query,pool } from '../db/db1.js';
import bcrypt from 'bcrypt';

const UserModel = {

    async getAllUsers() {
        const results = await _query('SELECT * FROM usuario');
        return results;
    },

    async getUserById(id) {
        const results = await _query('SELECT * FROM usuario WHERE id = ?', [id]);
        return results.length ? results[0] : null;
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
    const [results] = await _query(query, finalValues);

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
        query += ' AND cedula LIKE ?';
        params.push(cedula);
    }

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
        return results.length ? results[0] : null;
    },


async getPerfil(){
    const results= await _query('SELECT nombre,apellido,cedula FROM usuario');
    return results;
},

async getUserPerfil(id){
    const result= await _query('SELECT * FROM usuario WHERE id=?',[id])
    return result;
}


};




export default UserModel;