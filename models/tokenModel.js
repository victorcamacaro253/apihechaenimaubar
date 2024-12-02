import { query } from "../db/db1.js";

const tokenModel={


    async saveRefreshToken(UserId,token,expiresIn){
        const sql = 'INSERT INTO refresh_tokens (id_usuario,  token,expiresIn,revoked) VALUES (?, ?, ?,0)';
        const result= await query(sql,[UserId,token,expiresIn])
        return result

    },

    async revocateToken(token){
        const sql = 'UPDATE refresh_tokens SET revoked = true WHERE token= ?'
        const result= await query(sql,[token])
        return result
    },

  async verifyTokenExist(token, id) {
  const sql = 'SELECT * FROM refresh_tokens WHERE token = ? AND id_usuario = ? AND revoked = 0';
  try {
    const result = await query(sql, [token, id]);
    return result;
  } catch (error) {
    console.error('Error verifying token exist:', error);
    throw error;
  }
}

}

export default tokenModel;