import { query } from '../db/db1.js';

const comprasModel= {


    async getAllCompras(){

        const result= await query('SELECT * FROM compras INNER JOIN usuario ON compras.id_usuario = usuario.id');
        return result;
    },

    async getComprasByUsuarioId(id){
        const result= await query('SELECT * FROM compras  INNER JOIN usuario ON compras.id_usuario = usuario.id WHERE id_usuario= ? ',[id])
        return result;
    },

    async getComprasByUsuario(usuario){
        const result= await query('SELECT * FROM compras  INNER JOIN usuario ON compras.id_usuario = usuario.id WHERE usuario.nombre = ? ',[usuario])
        return result;
    },


    async addCompra(id_usuario) {
        try {
            const result = await query(
                'INSERT INTO compras (fecha, id_usuario) VALUES (NOW(), ?)',
                [id_usuario]
            );
            return result; // Devuelve el ID de la compra recién insertada
        } catch (err) {
            console.error('Error al insertar la compra:', err);
            throw err; // Lanzar el error para que sea manejado más adelante
        }
    },


    async compraProduct(id_compra, productos) {
        const params = productos.flatMap(producto => [id_compra, producto.id_producto, producto.cantidad, producto.precio]);
        await query(`INSERT INTO productos_compras (id_compra, id_producto, cantidad, precio) VALUES ${productos.map(() => '(?,?,?,?)').join(', ')}`, params);
      },




      
async deleteCompra(id){

    const result = await query('DELETE FROM compras where id_compra= ? ',[id])
    return result;
}

}
export default comprasModel;