import { query } from '../db/db1.js';

const comprasModel= {

async addCompra(connection,id_producto,cantidad,id_usuario){
    const [result]= await connection.query(' INSERT INTO compras (id_producto, cantidad, fecha, id_usuario) VALUES (?, ?, NOW(), ?)',
            [id_producto, cantidad, id_usuario])
            return result;

},



async deleteCompra(id){

    const result = await query('DELETE FROM productos ')
}

}
export default comprasModel;