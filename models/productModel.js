import { query } from '../db/db1.js';

const ProductModel = {

    async getAllProducts() {
        const results = await query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor');
        return results;
    },

    async getProductById(id) {
        const results = await query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor WHERE id_producto = ?', [id]);
        return results;
    },
    async existingProduct(connection,nombre_producto){
        const result = await connection.query('SELECT nombre_producto FROM productos WHERE nombre_producto = ?', [nombre_producto])
        return result;
         
    },

    async addProduct(connection,codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor,imagePath) {
        const [results] = await connection.query(
            'INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor,imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
            [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor,imagePath]
        );
        return results;
    },

    async deleteProduct(id){
        const result = await query('DELETE  FROM productos WHERE id_producto=?',[id])
            return result;
        

    },
    
async getProductStock(connection,id_producto){
    const [result] = await connection.query('SELECT stock FROM productos WHERE id_producto = ?',[id_producto]);
    return result[0].stock;

}, 

async updateProductStock(connection,id_producto,newStock){
    const result = await connection.query('Update productos SET stock=? WHERE id_producto=?',[newStock,id_producto])
    return result;
   },

   async getProductsByCategoria(categoria){
    const result= await query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor WHERE categoria=?',[categoria])
   return result;   
},

async getProductsByPrinceRange(min,max){
    const result= await query('SELECT * FROM productos WHERE precio BETWEEN ? AND ?',[parseFloat(min),parseFloat(max)])
    return result;
},
async addMultipleProducts (connection, products) {
    const queries = products.map((product) => {
        const { codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagePath } = product;

        return connection.query('INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagen) VALUES (?,?,?,?,?,?,?,?,?)',
            [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagePath || '']
        )
    })

    const result = await Promise.all(queries);
    return result;
},


async importProducts(products){
  const queries = products.map((product) => {
    const { codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagePath } = product;

    return query('INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagen) VALUES (?,?,?,?,?,?,?,?,?)',
        [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor, imagePath || '']
    )
})

const result = await Promise.all(queries);
return result;
},

/*
async filterProducts(filters){

  const conditions = {
    category:'category=?',
    minPrice:'price>= ?',
    maxPrice:'price <= ?',

  }

  let query = 'SELECT * FROM  productos WHERE 1=1';
  const params =[]

  Object.keys(filters).forEach(key => {
    if (conditions[key]) {
      query += ` AND ${conditions[key]}`;
      params.push(filters[key]);
    }
  });

  const [rows] = await query(query, params);
  return rows;

}

*/
async filterProducts ( category, minPrice, maxPrice ) {
    let queryl = 'SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria=categorias.id_categoria WHERE 1=1';
    const params = [];                      
  
    if (category) {
      queryl += ' AND categorias.categoria = ?';
      params.push(category);
    }
    if (minPrice) {
      queryl += ' AND precio >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      queryl += ' AND precio <= ?';
      params.push(maxPrice);
    }
  
    const rows = await query(queryl, params);
    return rows;
  },

  
 async getTopSelling(){

  let SQL = 'SELECT id_producto, nombre_producto, precio,vendido FROM productos ORDER BY vendido DESC';
  const rows = await query(SQL);
  return rows;

 },

 
async actualizarProductosMasVendidos(id,cantidad){
  const SQL = ` Update  productos set vendido = vendido +  ? WHERE id_producto = ?`;
  const results = await query(SQL,[cantidad,id]);
  return results;
},

async getProductsSoldByDateRange (startDate,endDate){
const SQL= `SELECT 

        p.id_producto, 
        p.nombre_producto,
         p.precio AS precio_producto, 
         SUM(pc.cantidad) AS total_vendido,
          SUM(pc.cantidad * p.precio) AS total_ingresos 
          FROM 
          productos_compras pc 
          JOIN 
          compras c ON pc.id_compra = c.id_compra
           JOIN 
           usuario u ON c.id_usuario = u.id 
           JOIN 
           productos p ON pc.id_producto = p.id_producto
            WHERE 
            c.fecha BETWEEN ? AND ?
             GROUP BY
              p.id_producto, p.nombre_producto, p.precio 
             ORDER 
             BY total_vendido DESC;`

             const result= await query(SQL,[startDate,endDate])

             return result
}




};

export default ProductModel;
