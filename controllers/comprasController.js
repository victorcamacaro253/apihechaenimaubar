import { pool } from '../db/db1.js'; // Asegúrate de que 'pool' es una instancia de conexión que soporte promesas
import comprasModel from '../models/comprasModel.js';

  const compraProduct= async (req,res)=>{

  const {id_producto,cantidad,id_usuario} =req.body

   if (!id_producto || !cantidad || !id_usuario) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
   }

   const cantidadNum = parseInt(cantidad, 10);

   if (isNaN(cantidadNum) || cantidadNum <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
   }

  // Iniciar transacción
   const connection = await pool.getConnection();
   await connection.beginTransaction();

   try { 
    
    const stock = await comprasModel.getProductStock(connection, id_producto);

    if(stock< cantidadNum){
        await connection.rollback(); // Deshacer la transacción
        return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const addCompra = comprasModel.addCompra(connection,id_producto,cantidadNum,id_usuario)

    const newStock =stock - cantidadNum;
    await comprasModel.updateProductStock(connection,id_producto,newStock);

    await connection.commit();

    res.status(201).json({ id_compra: addCompra.insertId, message: 'Compra realizada con éxito' });


  } catch (err) {
    console.error('Error ejecutando la transacción:', err);
    await connection.rollback(); // Deshacer la transacción en caso de error
    res.status(500).json({ error: 'Error interno del servidor' });    
  }


  
}


export default {compraProduct};