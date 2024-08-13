const { query } = require('express');
const db = require('../db/db');
const connection = require('../db/db');

const getAllUser = (req,res)=>{
 db.query('SELECT * FROM usuario',(err,results)=>{
    if(err){
        console.error('Error ejecutando la consulta:',err);
        return res.status(500).json({error:'Error interno del servidor'});
    }
    res.json(results);
 }) ;
};

const getUserById = (req,res)=>{
    const userId= req.params.id;

    connection.query('SELECT * FROM usuario where id = ?',[userId],(err,results)=>{
     if (err) {
        console.error('Error executing the query:',err);
        return res.status(500).json({error:'Internal server error'})
        
     }

    if (results.length === 0) {
        return res.status(404).json({error:'User not found'})
        
    }


    res.json(results[0]);


    })
}

const addUser = (req, res) => {
    // Extract name and email from the request body
    const { name, email,password } = req.body;

    // Basic validation for name and email
    if (!name || !email || !password ) {
        return res.status(400).json({ error: 'Name and email and Password are required' });
    }

    // Prepare the SQL query
    const query = 'INSERT INTO usuario (nombre, correo,contraseña) VALUES (?,?,?)';

    // Execute the query
    db.query(query, [name, email,password], (err, results) => {
        if (err) {
            console.error('Error executing the query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Respond with the ID of the newly created user and the provided data
        res.status(201).json({ id: results.insertId, name, email,password });
    });
};



 
const updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    // Build the SQL query dynamically based on which fields are provided
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
        updateFields.push('contraseña = ?');
        values.push(password);
    }

    values.push(userId);

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    const query = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    });
};




module.exports = {
    getAllUser,
    addUser,
    getUserById,
    updateUser
};