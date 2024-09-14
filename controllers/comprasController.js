import { pool } from '../db/db1.js'; // Asegúrate de que 'pool' es una instancia de conexión que soporte promesas
import comprasModel from '../models/comprasModel.js';
import ProductModel from '../models/productModel.js';


const getCompras= async (req,res)=>{
  try {
    const result = await comprasModel.getAllCompras();


    res.json(result)
  } catch (error) {
    console.error('Error',error)
    res.status(500).json({message:'Error interno del servidor',error})
  }

 
}

  const compraProduct= async (req,res)=>{

  const {id_usuario,productos} =req.body


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

const connection = await pool.getConnection();
  
   try { 
    
      // Verificar stock y preparar datos para inserción
      const insertProductos = [];
      for (const producto of productos) {
        const { id_producto, cantidad, precio } = producto;
        const stock = await ProductModel.getProductStock(connection,id_producto);

        if (stock < cantidad) {
          await connection.rollback(); // Deshacer la transacción
          return res.status(400).json({ error: 'Stock insuficiente para el producto con id ' + id_producto });
        }
  
        insertProductos.push(producto);
      }
  
         // Insertar la compra
    const result = await comprasModel.addCompra(id_usuario);
   const id_compra= result.insertId;
  console.log(id_compra)

  
  

  console.log(insertProductos);
  if (typeof id_compra !== 'number' && typeof id_compra !== 'string') {
  throw new Error('id_compra must be a number or string');
}


    await comprasModel.compraProduct(id_compra, insertProductos);

    
    // Actualizar el stock del producto
    for (const producto of insertProductos) {
      const { id_producto, cantidad } = producto;
      const stock = await ProductModel.getProductStock(connection, id_producto);
      const newStock = stock - cantidad;
      await ProductModel.updateProductStock(id_producto, newStock);
    }
  

    

      res.status(201).json({ id_compra, message: 'Compra realizada con éxito' });
  

  } catch(err) {
    console.error('Error ejecutando la transacción:', err);
// Deshacer la transacción en caso de error
    res.status(500).json({ error: 'Error interno del servidor' });    
  }


  
}

const deleteCompra = async (req,res) =>{
   const {id} = req.params
   try{

   const result= await comprasModel.deleteCompra(id);
    
   if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'compra no encontrado' });
}

res.status(200).json({ message: 'Compra eliminado exitosamente' });

   }catch(err){
    console.error('Erro ejecutando la consulta',err);
    res.json(500).json({error:'Error interno del servidor'})
   }
}


const getComprasByUsuarioId= async (req,res) =>{
  const { id } = req.params;

  try{

    const results = await comprasModel.getComprasByUsuarioId(id)
    
     
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(results)

  }catch(err){
    console.error('Erro ejecutando la consulta',err);
    res.json(500).json({error:'Error interno del servidor'})
  }
}


const getComprasByUsuario= async (req,res) =>{
const {usuario} = req.query;

try {
  const result= await comprasModel.getComprasByUsuario(usuario);
  
  res.json(result)
} catch (error) {
  console.error('Erro ejecutando la consulta',err);
  res.json(500).json({error:'Error interno del servidor',err})
}
}

export default {compraProduct,deleteCompra,getCompras,getComprasByUsuarioId,getComprasByUsuario};