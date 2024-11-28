import crypto from 'crypto'
import { hash, compare } from 'bcrypt';



const generateApiKey = ()=>{
    const apiKey = crypto.randomBytes(16).toString('hex')

    return apiKey
}


const hashKey = async  (key) => {
   
    const hashKey = await  hash(key, 10);
  
    return hashKey
  
      }
      

      
      const  verifyApiKey= async (providedApiKey, storedHash)=> {
        const isMatch = await compare(providedApiKey, storedHash);
        if (!isMatch) {
          throw new Error('Invalid API key');
        }
        return true;
      }
      
  

export default {generateApiKey,hashKey,verifyApiKey}