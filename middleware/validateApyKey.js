import apiKeyModel from "../models/apiKeyModel.js";
import { hash, compare } from 'bcrypt';


const validateApiKey = async  (req,res,next)=>{
    const apiKey = req.header['x-api-key'] || req.query.apiKey;
    if(!apiKey){
        return res.status(401).send({error: 'No API key provided'});
    }
console.log('apikey',apiKey)
    const hashkey = await apiKeyModel.getApiKey(req.user.id,apiKey)
    console.log('hash',hashkey)

    const comparel = await compare(apiKey,hashkey)

    if (!comparel) {
        return res.status(401).json({ message: 'Invalid API key' });
      }
  
      next()

}

export default validateApiKey;