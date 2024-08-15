const db = require('../db/db1'); // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Obtener todos los usuarios
const getAllUser = async (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    try {
        const [results] = await db.query('SELECT * FROM usuario');
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
        const [results] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Agregar un nuevo usuario
const addUser = async (req, res) => {
    const { name, apellido,cedula, email, password } = req.body;

    // Validación de entrada
    if (!name || !apellido || !email || !password ) {
        return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
    }

     // Validación de la contraseña
    
     if (password.length < 7) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 7 caracteres' });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Consulta SQL para insertar el usuario
        const [results] = await db.query('INSERT INTO usuario (nombre,apellido,cedula,correo, contraseña) VALUES (?,?,?, ?, ?)', [name,apellido,cedula, email, hashedPassword]);

        res.status(201).json({ id: results.insertId, name, email });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, apellido ,cedula , email, password } = req.body;

    if (!name && !apellido && !email && !password ) {
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
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('contraseña = ?');
            values.push(hashedPassword);
        }

        values.push(id);

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        const query = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;
        const [results] = await db.query(query, values);

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
        const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);

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
        const [userResults] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
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
            const hashedPassword = await bcrypt.hash(updates.password, 10);
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
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado parcialmente exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const searchUsers = async (req,res)=>{
    const {name,apellido,cedula} = req.query; //Usa req.query para parametros GET

    //configurar encabezado CORS
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers','Content-Type')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
        
    }

    try{
    //Se construye la consulta SQL

    let query = 'SELECT * FROM usuario WHERE 1=1 ' // 1=1 para simplificar la concatenacion
    let params = []

    if (name) {
        query += 'AND nombre LIKE ? ';
        params.push(`%${name}%`);
        
    }

    if (apellido) {
        query += 'AND apellido LIKE ? ';
        params.push(`%${apellido}%`);
        
    }

    if (cedula) {
        query += 'AND cedula LIKE ? ';
        params.push(cedula);
        
    }
    
    //ejecuta la consulta de la base de datos 
    const [results] = await db.query(query,params)

    res.status(200).json(results)

    
    }catch (err){

        console.error('Error ejecutando la consulta',err)
        res.status(500).json({error:'Error interno del sevidor'})
    }
}

module.exports = {
    getAllUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    partialUpdateUser,
    searchUsers
};
