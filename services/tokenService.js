import jwt from 'jsonwebtoken'
import UserModel from '../models/userModels.js';
import { query } from '../db/db1.js';
/*
const generateToken=(UserId,email,role)=>{
   
  // Generar un token JWT
  const token = jwt.sign(
    { id: UserId,email:email,role:role},
    process.env.JWT_SECRET, // Asegúrate de tener JWT_SECRET en tus variables de entorno
    { expiresIn: '1h' } // Expiración del token, por ejemplo, 1 hora
);

return token;
}
*/

const generateToken = (UserId, email, role,expiresIn) => {
const payload= {id: UserId,email: email,rol: role}
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
return token

}

const verifyToken=(token)=>{
     try{

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  return decode.id; //Retorna el id del usuario 
}catch(error){
    return null  
  }

}




const saveRefreshToken =(id,token,expiresIn)=>{
const sql = 'INSERT INTO refresh_token (id_usuario,token,expiresIn) VALUES (?,?,?)';
const values = [id, token, expiresIn];
const result = query(sql, values)
return result
 
}
const revocateToken= (saveRefreshToken)=>{
const sql =   'UPDATE refresh_tokens SET revoked = TRUE WHERE refresh_token = $1'
const values = [saveRefreshToken]
return query(sql, values)
  }




export default {generateToken,verifyToken ,saveRefreshToken,revocateToken}