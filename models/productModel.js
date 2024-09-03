import { query as _query } from '../db/db1.js';

const ProductModel = {

    async getAllProducts() {
        const results= await _query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor');
        return results;
    },

    async getProductById(id) {
        const results = await _query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor WHERE id_producto = ?', [id]);
        return results;
    },

    async existingProduct(connection,nombre_producto){
    const results= await connection.query('SELECT nombre_producto FROM productos WHERE nombre_producto = ?',[nombre_producto])
    return results;
    },

    async addProduct(connection,codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) {
        const [results] = await connection.query(
            'INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor]
        );
        return results;
    },

    async deleteProduct(id){
        const result = await _query('DELETE FROM productos WHERE id_producto = ?',[id])
        return result.affectedRows;
    },
    
      // Modelo: updateUser
async updateProduct(id, updateFields, values) {
    // Construir la consulta SQL
    const query = `UPDATE productos SET ${updateFields.join(', ')} WHERE id_producto = ?`;

    // Añadir el ID al final de los valores
    const finalValues = values.concat(id);

    // Ejecutar la consulta
    const results = await _query(query, finalValues);

    return results; // Retornar el resultado de la consulta
},

     

};

export default ProductModel;
