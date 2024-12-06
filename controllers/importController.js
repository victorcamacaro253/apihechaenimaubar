import csvParser from 'csv-parser';
import fs from 'fs';
import XLSX from 'xlsx';
import handleError from '../utils/handleError.js';
import UserModel from '../models/userModels.js';
import ProductModel from '../models/productModel.js';
import {hash,compare} from 'bcrypt';

class importController {

    static importUsersCsv = async (req, res) => {
        const filePath = req.file.path;
        const users = [];
        const errors = [];
    
        try {
            const readStream = fs.createReadStream(filePath);
            const parseStream = readStream.pipe(csvParser());
    
            const promises = [];
    
            parseStream.on('data', (row) => {
                const promise = new Promise(async (resolve, reject) => {
                    try {
                        const hashedPassword = await hash(row.contraseña, 10);
                        const existingUser = await UserModel.existingCedula(row.cedula);
    
                        if (existingUser) {
                            // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                            errors.push(`Usuario con cédula ${row.cedula} ya existe`);
                            resolve();  // Resolvemos la promesa para no bloquear el flujo
                            return;
                        }
    
                        // Si no existe, agregamos el usuario
                        users.push({
                            name: row.nombre,
                            apellido: row.apellido,
                            cedula: row.cedula,
                            email: row.correo,
                            hashedPassword: hashedPassword,
                            rol: row.rol,
                            imagen: row.imagen,
                        });
                        resolve();  // Resolvemos la promesa una vez que el usuario se haya agregado
                    } catch (error) {
                        reject(error);  // En caso de error, rechazamos la promesa
                    }
                });
                promises.push(promise);
            });
    
            // Esperamos a que todas las promesas se resuelvan
            await new Promise((resolve, reject) => {
                parseStream.on('end', resolve);
                parseStream.on('error', reject);
            });
    
            // Esperamos a que todas las promesas de usuarios se resuelvan
            await Promise.all(promises);
    
            // Si no hubo errores, insertamos los usuarios en la base de datos
            if (users.length > 0) {
                await UserModel.addMultipleUser(users);
            }
    
            // Eliminamos el archivo una vez procesado correctamente
            fs.unlinkSync(filePath);
    
            // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
            if (errors.length > 0) {
                return res.status(400).json({
                    message: 'Algunos usuarios ya existían.',
                    errors: errors
                });
            }
    
            // Respuesta exitosa si todo salió bien
            return res.json({ message: 'Usuarios importados correctamente' });
        } catch (error) {
            console.log('Error al procesar el archivo o importar usuarios', error);
    
            // Eliminamos el archivo si ocurrió un error
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            return res.status(500).json({ message: 'Error al importar usuarios', error });
        }
    };
    

    

static  importUserExcel= async(req,res)=>{
    const filePath = req.file.path
    const users=[]
    const errors = [];
  
  
    try {
  
      const workbook = XLSX.readFile(filePath)
  
      //suponemos que los datos estan en la primera hoja del archivo
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName]
  
      //convertimos los datos de la hoja a formato JSON 
      const data = XLSX.utils.sheet_to_json(worksheet);
      const headers = data.shift()
      
      const promises = []
  
      data.forEach((row)=>{
          promises.push(
              new Promise(async(resolve,reject)=>{
                  try {
                      const hashedPassword= await hash(row.contraseña,10)
  
                      const existingUser = await UserModel.existingCedula(row.cedula);
  
                      if (existingUser) {
                          // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                          errors.push(`Usuario con cédula ${row.cedula} ya existe`);
                          resolve();  // Resolvemos la promesa para no bloquear el flujo
                          return;
                      }
  
                      users.push({
                          name:row.nombre,
                          apellido:row.apellido,
                          cedula:row.cedula,
                          email:row.correo,
                          password:hashedPassword,
                          rol:row.rol,
                          imagen:row.imagen
                          })
                          resolve()
                          
                      } catch (error) {
                      reject(error)
                      }
                      })
                  
              
          )
      })
  
      await Promise.all(promises)
  
      //const count = await UserModel.addMultipleUser(users)
       // Si no hubo errores, insertamos los usuarios en la base de datos
       if (users.length > 0) {
          await UserModel.addMultipleUser(users);
      }
  
      fs.unlinkSync(filePath)
  
       // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
       if (errors.length > 0) {
          return res.status(400).json({
              message: 'Algunos usuarios ya existen.',
              errors: errors
          });
      }
  
      res.json({message:'Usuarios Importados correctamente'})
  
    } catch (error) {
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
  
      handleError(res,error)
    }
  }
  
  
