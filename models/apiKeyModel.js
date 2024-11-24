import { query } from "../db/db1.js";


const apiKeyModel ={

 async saveApiKey(apiKey,userId) {
    const result = await query(`INSERT INTO api_keys (id_usuario,apiKey,revoked,status) VALUES (?,?,0,'active')`,
         [userId,apiKey]);
    return result;
    
 },

 async getApiKey(userId) {
   const result = await query(`SELECT apikey FROM api_keys WHERE  id_usuario = ?`, [ userId]);

   // Verificar si se encontró un resultado
   if (result.length > 0) {
       return result[0].apikey; // Devuelve el valor de apikey como una cadena
   }
   return null; // Devuelve null si no se encuentra la API key
}

}

export default apiKeyModel;