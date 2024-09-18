import { query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import crypto from 'crypto'; // Importa crypto si lo necesitas
//import ProductModel from '../models/productModel.js';
import ProductModel from '../models/firebase/ProductModel_firebase.js'



const getProducts = async (req,res)=>{
    res.header('Access-Control-Allow-Origin','*')

    try{
        const results = await ProductModel.getAllProducts();

        res.json(results)

    }catch(err){
     console.error("Error en la  consulta",err)
     res.status(500).json({message:"error interno del servidor"})
    }

}



const getProductsById = async (req,res) =>{
    const {id} = req.params

    try{
        const results =  await ProductModel.getProductById(id)
        
        if(results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(results)
    }catch(err){
      
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}




const addProduct = async (req,res)=>{

    const { nombre_producto, descripcion, precio,stock,id_categoria,activo = "activo",id_proveedor } = req.body;

    if (!nombre_producto || !descripcion || !precio || !stock ||!id_categoria) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const precioNum = parseFloat(precio);
    const stockNum = Number(stock, 10);

    if (isNaN(precioNum) || !Number.isFinite(precioNum) || precioNum < 0) {
        return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: 'El stock debe ser un número entero positivo' });
    }

    const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();


    
    // Iniciar transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Verificar si el usuario ya existe
        const [existingProduct] =  await ProductModel.existingProduct(connection,nombre_producto)
        if (existingProduct.length > 0) {
            console.log('Resultado de la consulta existente:', existingProduct);
            await connection.rollback(); // Deshacer la transacción

            return res.status(400).json({ error: 'Producto ya existe' });

        }

        
        

        // Consulta SQL para insertar el iproducto
        const results = await ProductModel.addProduct(connection,codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor)

        // Confirmar transacción
        await connection.commit();

        res.status(201).json({ id: results.insertId, nombre_producto });
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        await connection.rollback(); // Deshacer la transacción en caso de error
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        connection.release(); // Liberar el connection pool
    }

}


const deleteProduct = async (req,res) =>{
const { id } = req.params

res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitudes OPTIONS para preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
}

   
   try{

    const result= await ProductModel.deleteProduct(id);

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });

   }catch(err){
    console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
   }
}

const updateProduct = async (req,res)=>{
    const { id } = req.params;
    const {nombre_producto,descripcion,precio,stock,id_categoria,activo,id_proveedor} = req.body;

   try{
    let updateFields = [];
    let values = [];

    if (nombre_producto) {
        updateFields.push('nombre_producto = ?');
        values.push(nombre_producto);
    }

    if (descripcion) {
        updateFields.push('descripcion = ?');
        values.push(descripcion);
    }

    if (precio) {
        updateFields.push('precio = ?');
        values.push(precio);
    }

    if (stock) {
        updateFields.push('stock = ?');
        values.push(stock);
    }
     
    if (id_categoria) {
        updateFields.push('id_categoria = ?');
        values.push(id_categoria);
    }

    if (activo) {
        updateFields.push('activo = ?');
        values.push(activo);
    }
    if (id_proveedor) {
        updateFields.push('id_proveedor = ?');
        values.push(id_proveedor);
    }

    const results = await ProductModel.updateProduct(id, updateFields,values);
    

    if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });

   }catch(err){
    console.error('Error ejecutando la consulta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
   }

}
const searchProductByName = async (req, res) => {
    const { nombre_producto } = req.query;

    if (!nombre_producto) {
        return res.status(400).json({ error: 'El nombre del producto es requerido' });
    }
    console.log(nombre_producto)

    try {
        const result = await ProductModel.searchProductByName( nombre_producto );

        if (result.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
       console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



export default {
    getProducts,
    getProductsById,
    addProduct,
    deleteProduct,
    searchProductByName,
    updateProduct

};