static importProductsCsv = async (req, res) => {
    const filePath = req.file.path;
    const products = [];
    const errors = [];

    try {
        const readStream = fs.createReadStream(filePath);
        const parseStream = readStream.pipe(csvParser());

        const promises = [];

        parseStream.on('data', (row) => {
            console.log(row)
            const promise = new Promise(async (resolve, reject) => {
                try {

                    const existingProduct = await ProductModel.existingProduct(row.nombre_producto);

                    if (existingProduct) {
                        // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                        errors.push(`Producto ${row.nombre_producto} ya existe`);
                        resolve();  // Resolvemos la promesa para no bloquear el flujo
                        return;
                    }

                    // Si no existe, agregamos el producto
                    products.push({
                        codigo: row.codigo,
                        nombre_producto: row.nombre_producto,
                        descripcion: row.descripcion,
                        precio: parseFloat(row.precio),
                        stock:parseInt(row.stock),
                        id_categoria: parseInt(row.id_categoria),
                        activo:row.activo,
                        id_proveedor: parseInt(row.id_proveedor),
                        imagen:row.imagen
                    })
            
                    resolve();  // Resolvemos la promesa una vez que el producto se haya agregado
                } catch (error) {
                    reject(error);  // En caso de error, rechazamos la promesa
                }
            });
            promises.push(promise);
        });

        // Esperamos a que todas las promesas se resuelvan
        await new Promise((resolve, reject) => {
            parseStream.on('end', resolve);
            parseStream.on('error', reject);
        });

        // Esperamos a que todas las promesas de productos se resuelvan
        await Promise.all(promises);

        // Si no hubo errores, insertamos los usuarios en la base de datos
        if (products.length > 0) {
            await ProductModel.importProducts(products);
        }

        // Eliminamos el archivo una vez procesado correctamente
        fs.unlinkSync(filePath);

        // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Algunos productos ya existen.',
                errors: errors
            });
        }

        // Respuesta exitosa si todo salió bien
        return res.json({ message: 'Productos importados correctamente' });
    } catch (error) {
        console.log('Error al procesar el archivo o importar productos', error);

        // Eliminamos el archivo si ocurrió un error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(500).json({ message: 'Error al importar productos', error });
    }
};


   

static  importProductsExcel= async(req,res)=>{
    const filePath = req.file.path
    const products=[]
    const errors = [];
  
  
    try {
  
      const workbook = XLSX.readFile(filePath)
  
      //suponemos que los datos estan en la primera hoja del archivo
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName]
  
      //convertimos los datos de la hoja a formato JSON 
      const data = XLSX.utils.sheet_to_json(worksheet);
      const headers = data.shift()
      
      const promises = []
  
      data.forEach((row)=>{
          promises.push(
              new Promise(async(resolve,reject)=>{
                  try {
  
                    const existingProduct = await ProductModel.existingProduct(row.nombre_producto);
  
                      if (existingProduct) {
                          // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                          errors.push(`Producto ${row.nombre_producto} ya existe`);
                          resolve();  // Resolvemos la promesa para no bloquear el flujo
                          return;
                      }
  
                      products.push({
                        codigo: row.codigo,
                        nombre_producto: row.nombre_producto,
                        descripcion: row.descripcion,
                        precio: parseFloat(row.precio),
                        stock:parseInt(row.stock),
                        id_categoria: parseInt(row.id_categoria),
                        activo:row.activo,
                        id_proveedor: parseInt(row.id_proveedor),
                        imagen:row.imagen
                    })

                          resolve()
                          
                      } catch (error) {
                      reject(error)
                      }
                      })
                  
              
          )
      })
  
      await Promise.all(promises)
  
      //const count = await UserModel.addMultipleUser(users)
       // Si no hubo errores, insertamos los usuarios en la base de datos
       if (products.length > 0) {
          await ProductModel.importProducts(products);
      }
  
      fs.unlinkSync(filePath)
  
       // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
       if (errors.length > 0) {
          return res.status(400).json({
              message: 'Algunos Productos ya existen.',
              errors: errors
          });
      }
  
      res.json({message:'Usuarios Importados correctamente'})
  
    } catch (error) {
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
  
      handleError(res,error)
    }
  }
  

}

export default importController;