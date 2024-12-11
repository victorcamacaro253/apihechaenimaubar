import { Router } from "express";
import upload from "../middleware/multerConfig.js";
import importController from "../controllers/importController.js";

const router = Router()


//Ruta para importar Usuarios a la Base de datos
router.post('/users/csv',upload.single('file'), importController.importUsersCsv)

//Ruta para importar Usuarios a la base de datos desde un archivo Excel
router.post('/users/Excel',upload.single('file'),importController.importUserExcel)

router.post('/products/csv',upload.single('file'),importController.importProductsCsv)

router.post('/products/Excel',upload.single('file'),importController.importProductsExcel)







export default router