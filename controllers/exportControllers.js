import { query as _query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import UserModel from '../models/userModels.js';
import comprasModel from '../models/comprasModel.js';
import ProductModel from '../models/productModel.js';
import XLSX from 'xlsx';
import { Parser  } from 'json2csv';
import handleError from '../utils/handleError.js';
import { error } from 'console';
//import UserModel from '../models/firebase/userModel_firebase.js';


class exportControllers{

static exportUsersData = async (req,res)=>{
    
   try {

    const users= await UserModel.getAllUsers();

    if(!users  || users.length === 0){
    throw new Error('No users found');
    }

    //Create a new workbook
    const wb= XLSX.utils.book_new();

    //Create a worksheet from users data
    const ws= XLSX.utils.json_to_sheet(users,{
        header:['id','nombre','apellido','cedula','correo','contraseña','imagen']
    })

          // Ajustar automáticamente el ancho de las columnas
          const colWidths = [
            { wch: 10 }, // Ancho para "id"
            { wch: Math.max(10, ...users.map(user => user.nombre?.length || 0)) }, // Ancho para "nombre"
            { wch: Math.max(10, ...users.map(user => user.apellido?.length || 0)) }, // Ancho para "apellido"
            { wch: Math.max(10, ...users.map(user => user.cedula?.length || 0)) }, // Ancho para "cedula"
            { wch: Math.max(10, ...users.map(user => user.correo?.length || 0))},
            { wch: Math.max(10, ...users.map(user => user.contraseña?.length || 0))},
            { wch: Math.max(10, ...users.map(user => user.imagen?.length || 0))},
            { wch: Math.max(10, ...users.map(user => user.google_id?.length || 0))}
          ];
          ws['!cols'] = colWidths;


    //Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb,ws,'Usuarios');

    //Convert workbook to buffer 
    const excelBuffer = XLSX.write(wb,{bookType:'xlsx',type:'buffer'})



    res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(excelBuffer)

    
    return excelBuffer

   } catch (error) {
   handleError(res,error)
   }

}


static exportUserData = async (req,res)=>{
    const { id }= req.params;

    try {
     
        const user= await UserModel.getUserById(id);

        if(!user){
            res.status(404).json('No se encontraron resultados');
        }

        //Create a new book
        const wb = XLSX.utils.book_new();

            // Create a worksheet from user data
            const ws= XLSX.utils.json_to_sheet([user],{
            header:['id','nombre','apellido','cedula','correo']
        })

         // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb,ws,'Usuario');


      //convert workbook to buffer 
      const excelBuffer = XLSX.write(wb,{bookType:'xlsx',type:'buffer'})

      

   
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

        return excelBuffer
    } catch (error) {
       handleError(res,error)
    }
}


static exportUsersDataByName= async (req,res)=>{
    const {nombre} = req.query

    try {
        const users= await UserModel.getUserByNombre(nombre)
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

          // Create a new workbook
          const wb = XLSX.utils.book_new();

          // Create a worksheet from user data
          const ws = XLSX.utils.json_to_sheet(users, {
              header: ['id', 'nombre', 'apellido', 'cedula', 'correo']
          });

          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

          // Convert workbook to buffer
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

          
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);


          return excelBuffer;
        
    } catch (error) {
        handleError(res,error)
    }
}


static exportUserDataPdf = async(req,res)=>{

    try {
        // Simular la obtención de datos del usuario
        const userData = await UserModel.getAllUsers();

        // Crea un documento PDF
        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        // Configura las cabeceras para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Añadir título
        doc.fontSize(18).text('User Data', { align: 'center' });
        doc.moveDown();

        // Configurar la tabla
        const tableTop = 100;
        const itemHeight = 20;
        const tableWidth = 500;
        const columnWidths = [100, 200, 200]; // Ejemplo de anchos para columnas

        // Dibuja las cabeceras de la tabla
        doc.fontSize(12).text('ID', 50, tableTop);
        doc.text('Name', 150, tableTop);
        doc.text('Apellido', 300, tableTop);

        // Dibuja una línea horizontal debajo de las cabeceras
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        // Añadir datos a la tabla
        let y = tableTop + itemHeight;
        userData.forEach((user, index) => {
            doc.text(user.id, 50, y);
            doc.text(user.nombre, 150, y);
            doc.text(user.apellido, 300, y);

            // Dibuja una línea horizontal después de cada fila
            doc.moveTo(50, y + itemHeight).lineTo(550, y + itemHeight).stroke();
            y += itemHeight;
        });

        // Finaliza el PDF y envíalo como respuesta
        doc.end();
        stream.pipe(res);
    
    } catch (error) {

       handleError(res,error)
    }

}


static exportUserDataByIdPdf = async (req,res)=>{
    const {id}= req.params;

    try {
        // Simular la obtención de datos del usuario
        const userData = await UserModel.getUserById(id);

        // Crea un documento PDF
        const doc = new PDFDocument();

        // Usa un stream para el buffer del PDF
        const stream = Readable.from(doc);

        // Configura las cabeceras para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Escribe en el documento PDF
        doc.text('Datos del Usuario', { align: 'center' });
        doc.text('ID: ' + userData.id);
        doc.text('Name: ' + userData.nombre);
        doc.text('Apellido: ' + userData.apellido);
        doc.text('Cedula: ' + userData.cedula);
        doc.text('Correo: ' + userData.correo);
        doc.text('contraseña: ' + userData.contraseña);
        
        // Agrega más información según sea necesario

        // Finaliza el PDF y envíalo como respuesta
        doc.end();
        stream.pipe(res);
    } catch (error) {
     handleError(res,error)
    }
}


static exportUserDataToCsv = async (req,res)=>{

   try {
    const users = await UserModel.getAllUsers()


    if (!users || users.length === 0) {
        throw new Error('No users found');
    }

    const fields= ['id','nombre','apellido','cedula','corrreo']
    const json2csvParser = new Parser({fields})
    const csv = json2csvParser.parse(users)
    res.setHeader('Content-Disposition', 'attachment; filename="user_data.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
 
   } catch (error) {
    handleError(res,error)
   }
}


static exportUserDataToCsvByid = async (req,res)=>{
   const {id}= req.params
    try {
     const users = await UserModel.getUserById(id)
 
 
     if (!users || users.length === 0) {
         throw new Error('No users found');
     }
 
     const fields= ['id','nombre','apellido','cedula','corrreo']
     const json2csvParser = new Parser({fields})
     const csv = json2csvParser.parse(users)
     res.setHeader('Content-Disposition', 'attachment; filename="user_data.csv"');
     res.setHeader('Content-Type', 'text/csv');
     res.send(csv);
  
    } catch (error) {
     handleError(res,error)
    }
 }


 static exportUserDataToJson= async (req,res)=>{
    try {
        
        const users= await UserModel.getAllUsers()
        console.log(users)
        if (users.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios." });
        }

        res.setHeader('Content-Type','application/json')
        res.send(JSON.stringify(users,null,2))

    } catch (error) {
        handleError(res,error)
    }
 }


 static exportComprasUserData = async (req, res) => {
    const {id}= req.params
    try {
        const purchases = await comprasModel.getComprasByUserId(id);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};

        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                // Si aún no existe la compra, la crea
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: [] // Inicializa el array de productos
                };
            }

            // Agregar el producto a la lista de productos
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        // Convertir el objeto agrupado en un array
        const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
            ...purchase,
            productos: purchase.productos.map(product => `ID: ${product.id_producto},nombre:${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`).join('; ')
        }));

        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();

        // Crear una hoja de trabajo desde los datos agrupados
        const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['id_compra', 'fecha', 'nombre', 'apellido', 'cedula', 'correo', 'productos']
        });

        // Agregar la hoja de trabajo al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Compras');

        // Convertir el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Configurar las cabeceras para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

        return excelBuffer;

    } catch (error) {
       handleError(res,error)
    }
};


