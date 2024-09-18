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

    async existingProduct(nombre_producto) {
        try {
            const results = await _query(
                'SELECT nombre_producto FROM productos WHERE nombre_producto = ?',
                [nombre_producto]
            );
            
            // Si el arreglo `results` contiene al menos un resultado, retorna `true`, si no, retorna `false`
            return results.length > 0;
        } catch (error) {
            console.error('Error en la consulta de productos:', error);
            throw new Error('Error en la consulta de productos');
        }
    },

    async addProduct(codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) {
        const results = await _query(
            'INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor]
        );
        return results;
    },

    async deleteProduct(id){
        const result = await _query('DELETE FROM productos WHERE id_producto = ?',[id])
        return result.affectedRows;
    },
    
      
async updateProduct(id, updateFields, values) {

    //construir la parte de SET para la consulta , añadiendo un signo de interrogacion para cada campo
    const setClause= updateFields.map(field => `${field} = ? `).join(', '); 

    // Construir la consulta SQL
    const query = `UPDATE productos SET ${setClause} WHERE id_producto = ?`;

    // Añadir el ID al final de los valores
    const finalValues = values.concat(id);

    // Ejecutar la consulta
    const results = await _query(query, finalValues);

    return results; // Retornar el resultado de la consulta
},

async searchProductByName(nombre_producto) {
    
    const results= await _query('SELECT * FROM productos WHERE nombre_producto = ?',[nombre_producto]);
    return results;
},

async updateProductStock(id_producto,newStock){
    const results = await _query('UPDATE productos SET stock = stock - ? WHERE id_producto=?',[newStock,id_producto]);
    return results;
},
async getProductStock(connection,id_producto){
    const [result] = await connection.query('SELECT stock FROM productos WHERE id_producto = ?',[id_producto]);
    return result[0].stock;

}

};


export default ProductModel;
