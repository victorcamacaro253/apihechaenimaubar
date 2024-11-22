//import authModel from '../models/authModel.js'
import UserModel from '../models/userModels.js';
import { hash, compare } from 'bcrypt';
import tokenService from '../services/tokenService.js';
import notificationService from '../services/notificationService.js';
import handleError from '../utils/handleError.js';
import {randomBytes} from 'crypto';
import tokenModel from '../models/tokenModel.js';
import { decode } from 'punycode';


class authentication {
    static loginUser = async (req, res) => {
        const { email, password } = req.body;
    
    console.log(req.body)
    
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
    
        
    
          const token= tokenService.generateToken(user.id,user.correo,user.rol,'1h')

          const refreshToken = tokenService.generateToken(user.id,user.correo,user.rol,'7d')

          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // Expira en 7 días

          const saveRefreshToken = await tokenModel.saveRefreshToken(user.id,refreshToken,expiresAt)

          
           // Configurar el refresh token como una cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // No accesible por JavaScript en el navegador
            secure: process.env.NODE_ENV === 'production', // Solo en producción
            sameSite: 'Strict', // Protección contra CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
        });

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
                token,
                refreshToken
            });
    
        } catch (error) {
            console.error('Error ejecutando la consulta:', error);
            handleError(res,error)    
        }
    };

    
static logoutUser = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({error:'No refresh token provided'})
    }

    try {
        const decoded = tokenService.verifyToken(refreshToken)
        if(!decoded){
            return res.status(403).json({error:'Invalid or expired refresh token'})
        }

        const result= await tokenModel.revocateToken(refreshToken)

        if(result.length===0){
            return res.status(404).json({error:'Refresh token not found'})
        }
        
  // Eliminar la cookie del refresh token
  res.clearCookie('refreshToken', {
    httpOnly: true,  // Asegura que la cookie no pueda ser accesible por JavaScript
    secure: process.env.NODE_ENV === 'production',  // Solo en producción si usas HTTPS
    sameSite: 'Strict',  // Protege contra ataques CSRF
});

 // Responder con un mensaje de éxito
 res.status(200).json({ message: 'Logout exitoso' });
        
    } catch (error) {
        console.error('Error al ejecutar logout:', error);
        res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.' });
    }
}

//Funcion para generar un nuevo access token con el refreshToken
static refreshToken = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(400).json({error:'No refresh token provided'})
        }
        try {
            const decoded = tokenService.verifyToken(refreshToken)
            if(!decoded){
                return res.status(403).json({error:'Invalid or expired refresh token'})
                }


                const user= await UserModel.getUserById(decoded.id)

                if(!user){
                    return res.status(404).json({error:'User not found'})
                    }


              const tokenRecord= await tokenModel.verifyToken(refreshToken,decoded.id)

              
        if (tokenRecord.rowCount === 0) {
            return res.status(403).json({ error: 'Invalid or revoked refresh token' });
        }


             /*   const result = await tokenModel.revocateToken(refreshToken)
                if(result.length===0){
                    return res.status(404).json({error:'Refresh token not found'})
                    } */
                    const newAccessToken = tokenService.generateToken(decoded.id,decoded.correo,decoded.rol,'1h')
                    
                    
                        res.json({ 
                            accessToken: newAccessToken
                        })
                        } catch (error) {
                            console.error('Error al generar nuevo access token:', error)
                            res.status(500).json({error:'Error interno del servidor. Intenta de nuevo'})
                            }
                        }
    
}

export default authentication