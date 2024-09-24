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



  
};

export default ProductModel;