static exportComprasData = async (req, res) => {
    
    try {
        const purchases = await comprasModel.getComprasDetails();

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};

        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                // Si aún no existe la compra, la crea
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total:row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: [] // Inicializa el array de productos
                };
            }

            // Agregar el producto a la lista de productos
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        // Convertir el objeto agrupado en un array
        const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
            ...purchase,
            productos: purchase.productos.map(product => `ID: ${product.id_producto},nombre:${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`).join('; ')
        }));

        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();

        // Crear una hoja de trabajo desde los datos agrupados
        const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['id_compra', 'fecha', 'nombre', 'apellido', 'cedula', 'correo', 'productos']
        });

        // Agregar la hoja de trabajo al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Compras');

        // Convertir el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Configurar las cabeceras para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

        return excelBuffer;

    } catch (error) {
        handleError(res,error)
    }
};


static exportComprasDataByName= async (req,res)=>{
    const {nombre} = req.query

    try {
        const comprasByUser= await comprasModel.getComprasByUsername(nombre)
        if (!comprasByUser || comprasByUser.length === 0) {
            throw new Error('No users found');
        }



     // Agrupar las compras
     const groupedPurchases = {};

     comprasByUser.forEach(row => {
         if (!groupedPurchases[row.id_compra]) {
             // Si aún no existe la compra, la crea
             groupedPurchases[row.id_compra] = {
                 id_compra: row.id_compra,
                 fecha: row.fecha,
                 total:row.total_compra,
                 nombre: row.nombre,
                 apellido: row.apellido,
                 cedula: row.cedula,
                 correo: row.correo,
                 productos: [] // Inicializa el array de productos
             };
         }

         // Agregar el producto a la lista de productos
         groupedPurchases[row.id_compra].productos.push({
             id_producto: row.id_producto,
             nombre_producto: row.nombre_producto,
             cantidad: row.cantidad,
             precio: row.precio
         });
     });



     // Convertir el objeto agrupado en un array
     const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
        ...purchase,
        productos: purchase.productos.map(product => `ID: ${product.id_producto},nombre:${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`).join('; ')
    }));





          // Create a new workbook
          const wb = XLSX.utils.book_new();

          // Create a worksheet from user data
          const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['id_compra', 'fecha', 'nombre', 'apellido', 'cedula', 'correo', 'productos']
          });

          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Usuario Compras');

          // Convert workbook to buffer
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

          
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);


          return excelBuffer;
        
    } catch (error) {
        handleError(res,error)
    }
}


