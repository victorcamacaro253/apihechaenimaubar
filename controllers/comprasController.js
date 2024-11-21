import { pool } from '../db/db1.js'; // Asegúrate de que 'pool' es una instancia de conexión que soporte promesas
import comprasModel from '../models/comprasModel.js';
import ProductModel from '../models/productModel.js';


class comprasController{

 static getCompras = async (req, res) => {
  try {
    const result = await comprasModel.getComprasDetails();

    const compraAgrupada = result.reduce((acc, row) => {
      const { id_compra, fecha, total_compra, id_usuario, nombre, apellido, cedula, correo, id_producto, nombre_producto, cantidad, precio } = row;

      if (!acc[id_compra]) {
        acc[id_compra] = {
          id_compra,
          fecha,
          total: total_compra,
          usuario: {
            id: id_usuario,
            nombre,
            apellido,
            cedula,
            correo,
          },
          productos: [],
        };
      }

      acc[id_compra].productos.push({
        id_producto,
        nombre: nombre_producto,
        cantidad,
        precio,
      });

      return acc;
    }, {});

    return res.json(Object.values(compraAgrupada));
  } catch (error) {
    console.error('Error ejecutando la consulta', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message, // Incluye detalles del error si es seguro hacerlo
    });
  }
};





 static getCompraById= async (req,res) =>{
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


 static compraProduct = async (req, res) => {
  const { id_usuario, productos } = req.body;

  if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'El usuario y al menos un producto son requeridos' });
  }

  // Validar productos
  let totalCompra=0
  for (const producto of productos) {
    const { id_producto, cantidad, precio } = producto;
    if (!id_producto || !cantidad || !precio || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
      return res.status(400).json({ error: 'Datos de producto inválidos' });
    }
    totalCompra += cantidad * precio; // Sumar al total
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
    const id_compra = await comprasModel.addCompra(connection, id_usuario,totalCompra);


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


// Llamar a actualizarProductosMasVendidos fuera de la transacción
for (const producto of insertProductos) {
  const { id_producto, cantidad } = producto;
  await ProductModel.actualizarProductosMasVendidos(id_producto, cantidad);
}

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

 static deleteCompra = async (req,res) => {
 const { id } = req.params;

  // Iniciar transacción
  const connection = await pool.getConnection();
  await connection.beginTransaction();



 try {

const productosCompras = await comprasModel.getProductosCompra(id)
console.log(productosCompras)

const eliminarProcutosCompra= productosCompras.map(async (producto)=>{
  const { id_producto, id_compra,cantidad } = producto;
  const productosEncontrados = await comprasModel.deleteProductosCompras(id_compra)
  if (productosEncontrados.length === 0) {
    throw new Error('Producto no encontrado');
    }

})

await Promise.all(eliminarProcutosCompra)

  const result = await comprasModel.deleteCompra(id);

  if(result.affectedRows==0){
    await connection.rollback();
    return res.status(404).json(({message:'Compra no encontrada'}))
  }

  await connection.commit();
  res.status(200).json({message:'compra eliminada exitosamente'})
  
 } catch (error) {
  console.error('Error ejecutando la consulta',error)
  // Hacer rollback en caso de error
  await connection.rollback();
  res.status(500).json({error:'Error interno del servidor'});
  
 }finally{
  connection.release();
 }
}

 static getComprasByDate = async (req, res) => {
  const { startDate, endDate } = req.query; // Obtener fechas desde los parámetros de consulta
 console.log(startDate,endDate)
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
      const compras = await comprasModel.findByDateRange(formattedStartDate, formattedEndDate);



     // Procesar los resultados usando reduce
     const compraAgrupada = compras.reduce((acc, row) => {
      const { id_compra, fecha, total_compra, id_usuario, nombre, apellido, cedula, correo, id_producto, cantidad, precio } = row;

      if (!acc[id_compra]) {
        acc[id_compra] = {
          id_compra,
          fecha,
          total: total_compra,
          usuario: {
            id: id_usuario,
            nombre,
            apellido,
            cedula,
            correo,
          },
          productos: [],
        };
      }

      // Agregar el producto a la compra
      acc[id_compra].productos.push({
        id_producto,
        cantidad,
        precio,
      });

      return acc;
    }, {});

    return res.json(Object.values(compraAgrupada));

    
  } catch (error) {
      console.error('Error obteniendo compras por fecha:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


 static getComprasByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    return res.status(400).json({ error: 'No se proporcionó un Id' });
  }

  try {
    const result = await comprasModel.getComprasByUserId(userId);
    if (!result.length) {  // Cambiar para verificar si hay resultados
      return res.status(400).json({ error: 'No se encontraron compras para el id proporcionado' });
    }

    // Procesar los resultados
    const compraAgrupada = {};

    result.forEach(row => {
      if (!compraAgrupada[row.id_compra]) {
        compraAgrupada[row.id_compra] = {
          id_compra: row.id_compra,
          fecha: row.fecha,
          total:row.total_compra,
          usuario: {
            id: row.id_usuario,
            nombre: row.nombre,
            apellido: row.apellido,
            cedula: row.cedula,
            correo: row.correo,
          },
          productos: []
        };
      }

      // Agregar el producto a la compra
      compraAgrupada[row.id_compra].productos.push({
        id_producto: row.id_producto,
        cantidad: row.cantidad,
        precio: row.precio
      });
    });

    return res.json(Object.values(compraAgrupada));
    
  } catch (error) {
    console.error('Error obteniendo compras por el id del usuario', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


 static getComprasByusername= async (req,res)=>{

      const {nombre}=req.query

      console.log(nombre)

      if (!nombre) {
        
        return res.status(400).json({ error: 'No se proporciono un nombre' });
       
      }
     
      try {
        
  const result = await comprasModel.getComprasByUsername(nombre)

   if(!result){
    return    res.status(400).json({error:'No se proporciono'})
   }
  
    // Procesar los resultados
    const compraAgrupada = {};

    result.forEach(row => {
      if (!compraAgrupada[row.id_compra]) {
        compraAgrupada[row.id_compra] = {
          id_compra: row.id_compra,
          fecha: row.fecha,
          usuario: {
            id: row.id_usuario,
            nombre: row.nombre,
            apellido: row.apellido,
            cedula: row.cedula,
            correo: row.correo,
          },
          productos: []
        };
      }

      // Agregar el producto a la compra
      compraAgrupada[row.id_compra].productos.push({
        id_producto: row.id_producto,
        cantidad: row.cantidad,
        precio: row.precio
      });
    });

    return res.json(Object.values(compraAgrupada));


      } catch (error) {
        console.error('Error obteniendo compras por el nombre del usuario', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }

      }

  

      
      static  getComprasByUserDate=async (req,res)=>{
        const {id}= req.params;
        const { startDate, endDate } = req.query; // Obtener fechas desde los parámetros de consulta
        console.log(startDate,endDate)
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
             const compras = await comprasModel.findByDateRangeUserId(id,formattedStartDate, formattedEndDate);
       
       
       
           // Procesar los resultados
           const compraAgrupada = {};
       
           compras.forEach(row => {
             if (!compraAgrupada[row.id_compra]) {
               compraAgrupada[row.id_compra] = {
                 id_compra: row.id_compra,
                 fecha: row.fecha,
                 total:row.total_compra,
                 usuario: {
                   id: row.id_usuario,
                   nombre: row.nombre,
                   apellido: row.apellido,
                   cedula: row.cedula,
                   correo: row.correo,
                 },
                 productos: []
               };
             }
       
             // Agregar el producto a la compra
             compraAgrupada[row.id_compra].productos.push({
               id_producto: row.id_producto,
               cantidad: row.cantidad,
               precio: row.precio
             });
           });
       
       
           return res.json(Object.values(compraAgrupada));
       
           
         } catch (error) {
             console.error('Error obteniendo compras por fecha:', error);
             res.status(500).json({ error: 'Error interno del servidor' });
         }
      }



      static getEstadisticasCompras = async (req,res)=>{
      const {userId,startDate,endDate} = req.query
      console.log(userId,startDate,endDate)
        try {
          const results = await  comprasModel.getEstadisticasCompras(userId,startDate,endDate)
          
          if(!results){
            return res.status(404).json({error: 'Usuario no encontrado'})
          }

        const  total= results.length;
        const totalCompra = results.reduce((acc, curr) => acc + parseFloat(curr.total_compra), 0); // Suma total de todas las compras
        const promedioCompra = totalCompra / total; // Promedio de compra
        const totalProductos = results.reduce((acc, curr) => acc + curr.cantidad, 0); // Total de productos comprados
        const promedioProductosPorCompra = totalProductos / total; // Promedio de productos por compra
        const primeraCompra = results[0].fecha; // Fecha de la primera compra (más antigua)
        const ultimaCompra = results[results.length - 1].fecha; // Fecha de la última compra (más reciente)


          res.status(200).json({
            total,
            totalCompra,
            promedioCompra,
            totalProductos,
            promedioProductosPorCompra,
            primeraCompra,
            ultimaCompra})

          
        } catch (error) {
          console.log(error)
          return  res.status(500).json({error: 'Error interno del servidor'})


        }
      }

    }

export default comprasController;