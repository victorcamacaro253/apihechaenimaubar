import { query } from '../db/db1.js';

const comprasModel= {



    async getCompras(){
        const result= await query('SELECT * FROM compras  INNER JOIN usuario ON compras.id_usuario=usuario.id')
        return result;
    },

    
    async getCompraById(id){
        const result= await query('SELECT * FROM compras INNER JOIN usuario ON compras.id_usuario=usuario.id WHERE compras.id_compra=?',[id]);

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
},

async getComprasByUserId(id){

 const SQL = `  SELECT 
      c.id_compra, 
      c.fecha, 
      u.id AS id_usuario, 
      u.nombre, 
      u.apellido, 
      u.cedula, 
      u.correo, 
      mp.id_producto, 
      mp.cantidad, 
      mp.precio,
      p.nombre_producto
    FROM 
      productos_compras AS mp 

      JOIN productos p ON  mp.id_producto = p.id_producto
    JOIN 
      compras c ON mp.id_compra = c.id_compra 
    JOIN 
      usuario u ON c.id_usuario = u.id 
    WHERE 
      c.id_usuario = ?;

 `;

 const results= await query(SQL,[id])

 return results;

},

async getComprasByUsername(nombre){

    const SQL= 'SELECT * FROM `productos_compras` as mp JOIN compras c ON mp.id_compra= c.id_compra JOIN usuario u ON c.id_usuario=u.id  WHERE u.nombre = ?';
    const results= await query(SQL,[nombre])

    return results;
}



}
export default comprasModel;