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

/*
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
  */


const compraProduct = async (req, res) => {
  const { id_usuario, productos } = req.body;

  if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'El usuario y al menos un producto son requeridos' });
  }

  // Validar productos
  for (const producto of productos) {
    const { id_producto, cantidad, precio } = producto;
    if (!id_producto || !cantidad || !precio || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
      return res.status(400).json({ error: 'Datos de producto inválidos' });
    }
  }

  // Iniciar transacción
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Verificar stock y preparar datos para inserción
    const insertProductos = [];
    for (const producto of productos) {
      const { id_producto, cantidad, precio } = producto;
      const stock = await ProductModel.getProductStock(connection, id_producto);

      if (stock < cantidad) {
        await connection.rollback(); // Deshacer la transacción
        return res.status(400).json({ error: 'Stock insuficiente para el producto con id ' + id_producto });
      }

      insertProductos.push(producto);
    }

    // Insertar la compra
    const id_compra = await comprasModel.addCompra(connection, id_usuario);


    console.log(id_compra)

    // Insertar productos en la compra
    await comprasModel.compraProduct(connection, id_compra, insertProductos);

    // Actualizar el stock del producto
    for (const producto of insertProductos) {
      const { id_producto, cantidad } = producto;
      const stock = await ProductModel.getProductStock(connection, id_producto);
      const newStock = stock - cantidad;
      await ProductModel.updateProductStock(connection, id_producto, newStock);
    }

    // Confirmar la transacción
    await connection.commit();

    res.status(201).json({ id_compra, message: 'Compra realizada con éxito' });

  } catch (err) {
    console.error('Error ejecutando la transacción:', err);
    await connection.rollback(); // Deshacer la transacción en caso de error
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    // Liberar la conexión
    connection.release();
  }
};

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

const getComprasByDate = async (req, res) => {
  const { startDate, endDate } = req.query; // Obtener fechas desde los parámetros de consulta

  // Validar las fechas
  if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Se requieren startDate y endDate' });
  }

  // Formatear las fechas (asegúrate de que el formato sea el correcto según tu base de datos)
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
      return res.status(400).json({ error: 'Fechas inválidas' });
  }

  try {
      // Consultar la base de datos para obtener las compras en el rango de fechas
      const compras = await compraModel.findByDateRange(formattedStartDate, formattedEndDate);
      res.status(200).json(compras);
  } catch (error) {
      console.error('Error obteniendo compras por fecha:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export default {getCompras,compraProduct,deleteCompra,getCompraById,getComprasByDate};