static exportComprasByDate= async (req,res)=>{
const {startDate,endDate}= req.query;
console.log(startDate,endDate)
if(!startDate ||  !endDate){
  return res.status(400).json({error:'Se requieren start'})  
}

//Formateamos la fecha
const formattedStartDate = new Date(startDate)
const formattedEndDate= new Date(endDate);

if(isNaN(formattedStartDate) || isNaN(formattedEndDate)){
    return res.status(400).json({error:'Fechas invalidas'})
}

try {

    const compras= await comprasModel.findByDateRange(formattedStartDate,formattedEndDate)



 

    
     // Agrupar las compras
     const groupedPurchases = {};

     compras.forEach(row => {
         if (!groupedPurchases[row.id_compra]) {
             // Si aún no existe la compra, la crea
             groupedPurchases[row.id_compra] = {
                 id_compra: row.id_compra,
                 fecha: row.fecha,
                 total:row.total_compra,
                 nombre: row.nombre,
                 apellido: row.apellido,
                 cedula: row.cedula,
                 correo: row.correo,
                 productos: [] // Inicializa el array de productos
             };
         }

         // Agregar el producto a la lista de productos
         groupedPurchases[row.id_compra].productos.push({
             id_producto: row.id_producto,
             nombre_producto: row.nombre_producto,
             cantidad: row.cantidad,
             precio: row.precio
         });
     });



     // Convertir el objeto agrupado en un array
     const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
        ...purchase,
        productos: purchase.productos.map(product => `ID: ${product.id_producto},nombre:${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`).join('; ')
    }));




          // Create a new workbook
          const wb = XLSX.utils.book_new();

          // Create a worksheet from user data
          const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['id_compra', 'fecha', 'nombre', 'apellido', 'cedula', 'correo', 'productos']
          });

          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Usuario Compras');

          // Convert workbook to buffer
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

          
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);


          return excelBuffer;

} catch (error) {
    handleError(res,error)
}

}



