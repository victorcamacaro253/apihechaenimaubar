import { query as _query, pool } from '../db/db1.js'; // Asegúrate de que 'db' sea una instancia de conexión que soporte promesas
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
//import UserModel from '../models/userModels.js';
import XLSX from 'xlsx';
import UserModel from '../models/firebase/userModel_firebase.js'


const exportUsersData = async (req,res)=>{
    
   try {

    const users= await UserModel.getAllUsers();

    if(!users  || users.length === 0){
    throw new Error('No users found');
    }

    //Create a new workbook
    const wb= XLSX.utils.book_new();

    //Create a worksheet from users data
    const ws= XLSX.utils.json_to_sheet(users,{
        header:['id','nombre','apellido','cedula','correo']
    })

    //Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb,ws,'Usuarios');

    //Convert workbook to buffer 
    const excelBuffer = XLSX.write(wb,{bookType:'xlsx',type:'buffer'})



    res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(excelBuffer)

    
    return excelBuffer

   } catch (error) {
    console.error('Error al exportar los datos del usuario a Excel:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
   }

}


const exportUserData = async (req,res)=>{
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

       
    } catch (error) {
        console.error('Error al exportar los datos del usuario a Excel:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


const exportUsersDataByName= async (req,res)=>{
    const {nombre} = req.query

    try {
        const users= await UserModel.getUserByNombre(nombre)
        if (!users || users.length === 0) {
            throw new Error('No users found');
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
        console.error('Error al exportar los datos del usuario a Excel:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


const exportUserDataPdf = async(req,res)=>{

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

        console.error('Error al exportar los datos del usuario a PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}


const exportUserDataByIdPdf = async (req,res)=>{
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
        console.error('Error al exportar los datos del usuario a PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export default {
    exportUsersData,
    exportUserData,
    exportUsersDataByName,
     exportUserDataPdf,
     exportUserDataByIdPdf 
}