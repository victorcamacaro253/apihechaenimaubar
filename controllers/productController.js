import { query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import crypto from 'crypto'; // Importa crypto si lo necesitas
import ProductModel from '../models/productModel.js';
//import ProductModel from '../models/firebase/ProductModel_firebase.js'
import categoriasModel from '../models/categoriasModel.js'

class productController{

static getProducts = async (req,res)=>{
    res.header('Access-Control-Allow-Origin','*')

    try{
        const results = await ProductModel.getAllProducts();

        res.json(results)

    }catch(err){
     console.error("Error en la  consulta",err)
     res.status(500).json({message:"error interno del servidor"})
    }

}



static getProductsById = async (req,res) =>{
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




static addProduct = async (req,res)=>{

    const { nombre_producto, descripcion, precio,stock,id_categoria,activo = "activo",id_proveedor } = req.body;
    const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;



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
        console.log(nombre_producto)
        const existingProduct =  await ProductModel.existingProduct(nombre_producto)
        if (existingProduct) {
            console.log('Resultado de la consulta existente:', existingProduct);
            await connection.rollback(); // Deshacer la transacción

            return res.status(400).json({ error: 'Producto ya existe' });

        }
        
        const results = await ProductModel.addProduct(codigo, nombre_producto, descripcion, precio, stock, id_categoria, activo, id_proveedor,imagePath)

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


static deleteProduct = async (req,res) =>{
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

static updateProduct = async (req,res)=>{
    const { id } = req.params;
    const {nombre_producto,descripcion,precio,stock,id_categoria,activo,id_proveedor} = req.body;

   try{
    let updateFields = [];
    let values = [];

    if (nombre_producto) {
        updateFields.push('nombre_producto');
        values.push(nombre_producto);
    }

    if (descripcion) {
        updateFields.push('descripcion');
        values.push(descripcion);
    }

    if (precio) {
        updateFields.push('precio');
        values.push(precio);
    }

    if (stock) {
        updateFields.push('stock');
        values.push(stock);
    }
     
    if (id_categoria) {
        updateFields.push('id_categoria');
        values.push(id_categoria);
    }

    if (activo) {
        updateFields.push('activo');
        values.push(activo);
    }
    if (id_proveedor) {
        updateFields.push('id_proveedor');
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
static  searchProductByName = async (req, res) => {
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



static getProductsByCategoria=async(req,res)=>{
    const {categoria} = req.query
   
    try {
       const result = await ProductModel.getProductsByCategoria(categoria);
   
       if (result.length === 0) {
           return res.status(404).json({ message: 'No se encontraron productos en esta categoría.' });
       }
   
       return res.status(200).json(result);
       
    } catch (error) {
       console.error('Error ejecutando la consulta:', err);
       res.status(500).json({ error: 'Error interno del servidor' });
    }
   }
   
   
   static getProductsByPriceRange= async (req,res)=>{
       const {min,max} = req.query  
   
       if (isNaN(min) || isNaN(max)) {
           return res.status(400).json({message:'Los parametros min y max deben ser numeros '})
       }
   
       try {
       
     const result = await ProductModel.getProductsByPriceRange(min,max);
   
     if (result.length === 0) {
       return res.status(404).json({ message: 'No se encontraron productos en este rango de precio.' });
   }
   
    return res.json(result);
   
   
   
       } catch (error) {
           console.error('Error ejecutando la consulta:', err);
           res.status(500).json({ error: 'Error interno del servidor' });
       }
   }
   
   
   
static addMultipleProducts = async (req, res) => {
    const { products } = req.body;
    const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;

    console.log(products)

    if (!req.body || typeof req.body !== 'object' || !Array.isArray(req.body.products)) {
        return res.status(400).json({ error: 'Products must be an array' });
    }
    const errors = [];
    const createdProducts = [];
    

    try {

        const productsToInsert = []
        for (const product of products) {
            const {
                nombre_producto,
                descripcion,
                precio,
                stock,
                id_categoria,
                activo = 'activo',
                id_proveedor
            } = product;

            if (!nombre_producto || !descripcion || !precio || !stock || !id_categoria) {
                errors.push({ error: 'nombre_producto, descripcion, precio, stock y id_categoria son requeridos' });
                continue;
            }

            const precioNum = parseFloat(precio);
            const stockNum = parseFloat(stock, 10);

            if (isNaN(precioNum) || !Number.isFinite(precioNum) || precioNum < 0) {
                errors.push({ error: 'El precio debe ser un número positivo' });
                continue;
            }

            if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
                errors.push({ error: 'El stock debe ser un número entero positivo' });
                continue;
            }

            const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();

            // Verificar si el producto ya existe
            const existingProduct = await ProductModel.existingProduct(nombre_producto);
            if (existingProduct) {
                errors.push({ error: 'El producto ya existe',nombre_producto });
                continue;
            }

          
           //Preparar el producto para la insercion
           productsToInsert.push({
            codigo,
            nombre_producto,
            descripcion,
            precio:precioNum,
            stock:stockNum,
            id_categoria,
            activo,
            id_proveedor,
            imagePath : imagePath || ''
           })


            // Llamar a la función de inserción de múltiples productos en el modelo
            const [result] = await ProductModel.addMultipleProducts(productsToInsert);

            createdProducts.push({ id: result.insertId, nombre_producto });
        }


        if (errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201).json({ createdProducts });
        }

    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } 
};


static deleteMultipleProducts= async (req,res)=>{
    const { products } = req.body


    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Products must be an array' });
    }

    try {
        const deletePromises = products.map(product => { 
                const { id } = product;
                return ProductModel.deleteProduct(id)
        })

   await Promise.all(deletePromises)

   res. status(200).json({ message:'Porductos eliminados exitosamente'})
         
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' },error);
    }
}


static  getProductsMeta= async (req,res)=>{


    try {
      
   const products = await ProductModel.getAllProducts();
   const categories= await categoriasModel.getCategories();
  
   const meta = {
      cantidad_de_Productos: products.length,
      categorias:categories.map(category => category.categoria),
      priceRange: {
          min: Math.min(...products.map(product => product.precio)),
          max: Math.max(...products.map(product => product.precio))
      },
      countByCategory: categories.reduce((acc,category)=>{
          acc[category.categoria] = products.filter(product => product.id_categoria === category.id_categoria).length;
          return acc;
      },{}),  
  
     
   }
   res.json(meta)
  
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  
  }
  
  
  static filterProduct = async (req, res) => {
      try {
        const { category, minPrice, maxPrice } = req.query;
    
        const products = await ProductModel.filterProducts(category, minPrice, maxPrice);
        return res.json(products);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error filtering products', error });
      }
    }
      
  

}
   

export default productController