static exportComprasUserDate = async (req,res)=>{
    const {id}= req.params  
    const {startDate,endDate}= req.query;
console.log(startDate,endDate)
if(!startDate ||  !endDate){
  return res.status(400).json({error:'Se requieren start'})  
}

//Formateamos la fecha
const formattedStartDate = new Date(startDate)
const formattedEndDate= new Date(endDate);

if(isNaN(formattedStartDate) || isNaN(formattedEndDate)){
    return res.status(400).json({error:'Fechas invalidas'})
}

try {

    const compras= await  comprasModel.findByDateRangeUserId(id,formattedStartDate, formattedEndDate);

    
     // Agrupar las compras
     const groupedPurchases = {};

     compras.forEach(row => {
         if (!groupedPurchases[row.id_compra]) {
             // Si aún no existe la compra, la crea
             groupedPurchases[row.id_compra] = {
                 id_compra: row.id_compra,
                 fecha: row.fecha,
                 total:row.total_compra,
                 nombre: row.nombre,
                 apellido: row.apellido,
                 cedula: row.cedula,
                 correo: row.correo,
                 productos: [] // Inicializa el array de productos
             };
         }

         // Agregar el producto a la lista de productos
         groupedPurchases[row.id_compra].productos.push({
             id_producto: row.id_producto,
             nombre_producto: row.nombre_producto,
             cantidad: row.cantidad,
             precio: row.precio
         });
     });



     // Convertir el objeto agrupado en un array
     const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
        ...purchase,
        productos: purchase.productos.map(product => `ID: ${product.id_producto},nombre:${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`).join('; ')
    }));




          // Create a new workbook
          const wb = XLSX.utils.book_new();

          // Create a worksheet from user data
          const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['id_compra', 'fecha', 'nombre', 'apellido', 'cedula', 'correo', 'productos']
          });

          // Append the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Usuario Compras');

          // Convert workbook to buffer
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

          
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);


          return excelBuffer;

} catch (error) {
    handleError(res,error)
}
}

