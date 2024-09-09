import { pool } from '../db/db1.js'; // Asegúrate de que 'pool' es una instancia de conexión que soporte promesas
import comprasModel from '../models/comprasModel.js';
import ProductModel from '../models/productModel.js';
import httpHelpers from '../helpers/httpHelper.js';



 const getCompras= async (req,res) =>{
 
  try {
    
    const result = await comprasModel.getCompras();

    // httpHelpers.successResponseWithData(res, 'Compras obtenidas exitosamente', result);
     res.status(200).json(result)

  } catch (error) {
    console.error('Error ejecutando la consulta',error)
 res.status(500).json({error:'Error interno del servidor'});
  // httpHelpers.errorResponse(res, 'Error interno del servidor'); // Usar el helper
 
  }

 }

 const getCompraById= async (req,res) =>{
 const {id}= req.params;

 try {
  const result= await comprasModel.getCompraById(id);

  if (result.length === 0) {
    // Usuario no encontrado, responde con un error 404
    return res.status(404).json({ 
        error: 'compra no encontrado', 
        message: `No se pudo encontrar la compra con el ID proporcionado: ${id}` 
    });
}

res.json(result);
  
 } catch (error) {  
  console.error('Error ejecutando la consulta',error)
  res.status(500).json({error:'Error interno del servidor'});
  
 }
 }


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
    
    const stock = await ProductModel.getProductStock(connection, id_producto);

    if(stock< cantidadNum){
        await connection.rollback(); // Deshacer la transacción
        return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const addCompra = comprasModel.addCompra(connection,id_producto,cantidadNum,id_usuario)

    const newStock =stock - cantidadNum;
    await ProductModel.updateProductStock(connection,id_producto,newStock);

    await connection.commit();

    res.status(201).json({ id_compra: addCompra.insertId, message: 'Compra realizada con éxito' });


  } catch (err) {
    console.error('Error ejecutando la transacción:', err);
    await connection.rollback(); // Deshacer la transacción en caso de error
    res.status(500).json({ error: 'Error interno del servidor' });    
  }


  
}


const deleteCompra = async (req,res) => {
 const { id } = req.params;

 try {

  const result = await comprasModel.deleteCompra(id);

  if(result.affectedRows==0){
    return res.status(404).json(({message:'Compra no encontrada'}))
  }

  res.status(200).json({message:'compra eliminada exitosamente'})
  
 } catch (err) {
  console.error('Error ejecutando la consulta',err)
  res.status(500).json({erro:'Error interno del servidor'});
  
 }
}


export default {getCompras,compraProduct,deleteCompra,getCompraById};