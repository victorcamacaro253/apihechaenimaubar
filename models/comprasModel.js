import { query } from '../db/db1.js';

const comprasModel= {



    async getCompras(){
        const result= await query('SELECT * FROM compras  INNER JOIN usuario ON compras.id_usuario=usuario.id')
        return result;
    },

    
    async getCompraById(id){
        const result= await query('SELECT * FROM compras INNER JOIN productos ON compras.id_producto=productos.id_producto INNER JOIN usuario ON compras.id_usuario=usuario.id WHERE compras.id_compra=?',[id]);

        return result;
    },

async addCompra(connection,id_usuario){
    const [result]= await connection.query(' INSERT INTO compras (fecha, id_usuario) VALUES (NOW(), ?)',
            [id_usuario])
      return result.insertId; 

},
/*
async compraProduct(connection,id_compra, id_producto, cantidad, precio){
    const result= await connection.query(' INSERT INTO productos_compras (id_compra, id_producto,cantidad,precio) VALUES (?, ?, ?, ?)',
        [id_compra, cantidad,id_producto,precio])
        return result;

},

*/
 // Agregar productos a la compra
  async compraProduct(connection, id_compra, productos) {
    const query = 'INSERT INTO productos_compras (id_compra, id_producto, cantidad, precio) VALUES ?';
    const values = productos.map(producto => [id_compra, producto.id_producto, producto.cantidad, producto.precio]);
    await connection.query(query, [values]);
  },

async deleteCompra(id){

    const result = await query('DELETE FROM compras WHERE id_compra=?',[id])
        return result;
    
},

async findByDateRange (startDate, endDate){
    const SQL = `
        SELECT * FROM compras 
        WHERE fecha BETWEEN ? AND ?
    `;
    const results = await query(SQL, [startDate, endDate]);
    return results;
}



}
export default comprasModel;