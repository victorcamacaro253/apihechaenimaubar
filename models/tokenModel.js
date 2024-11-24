import { query } from "../db/db1.js";

const  tokenModel = {

    async saveRefreshToken(UserId,token,expiresIn){

        const sql = 'INSERT INTO refresh_tokens (id_usuario,token,expiresIn,revoked) values (?,?,?,0)'
        const result = await query(sql,[UserId,token,expiresIn])
            return result
        
    },

    async  revocateToken (saveRefreshToken){
        const sql =   'UPDATE refresh_tokens SET revoked = TRUE WHERE token = ?'
        const values = [saveRefreshToken]
        return await query(sql, values)
          },
        
          async verifyExistingToken (refresh,id){
            const sql = 'SELECT * FROM refresh_tokens WHERE token=? AND id_usuario=? AND revoked = FALSE'
            const result= await query(sql,[refresh,id])
            return result
          }

}

export default tokenModel