/*
const exportComprasDataPdf = async (req, res) => {
    try {
        const purchases = await comprasModel.getComprasDetails();

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};

        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total: row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: []
                };
            }
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        // Configura las cabeceras para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Título del documento
        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown();

        const tableTop = 100;
        const itemHeight = 20;
        let y = tableTop;

        // Dibuja las cabeceras de la tabla
        doc.fontSize(12)
            .text('ID Compra', 50, y)
            .text('Nombre', 150, y)
            .text('Apellido', 300, y)
            .text('Total', 400, y);

        // Línea horizontal
        doc.moveTo(50, y + itemHeight).lineTo(550, y + itemHeight).stroke();
        y += itemHeight;

        // Añadir datos de compras
        finalPurchases.forEach(purchase => {
            doc.text(purchase.id_compra, 50, y);
            doc.text(purchase.nombre, 150, y);
            doc.text(purchase.apellido, 300, y);
            doc.text(purchase.total.toString(), 400, y);

            // Línea horizontal después de cada fila
            doc.moveTo(50, y + itemHeight).lineTo(550, y + itemHeight).stroke();
            y += itemHeight;

            // Añadir productos
            purchase.productos.forEach(product => {
                doc.text(`ID: ${product.id_producto}, Nombre: ${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`, 50, y);
                y += itemHeight;
            });

            // Línea horizontal
        doc.moveTo(50, y + itemHeight).lineTo(550, y + itemHeight).stroke();
        y += itemHeight;

        });

        // Finaliza el PDF y envíalo como respuesta
        doc.end();
        stream.pipe(res);

    } catch (error) {
        console.error('Error al exportar los datos de las compras a PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/

static exportComprasDataPdf = async (req, res) => {
    try {
        const purchases = await comprasModel.getComprasDetails();

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};
        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total: row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: []
                };
            }
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;
        const tableWidth = 500;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black').text('ID Compra', 50, tableTop);
        doc.text('Nombre', 150, tableTop);
        doc.text('Apellido', 300, tableTop);
        doc.text('Total', 400, tableTop);
        doc.text('Fecha', 500, tableTop);
        
        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalPurchases.forEach(purchase => {
            doc.fontSize(10).fillColor('black')
                .text(purchase.id_compra, 50, y)
                .text(purchase.nombre, 150, y)
                .text(purchase.apellido, 300, y)
                .text(purchase.total.toString(), 400, y)// Formatear total
                .text(purchase.fecha, 500, y); 

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += itemHeight;

            // Productos de cada compra
            purchase.productos.forEach(product => {
                doc.text(`ID: ${product.id_producto}, Nombre: ${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`, 50, y);
                y += itemHeight;
            });

            // Espaciado entre compras
            y += itemHeight;

             // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();
        });

        // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();

        doc.end();
        stream.pipe(res);

    } catch (error) {
    handleError(res,error)
    }
};





static exportComprasDataByNamePdf= async (req,res)=>{
    const {nombre} = req.query
    try {
        const purchases = await comprasModel.getComprasByUsername(nombre);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};
        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total: row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: []
                };
            }
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;
        const tableWidth = 500;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black').text('ID Compra', 50, tableTop);
        doc.text('Nombre', 150, tableTop);
        doc.text('Apellido', 300, tableTop);
        doc.text('Total', 400, tableTop);
        doc.text('Fecha',500,tableTop)
        
        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalPurchases.forEach(purchase => {
            doc.fontSize(10).fillColor('black')
                .text(purchase.id_compra, 50, y)
                .text(purchase.nombre, 150, y)
                .text(purchase.apellido, 300, y)
                .text(purchase.total.toString(), 400, y) // Formatear total
                .text(purchase.fecha,500,y)

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += itemHeight;

            // Productos de cada compra
            purchase.productos.forEach(product => {
                doc.text(`ID: ${product.id_producto}, Nombre: ${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`, 50, y);
                y += itemHeight;
            });

            // Espaciado entre compras
            y += itemHeight;

             // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();
        });

        // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();

        doc.end();
        stream.pipe(res);

    } catch (error) {
        handleError(res,error)
    }
}


static exportComprasByDatePdf = async (req,res)=>{
    const {startDate,endDate} = req.query
    try {
        const purchases = await comprasModel.findByDateRange(startDate,endDate);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};
        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total: row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: []
                };
            }
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;
        const tableWidth = 500;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black').text('ID Compra', 50, tableTop);
        doc.text('Nombre', 150, tableTop);
        doc.text('Apellido', 300, tableTop);
        doc.text('Total', 400, tableTop);
        doc.text('Fecha', 500, tableTop);
        
        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalPurchases.forEach(purchase => {
            doc.fontSize(10).fillColor('black')
                .text(purchase.id_compra, 50, y)
                .text(purchase.nombre, 150, y)
                .text(purchase.apellido, 300, y)
                .text(purchase.total.toString(), 400, y)// Formatear total
                .text(purchase.fecha, 500, y); 

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += itemHeight;

            // Productos de cada compra
            purchase.productos.forEach(product => {
                doc.text(`ID: ${product.id_producto}, Nombre: ${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`, 50, y);
                y += itemHeight;
            });

            // Espaciado entre compras
            y += itemHeight;

             // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();
        });

        // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();

        doc.end();
        stream.pipe(res);

    } catch (error) {
        handleError(res,error)
    }
}

static exportComprasUserDatePdf= async (req,res)=>{
    const {id}= req.params
    const {startDate,endDate} = req.query
    try {
        const purchases = await comprasModel.findByDateRangeUserId(id,startDate,endDate);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};
        purchases.forEach(row => {
            if (!groupedPurchases[row.id_compra]) {
                groupedPurchases[row.id_compra] = {
                    id_compra: row.id_compra,
                    fecha: row.fecha,
                    total: row.total_compra,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    cedula: row.cedula,
                    correo: row.correo,
                    productos: []
                };
            }
            groupedPurchases[row.id_compra].productos.push({
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;
        const tableWidth = 500;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black').text('ID Compra', 50, tableTop);
        doc.text('Nombre', 150, tableTop);
        doc.text('Apellido', 300, tableTop);
        doc.text('Total', 400, tableTop);
        doc.text('Fecha', 500, tableTop);
        
        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalPurchases.forEach(purchase => {
            doc.fontSize(10).fillColor('black')
                .text(purchase.id_compra, 50, y)
                .text(purchase.nombre, 150, y)
                .text(purchase.apellido, 300, y)
                .text(purchase.total.toString(), 400, y)// Formatear total
                .text(purchase.fecha, 500, y); 

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += itemHeight;

            // Productos de cada compra
            purchase.productos.forEach(product => {
                doc.text(`ID: ${product.id_producto}, Nombre: ${product.nombre_producto}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`, 50, y);
                y += itemHeight;
            });

            // Espaciado entre compras
            y += itemHeight;

             // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();
        });

        // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();

        doc.end();
        stream.pipe(res);

    } catch (error) {
        handleError(res,error)
    }
}



static exportProductsPdf = async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        console.log(products);

        if (!products || products.length === 0) {
            throw new Error('No products found');
        }

        // Agrupar los productos
        const groupedProducts = {};
        products.forEach(row => {
            if (!groupedProducts[row.id_producto]) {
                groupedProducts[row.id_producto] = {
                    id_producto: row.id_producto,
                    codigo: row.codigo,
                    nombre_producto: row.nombre_producto,
                    descripcion: row.descripcion,
                    precio: row.precio,
                    stock: row.stock,
                    vendido: row.vendido,
                    activo: row.activo,
                    categoria: row.categoria
                };
            }
        });

        const finalProducts = Object.values(groupedProducts);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="productos_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Productos', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black')
            .text('ID Producto', 50, tableTop)
            .text('Código', 150, tableTop)
            .text('Nombre', 300, tableTop)
            .text('Descripción', 400, tableTop)
            .text('Precio', 500, tableTop)
            .text('Stock', 550, tableTop)
            .text('Vendido', 600, tableTop)
            .text('Activo', 650, tableTop)
            .text('Categoría', 700, tableTop);

        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(750, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalProducts.forEach(product => {
            doc.fontSize(10).fillColor('black')
                .text(product.id_producto, 50, y)
                .text(product.codigo, 150, y)
                .text(product.nombre_producto, 300, y)
                .text(product.descripcion, 400, y)
                .text(product.precio, 500, y)
                .text(product.stock, 550, y)
                .text(product.vendido, 600, y)
                .text(product.activo, 650, y)
                .text(product.categoria, 700, y);

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(750, y).stroke();
            y += itemHeight;
        });

        // Línea final
        doc.moveTo(50, y).lineTo(750, y).stroke();

        doc.end();
        stream.pipe(res);

    } catch (error) {
        handleError(res, error);
    }
}


static exportProducts = async (req,res)=>{
    try {

        const products= await ProductModel.getAllProducts();
    
        if(!products  || products.length === 0){
return res.status(404).json({message: 'No hay productos'});

        }
    
        //Create a new workbook
        const wb= XLSX.utils.book_new();
    
        //Create a worksheet from users data
        const ws= XLSX.utils.json_to_sheet(products,{
            header:['id','codigo','nombre','descripcion','precio','stock','vendido','activo','categoria']
        })
    
              // Ajustar automáticamente el ancho de las columnas
              const colWidths = [
                { wch: 10 }, // Ancho para "id"
                { wch: Math.max(10, ...products.map(product => product.codigo?.length || 0)) }, // Ancho para "nombre"
                { wch: Math.max(10, ...products.map(product => product.nombre?.length || 0)) }, // Ancho para "apellido"
                { wch: Math.max(10, ...products.map(product => product.descripcion?.length || 0)) }, // Ancho para "cedula"
                { wch: Math.max(10, ...products.map(product => product.precio?.length || 0))},
                { wch: Math.max(10, ...products.map(product => product.stock?.length || 0))},
                { wch: Math.max(10, ...products.map(product => product.vendido?.length || 0))},
                { wch: Math.max(10, ...products.map(product => product.activo?.length || 0))},
                { wch: Math.max(10, ...products.map(product => product.categoria?.length || 0))}

              ];
              ws['!cols'] = colWidths;
    
    
        //Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb,ws,'Productos');
    
        //Convert workbook to buffer 
        const excelBuffer = XLSX.write(wb,{bookType:'xlsx',type:'buffer'})
    
    
    
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.send(excelBuffer)
    
        
        return excelBuffer
    
       } catch (error) {
       handleError(res,error)
       }
    

}

}

export default exportControllers


