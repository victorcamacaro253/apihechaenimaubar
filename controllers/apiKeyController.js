import apiKeyModel from '../models/apiKeyModel.js';
import apiKeyService from '../services/apiKeyService.js';

class apiKey {

static getApiKey = async (req,res)=>{
    const id = req.user.id

    try {
        const apiKey = apiKeyService.generateApiKey();
        console.log('key',apiKey)

        const hashKey = await apiKeyService.hashKey(apiKey)

        console.log('hash',hashKey)

        await apiKeyModel.saveApiKey(hashKey,id)

        return res.status(200).json({message: `API Key generated successfully`, apiKey: apiKey})


}catch(error){
    console.error(error)
    return res.status(500).json({message: 'Error generating API Key'})

}


}
}
export default apiKey;
