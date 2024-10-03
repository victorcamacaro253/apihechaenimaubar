import jwt from 'jsonwebtoken'

const generateToken=(UserId)=>{
   
  // Generar un token JWT
  const token = jwt.sign(
    { id: UserId},
    process.env.JWT_SECRET, // Asegúrate de tener JWT_SECRET en tus variables de entorno
    { expiresIn: '1h' } // Expiración del token, por ejemplo, 1 hora
);

return token;
}

const verifyToken=(token)=>{
     try{

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  return decode.id; //Retorna el id del usuario 
}catch(error){
    return null  
  }

}

export default {generateToken,verifyToken }