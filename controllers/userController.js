import { query as _query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import { hash, compare } from 'bcrypt';
import {randomBytes} from 'crypto';
import pkg from 'jsonwebtoken';  // Importa el módulo completo
const { sign } = pkg;  // Desestructura la propiedad 'sign'import { randomBytes } from 'crypto';
//import UserModel from '../models/userModels.js'
import redis from '../db/redis.js'
import UserModel from '../models/firebase/userModel_firebase.js'

const getAllUser = async (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    try {

    // Verificar si los datos están en la caché de Redis
    const cachedUsers = await redis.get('allUsers');

    if (cachedUsers) {
        // Si los datos están en la caché, devolverlos
        console.log('Datos obtenidos desde Redis');
        return res.json(JSON.parse(cachedUsers));
    }

        const results = await UserModel.getAllUsers();

          // Almacenar los resultados en la caché de Redis con una expiración (por ejemplo, 10 minutos)
          await redis.setEx('allUsers', 600, JSON.stringify(results)); // 600 segundos = 10 minutos

        res.json(results);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor 1' });
    }
};
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
            // Verificar si el usuario está en la caché de Redis
             const cachedUser = await redis.get(`user:${id}`);
             if (cachedUser) {
                // Si el usuario está en la caché, parsear y obtener los datos
                const user = JSON.parse(cachedUser);
                console.log(`Datos obtenidos desde Redis: ID=${user.id}, Nombre=${user.nombre}`);
                return res.json(user);
            }
    

        // Llama al método del modelo para obtener el usuario por ID
        const user = await UserModel.getUserById(id);

        // Verifica si se encontró el usuario
        if (!user) {
            // Usuario no encontrado, responde con un error 404
            return res.status(404).json({ 
                error: 'Usuario no encontrado', 
                message: `No se pudo encontrar un usuario con el ID proporcionado: ${id}` 
            });
        }

          // Almacenar el usuario en la caché de Redis con una expiración (por ejemplo, 5 minutos)
          await redis.setEx(`user:${id}`, 300, JSON.stringify(user)); // 300 segundos = 5 minutos

          console.log(`Datos obtenidos desde la base de datos: ID=${user.id}, Nombre=${user.nombre}`);

        // Envía el usuario encontrado como respuesta
        res.json(user);
    } catch (err) {
        // Maneja cualquier error que pueda ocurrir durante la consulta
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            message: 'Se produjo un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.' 
        });
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

        const existingUser = await UserModel.existingCedula(cedula)

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await UserModel.addUser( name, apellido, cedula, email, hashedPassword);

        await connection.commit();

        await redis.setEx(`user:${result.insertId}`, 300, JSON.stringify(newUser)); // 300 segundos = 5 minutos

        
        res.status(201).json({ id: result.insertId, name });
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

        const results = await UserModel.updateUser(id, updateFields,values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Invalidar la caché de Redis para este usuario
        await redis.del(`user:${id}`);


        // Opcionalmente, podrías volver a obtener el usuario actualizado y guardarlo nuevamente en Redis
        const updatedUser = await UserModel.getUserById(id);
        await redis.setEx(`user:${id}`, 300, JSON.stringify(updatedUser)); // 300 segundos = 5 minutos

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
        const result = await UserModel.deleteUser(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        // Invalida la caché de Redis para este usuario
        await redis.del(`user:${id}`);

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
         // Crear una clave única para la caché basada en los parámetros de búsqueda
         const cacheKey = `searchUsers:${name || ''}:${apellido || ''}:${cedula || ''}`;

         // Verificar si los resultados ya están en la caché de Redis
         const cachedResults = await redis.get(cacheKey);
 
         if (cachedResults) {
             // Si los datos están en la caché, devolverlos
             console.log('Datos obtenidos desde Redis');
             return res.status(200).json({ results: JSON.parse(cachedResults) });
         }
 
        // Llamar a la función del modelo
        const results = await UserModel.searchUsers({ name, apellido, cedula });

        if(!results){
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }
        // Almacenar los resultados en la caché de Redis con una expiración (por ejemplo, 10 minutos)
        await redis.setEx(cacheKey, 600, JSON.stringify(results)); // 600 segundos = 10 minutos

        res.status(200).json({results});
        
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
        const results = await UserModel.findByEmail(email)
        const user = results[0]; // Asegúrate de que results sea un array y toma el primer elemento
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
            { id: user.id, correo: user.correo },
            process.env.JWT_SECRET, // Asegúrate de tener JWT_SECRET en tus variables de entorno
            { expiresIn: '1h' } // Expiración del token, por ejemplo, 1 hora
        );

        // Generar un código aleatorio
        const randomCode = randomBytes(8).toString('hex'); // Genera un código aleatorio de 8 caracteres

        // Insertar registro de inicio de sesión en la base de datos
        UserModel.insertLoginRecord( user.id, randomCode)
       

        // Devolver la respuesta con el token
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.' });
    }
};



