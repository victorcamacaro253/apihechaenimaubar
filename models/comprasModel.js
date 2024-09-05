

const comprasModel= {

async addCompra(connection,id_producto,cantidad,id_usuario){
    const [result]= await connection.query(' INSERT INTO compras (id_producto, cantidad, fecha, id_usuario) VALUES (?, ?, NOW(), ?)',
            [id_producto, cantidad, id_usuario])
            return result;

},

async getProductStock(connection,id_producto){
    const [result] = await connection.query('SELECT stock FROM productos WHERE id_producto = ?',[id_producto]);
    return result[0].stock;

},

async updateProductStock(connection,id_producto,newStock){
 const result = await connection.query('Update productos SET stock=? WHERE id_producto=?',[newStock,id_producto])
 return result;
}



}
export default comprasModel;