const db = require('../db/db1'); // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Obtener todos los usuarios
const getAllUser = async (req, res) => {
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
    const { name, email, password } = req.body;

    // Validación de entrada
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Consulta SQL para insertar el usuario
        const [results] = await db.query('INSERT INTO usuario (nombre, correo, contraseña) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ id: results.insertId, name, email });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    try {
        let updateFields = [];
        let values = [];

        if (name) {
            updateFields.push('nombre = ?');
            values.push(name);
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

module.exports = {
    getAllUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};
