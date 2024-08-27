import { query as _query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import { hash, compare } from 'bcrypt';
import { validationResult } from 'express-validator';
import pkg from 'jsonwebtoken';  // Importa el módulo completo
const { sign } = pkg;  // Desestructura la propiedad 'sign'import { randomBytes } from 'crypto';
import userModel from '../models/userModels.js';


const getAllUser = async (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    try {
        const [results] = await _query('SELECT * FROM usuario');
        res.json(results);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Llama al método del modelo, que devuelve un solo objeto de usuario
        const user = await _getUserById(id);

        // Verifica si se encontró el usuario
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Envía el usuario encontrado
        res.json(user);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Agregar un nuevo usuario
const addUser = async (req, res) => {
    const { name, apellido, cedula, email, password } = req.body;

    if (!name || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Nombre, apellido, correo y contraseña son requeridos' });
    }

    if (password.length < 7) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 7 caracteres' });
    }

    const connection = await pool.getConnection(); // Obtener conexión desde el pool
    try {
        await connection.beginTransaction();

        const existingUser = await _query('SELECT * FROM usuario WHERE cedula = ?', [cedula]);

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await userModel.addUser(connection, name, apellido, cedula, email, hashedPassword);

        await connection.commit();
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        await connection.rollback();
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        connection.release(); // Liberar la conexión después de usarla
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, apellido, cedula, email, password } = req.body;

    if (!name && !apellido && !email && !password) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    try {
        let updateFields = [];
        let values = [];

        if (name) {
            updateFields.push('nombre = ?');
            values.push(name);
        }

        if (apellido) {
            updateFields.push('apellido = ?');
            values.push(apellido);
        }

        if (cedula) {
            updateFields.push('cedula = ?');
            values.push(cedula);
        }

        if (email) {
            updateFields.push('correo = ?');
            values.push(email);
        }
        
        if (password) {
            const hashedPassword = await hash(password, 10);
            updateFields.push('contraseña = ?');
            values.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        const results = await _updateUser(id, updateFields,values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    
    const { id } = req.params;
  
      // Configurar encabezados CORS
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
  
      // Manejar solicitudes OPTIONS para preflight
      if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
      }


    try {
        const [result] = await _query('DELETE FROM usuario WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


 // Actualizar parcialmente un usuario por ID
const partialUpdateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Validar que haya al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    try {
        // Verificar si el usuario existe
        const [userResults] = await _query('SELECT * FROM usuario WHERE id = ?', [id]);
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let updateFields = [];
        let values = [];

        // Solo actualizar los campos proporcionados
        if (updates.name) {
            updateFields.push('nombre = ?');
            values.push(updates.name);
        }
        if (updates.email) {
            updateFields.push('correo = ?');
            values.push(updates.email);
        }
        if (updates.password) {
            const hashedPassword = await hash(updates.password, 10);
            updateFields.push('contraseña = ?');
            values.push(hashedPassword);
        }

        // Añadir el ID al final de los valores
        values.push(id);

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay datos válidos para actualizar' });
        }

        // Construir la consulta SQL
        const query = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await _query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado parcialmente exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const searchUsers = async (req, res) => {
    const { name, apellido, cedula } = req.query; // Usa req.query para parámetros GET

    // Configurar encabezado CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    try {
        // Llamar a la función del modelo
        const results = await _searchUsers({ name, apellido, cedula });

        res.status(200).json(results);
    } catch (err) {
        console.error('Error ejecutando la consulta', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;


    
      // Configurar encabezados CORS
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
  
      // Manejar solicitudes OPTIONS para preflight
      if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
      }

    // Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
    }

    try {
        // Buscar al usuario en la base de datos
        const user = await findByEmail(email);
       

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const match = await compare(password, user.contraseña);

        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = sign(
            { id: user.id, email: user.correo },
            process.env.JWT_SECRET, // Asegúrate de tener JWT_SECRET en tus variables de entorno
            { expiresIn: '1h' } // Expiración del token, por ejemplo, 1 hora
        );


         // Generate a random code
        const randomCode = randomBytes(8).toString('hex'); // Generates a random 8-character code

        // Insert login record into the database
        await insertLoginRecord(user.id, randomCode);

    

        // Devolver la respuesta con el token
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



const getPerfil = async (req, res) => {
    try {
        // Verifica si `req.user` existe y tiene la propiedad `id`
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.user.id;

        // Consultar el perfil del usuario en la base de datos
        const [results] = await _query('SELECT id, nombre, correo FROM usuario WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        // Enviar el perfil del usuario como respuesta
        res.status(200).json({ perfil: results[0] });

    } catch (err) {
        console.error('Error obteniendo el perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};






export default {
    getAllUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    partialUpdateUser,
    searchUsers,
    loginUser,
    getPerfil,
    
};
