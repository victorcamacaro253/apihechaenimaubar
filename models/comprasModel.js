import { query } from '../db/db1.js';

const comprasModel= {



    async getCompras(){
        const result= await query('SELECT * FROM compras  INNER JOIN usuario ON compras.id_usuario=usuario.id')
        return result;
    },
    async getTotalCompras(){
      const result= await query('SELECT total_compra as Total FROM compras  INNER JOIN usuario ON compras.id_usuario=usuario.id')
      return result;
  },

    async getUserCompras(id){
      const result = await query('SELECT * FROM compras WHERE id_usuario= ?',[id])
      return result
    },

    async getComprasDetails(){

        const SQL = `  SELECT 
        c.id_compra, 
        c.fecha, 
        c.total_compra,
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
  
  
   `;
  
   const results= await query(SQL)
  
   return results;
    },
    
    async getCompraById(id){
        const result= await query('SELECT * FROM compras INNER JOIN usuario ON compras.id_usuario=usuario.id WHERE compras.id_compra=?',[id]);

        return result;
    },

async addCompra(connection,id_usuario,totalCompra){
    const [result]= await connection.query(' INSERT INTO compras (fecha, id_usuario,total_compra) VALUES (NOW(), ?,?)',
            [id_usuario,totalCompra])
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


  async getProductosCompras (connection,id_compra){
    const query = `SELECT p.nombre_producto, p.descripcion, p.precio, pc.cantidad
    FROM productos_compras pc
    JOIN productos p ON pc.id_producto = p.id_producto
    WHERE pc.id_compra = ?`
    const results = await connection.query(query, [id_compra]);
    return results;
    },

async deleteCompra(connection,id){

    const result = await connection.query('DELETE FROM compras WHERE id_compra=?',[id])
        return result;
    
},

async deleteProductoCompra(connection,id){
  const result = await connection.query('DELETE FROM productos_compras WHERE id_producto=?',[id])
    return result;
    },

async findByDateRange (startDate, endDate){
    const SQL = `
         SELECT 
      c.id_compra, 
      c.fecha, 
      c.total_compra,
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

        WHERE fecha BETWEEN ? AND ?
    `;
    const results = await query(SQL, [startDate, endDate]);
    return results;
},

async getComprasByUserId(id){

 const SQL = `  SELECT 
      c.id_compra, 
      c.fecha, 
      c.total_compra,
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

    const SQL= ` SELECT 
      c.id_compra, 
      c.fecha,
      c.total_compra, 
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
      u.nombre = ?;`;
    const results= await query(SQL,[nombre])

    return results;
},

async findByDateRangeUserId (id,startDate,endDate){
  const SQL = `
  SELECT 
c.id_compra, 
c.fecha, 
c.total_compra,
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

 WHERE id_usuario =? AND fecha BETWEEN ? AND ?
`;
const results = await query(SQL,[id,startDate, endDate]);
return results;

},
  
async getEstadisticasCompras(userId, startDate, endDate) {
  let SQL = `SELECT 
              c.id_compra, 
              c.fecha, 
              c.total_compra,
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
            JOIN productos p ON mp.id_producto = p.id_producto
            JOIN compras c ON mp.id_compra = c.id_compra
            JOIN usuario u ON c.id_usuario = u.id
            WHERE 1=1`;

  const params = [];

  if (userId) {
    SQL += ` AND u.id = ?`;
    params.push(userId);
  }
  
  if (startDate) {
    SQL += ` AND c.fecha >= ?`;
    params.push(startDate); // Asumiendo que startDate ya está en formato 'YYYY-MM-DD HH:MM:SS'
  }

  if (endDate) {
    SQL += ` AND c.fecha <= ?`;
    params.push(endDate); // Asumiendo que endDate ya está en formato 'YYYY-MM-DD HH:MM:SS'
  }
 // console.log(params)

  try {
    const results = await query(SQL, params);
   // console.log(results)
    return results;
  } catch (error) {
    console.error('Error al obtener las estadísticas de compras:', error);
    throw error;  // Lanzamos el error para manejarlo donde se llama a la función.
  }
},

async getComprasCountByUsuario(){
  const sql = `SELECT u.id, u.nombre, COUNT(c.id_compra) AS cantidad_compras
   FROM usuario u LEFT JOIN compras c ON u.id = c.id_usuario  GROUP BY u.id, u.nombre;` 

   const result = await query(sql)
   return result
}

}
export default comprasModel;