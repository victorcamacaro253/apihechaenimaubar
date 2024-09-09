import { query } from '../db/db1.js';

const comprasModel= {



    async getCompras(){
        const result= await query('SELECT * FROM compras INNER JOIN productos ON compras.id_producto=productos.id_producto INNER JOIN usuario ON compras.id_usuario=usuario.id')
        return result;
    },

    
    async getCompraById(id){
        const result= await query('SELECT * FROM compras INNER JOIN productos ON compras.id_producto=productos.id_producto INNER JOIN usuario ON compras.id_usuario=usuario.id WHERE compras.id_compra=?',[id]);

        return result;
    },

async addCompra(connection,id_producto,cantidad,id_usuario){
    const [result]= await connection.query(' INSERT INTO compras (id_producto, cantidad, fecha, id_usuario) VALUES (?, ?, NOW(), ?)',
            [id_producto, cantidad, id_usuario])
            return result;

},



async deleteCompra(id){

    const result = await query('DELETE FROM compras WHERE id_compra=?',[id])
        return result;
    
}

}
export default comprasModel;