const getPerfil = async (req, res) => {
    try {
        // Verifica si `req.user` existe y tiene la propiedad `id`
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }


        // Consultar el perfil del usuario en la base de datos
        const results = await UserModel.getPerfil();

        if (results.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        // Enviar el perfil del usuario como respuesta
        res.status(200).json(results);

    } catch (err) {
        console.error('Error obteniendo el perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const getUserPerfil= async (req,res) => {
    console.log('req.params:', req.params);
const id = req.params.id;
    

    if (!id) {
        return res.status(400).json({ error: 'ID del usuario es requerido' });
    }



    try {
        
       
        // Consultar el perfil del usuario en la base de datos
        const results = await UserModel.getUserPerfil(id);


        if (results.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }
   
        // Enviar el perfil del usuario como respuesta
        res.status(200).json(results);

    } catch (err) {
        console.error('Error obteniendo el perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}


const getLoginHistory = async (req,res)=>{
   // const {id} = req.params;
   const{ nombre } =req.query
    try {
       // const result= await UserModel.getLoginHistory(id)


       const result= await UserModel.getLoginHistory(nombre);

           // Verifica si se encontró el usuario
           if (!result) {
            // Usuario no encontrado, responde con un error 404
            return res.status(404).json({ 
                error: 'Usuario no encontrado', 
                message: `No se pudo encontrar un usuario con el nombre proporcionado: ${nombre}` 
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error al obtener el historial de ingresos',error);
        res.status(500).json({error:'Error interno del servidor',error})
    }
}


const getUsersWithPagination = async (req,res)=>{
    const {page= 1,limit=10}= req.query
    const offset= (page - 1 ) * limit;
    
    try {
        const result = await UserModel.getUsersWithPagination(limit,offset);
        res.status(200).json(result)

    } catch (error) {
        console.error('Error al obtener la paginacion',error)
        res.status(500).json({Error:'Error interno del servidor',error})
    }
}

// Controller to export user data to Excel
const exportUserData = async (req, res) => {
    const { id } = req.params;

    try {
        const excelBuffer = await UserModel.exportUserData(id);

        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error('Error al exportar los datos del usuario a Excel:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Controller to export user data to Excel
const exportUsersData = async (req, res) => {
   

    try {
        const excelBuffer = await UserModel.exportUsersData();

        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error('Error al exportar los datos del usuario a Excel:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



// Controller to export user data to Excel
const exportUsersDataByName = async (req, res) => {
   const {nombre} =req.query

    try {
        const excelBuffer = await UserModel.exportUsersDataByName(nombre);

        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error('Error al exportar los datos del usuario a Excel:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/*
const getcorreo = async (req, res) => {
    const { email, password } = req.body;

    // Configurar encabezados CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar solicitudes OPTIONS para preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    try {
        // Validación de entrada
        if (!email || !password) {
            return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
        }

        // Consulta para obtener el usuario basado en el correo electrónico
       const results = await UserModel.findByEmail(email)
        const user = results[0]; // Asegúrate de que `user` se defina correctamente

        console.log('Resultados de la consulta:', results); // Verifica los resultados

        if (!user) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const match = await compare(password, user.contraseña);

        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = sign(
            { id: user.id, correo: user.correo },
            process.env.JWT_SECRET, // Asegúrate de tener JWT_SECRET en tus variables de entorno
            { expiresIn: '1h' } // Expiración del token, por ejemplo, 1 hora
        );

        // Generar un código aleatorio
        const randomCode = randomBytes(8).toString('hex'); // Genera un código aleatorio de 8 caracteres

        // Insertar registro de inicio de sesión en la base de datos
        await _query(
            'INSERT INTO historial_ingresos (id_usuario, fecha, codigo) VALUES (?, NOW(), ?)',
            [user.id, randomCode]
        );

        // Devolver la respuesta con el token
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (err) {
        console.error('Error haciendo el login:', err.message || err);
        console.error('Error haciendo el login:', err);
        res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.' });
    }
};

*/

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
    getUserPerfil,
    getLoginHistory,
    getUsersWithPagination,
    exportUserData,
    exportUsersData,
    exportUsersDataByName
};
