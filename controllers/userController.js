import { query as _query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import { hash, compare } from 'bcrypt';
import UserModel from '../models/userModels.js'
import emailService from '../services/emailService.js';
import tokenService from '../services/tokenService.js';
import redis from '../db/redis.js';
import notificationService from '../services/notificationService.js';
import handleError from '../utils/handleError.js';


class userController{

static getAllUser = async (req, res) => {
   // res.header('Access-Control-Allow-Origin','*')
    try {

     const cachedUsers= await redis.get('users');
     if (cachedUsers) {
        console.log('datos obtenidos desde redis')
        return res.status(200).json(JSON.parse(cachedUsers))
     }


        const results = await UserModel.getAllUsers();

       await redis.set('users',JSON.stringify(results),'EX',600)

        res.json(results);
    } catch (error) {
        handleError(res,error)    
    }
};

static getUserById = async (req, res) => {
    const { id } = req.params;

    try {

       const cachedUser= await redis.get(`user:${id}`)

       if (cachedUser) {
        console.log('Datos obtenidos desde redis')
        return res.status(200).json(JSON.parse(cachedUser))
        
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
        await redis.set(`user:${id}`,JSON.stringify(user),'EX',600)

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
static addUser = async (req, res) => {
    const { name, apellido, cedula, email, password } = req.body;

    if (!name || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Nombre, apellido, correo y contraseña son requeridos' });
    }

    if (password.length < 7) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 7 caracteres' });
    }

   // const connection = await pool.getConnection(); // Obtener conexión desde el pool
    try {
     //   await connection.beginTransaction();

        const existingUser = await UserModel.existingCedula(cedula)

        if (existingUser.length > 0) {
           // await connection.rollback();
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await UserModel.addUser(name, apellido, cedula, email,hashedPassword);

        await redis.del('users');


        //await connection.commit();
        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error('Error ejecutando la consulta:', err);
        
      //  await connection.rollback();
      handleError(res,error)  
      } finally {
      //  connection.release(); // Liberar la conexión después de usarla
    }
};


static updateUser = async (req, res) => {
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

        await redis.del(`user:${id}`);
        await redis.del('users');
        

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        
    } catch (error) {
        console.error('Error ejecutando la consulta:', err);
        handleError(res,error)
        }
};

// Eliminar un usuario por ID
static deleteUser = async (req, res) => {
    
    const { id } = req.params;
  
    try {
        const result = await UserModel.deleteUser(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await redis.del(`user:${id}`);
        await redis.del('users');
        

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


 // Actualizar parcialmente un usuario por ID
static partialUpdateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Validar que haya al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    try {
        // Verificar si el usuario existe
        const userResults = await UserModel.getUserById(id)
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

        if (updates.cedula) {
            updateFields.push('correo = ?');
            values.push(updates.cedula);
        }

        if (updates.apellido) {
            updateFields.push('apellido = ?');
            values.push(updates.apellido);
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

        
        const result = await UserModel.updatePartialUser(updateFields,values)

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado parcialmente exitosamente' });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        handleError(res,error)    
    }
};

static searchUsers = async (req, res) => {
    const { name, apellido, cedula } = req.query; // Usa req.query para parámetros GET

    

    try {
        // Llamar a la función del modelo
        const results = await UserModel.searchUsers({ name, apellido, cedula });

        res.status(200).json({results});
        
    } catch (error) {
        console.error('Error ejecutando la consulta', error);
        handleError(res,error)    
    }
};
/*
static loginUser = async (req, res) => {
    const { email, password } = req.body;



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

    

      const token= tokenService.generateToken(user.id,user.correo,user.rol)
      
        // Generar un código aleatorio
        const randomCode = randomBytes(8).toString('hex'); // Genera un código aleatorio de 8 caracteres

        // Insertar registro de inicio de sesión en la base de datos
        UserModel.insertLoginRecord( user.id, randomCode)
       
         // Emitir una notificación a todos los usuarios conectados
         const message = `${user.correo} ha iniciado sesión.`; // Personaliza el mensaje
         notificationService.notifyClients(message); // Llama a la función de notificación

        // Devolver la respuesta con el token
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (error) {
        console.error('Error ejecutando la consulta:', err);
        handleError(res,error)    
    }
};
*/


static getPerfil = async (req, res) => {
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

    } catch (error) {
        console.error('Error obteniendo el perfil:', error);
        handleError(res,error)    
    }
};


static getUserPerfil= async (req,res) => {
    console.log('req.params:', req.params);
const {id} = req.params;
    

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

    } catch (error) {
        console.error('Error obteniendo el perfil:', error);
        handleError(res,error)    
    }

}


static getLoginHistory = async (req,res)=>{
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
        handleError(res,error)    
    }
}


static getUsersWithPagination = async (req,res)=>{
    const {page= 1,limit=10}= req.query
    const offset= (page - 1 ) * limit;
    
    try {
        const result = await UserModel.getUsersWithPagination(limit,offset);
        res.status(200).json(result)

    } catch (error) {
        console.error('Error al obtener la paginacion',error)
        handleError(res,error)    
    }
}





static addMultipleUsers = async (req, res) => {
    // Convierte users de string a objeto
    console.log('full body',req.body)
    // Convierte users de string a objeto
    let users;
    if (typeof req.body.users === 'string') {
       // Convierte users de string a objeto si viene de form-data
       try {
           users = JSON.parse(req.body.users || '[]');
       } catch (error) {
           return res.status(400).json({ error: 'Invalid JSON format for users' });
       }
   } else {
       // Si ya es un array (JSON puro)
       users = req.body.users || [];
   }

   // const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;

    console.log(users);

    if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Users must be an array' });
    }

    const errors = [];
    const createdUsers = [];
    const usersToInsert = [];


    try {

        for (const user of users) {
            const { name, apellido, cedula, email, password,rol } = user;

            if (!name || !apellido || !email || !password) {
                errors.push({ error: 'Nombre, apellido, correo y contraseña son requeridos', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            if (password.length < 7) {
                errors.push({ error: 'La contraseña debe tener al menos 7 caracteres', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            const existingUser = await UserModel.existingCedula(cedula);

            if (existingUser) {
                errors.push({ error: 'El usuario ya existe', name });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            const imagePath = req.files[0] ? req.files[0].filename : null; // Solo el nombre del archivo

            console.log(imagePath)

            const hashedPassword = await hash(password, 10);

            usersToInsert.push({
                name,
                apellido,
                cedula,
                email,
                hashedPassword,
                rol,
                imagen:imagePath
            });
        }

        if (usersToInsert.length > 0) {
            // Llama a la función de inserción de múltiples usuarios en el modelo
            const result = await UserModel.addMultipleUser(usersToInsert);
            createdUsers.push(...usersToInsert.map(user => ({ name: user.nombre }))); // Solo agregar nombres
        }

        if (errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201).json({ createdUsers });
        }

    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        handleError(res,error)    

    }
}


static deleteMultipleUsers= async (req,res)=>{
   const { users } = req.body


   if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Users must be an array' });
 }

 try {
    const deletePromises = users.map(user=>{
        const { id } = user
        return UserModel.deleteUser(id)
    })

    await Promise.all(deletePromises)
        
    res. status(200).json({ message:'Usarios eliminados exitosamente'})

    
 } catch (error) {
    handleError(res,error)    
}

}
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

static requestPasswordReset= async (req,res)=>{
  const { email }= req.body;

  const user = UserModel.findByEmail(email)

  if(!user){
    return res.status(404).send('Correo no encontrado')
  }
 
  const token = tokenService.generateToken(user.id,user.correo,user.rol,'1h')

  const emailSent = await emailService.sendEmail(email,'Password Reset',`You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://localhost:3001/resetPassword/${token}\n\n` +
              `If you did not request this, please ignore this email.\n`)
   

              if (!emailSent) {
                return res.status(500).send('Error sending email');
            }
    
            res.status(200).send('Recovery email sent');

}


static resetPassword= async (req,res)=>{
    const { token }  = req.params;
    const {newPassword} = req.body;

    try {

        const userId= await tokenService.verifyToken(token);
        
        if(!userId){
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await hash(newPassword, 10);

        await UserModel.updateUserPassword(userId,hashedPassword)

       return res.status(200).json({ message: 'Password has been reset successfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });    
    }
}
}


export default userController
