import { query } from '../db/db1';

const ProductModel = {

    async getAllProducts() {
        const [results] = await query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor');
        return results;
    },

    async getProductById(id) {
        const [results] = await query('SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN proveedor ON productos.id_proveedor = proveedor.id_proveedor WHERE id_producto = ?', [id]);
        return results.length ? results[0] : null;
    },

    async addProduct(codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) {
        const [results] = await query(
            'INSERT INTO productos (codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor]
        );
        return { id: results.insertId, nombre_producto };
    }
};

export default ProductModel;
