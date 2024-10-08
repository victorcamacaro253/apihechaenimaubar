import { Router } from "express";
import exportControllers from "../controllers/exportControllers.js";

const router = Router();


//Ruta para exportar todos los usuarios en excel

router.get('/export/Excel/users',exportControllers.exportUsersData)

//Ruta para exportar los usuario por nombre en excel

router.get('/export/Excel/users/name',exportControllers.exportUsersDataByName)

//Ruta para exportar los usuario por id en excel

router.get('/export/Excel/users/:id', exportControllers.exportUserData);

//Ruta para exportar todos los usuario en pdf

router.get('/export/PDF/users', exportControllers.exportUserDataPdf)

//Ruta para exportar los usarios por id en pdf

router.get('/export/PDF/users/:id', exportControllers.exportUserDataByIdPdf)

//Ruta para exportar todos los usarios en csv

router.get('/export/CSV/users',exportControllers.exportUserDataToCsv)

//Ruta para exportar los usarios por id en csv

router.get('/export/CSV/users/:id',exportControllers.exportUserDataToCsvByid)

//Ruta para exportar todos los usarios en formato json

router.get('/export/JSON/users',exportControllers.exportUserDataToJson)


//Ruta para exportar las compras por nombre de usuario en excel

router.get('/export/Excel/compras/name',exportControllers.exportComprasDataByName)

//Ruta para exportar las compras por fecha en excel

router.get('/export/Excel/compras/date',exportControllers.exportComprasByDate)

//Ruta para exportar las compras por id de usuario en excel

router.get('/export/Excel/compras/:id',exportControllers.exportComprasUserData);

//Ruta para exportar todsas las compras en excel

router.get('/export/Excel/compras',exportControllers.exportComprasData)

//Ruta para exportar las compras por fecha para el usuario en excel

router.get('/export/Excel/compras/:id/userFecha',exportControllers.exportComprasUserDate)


//Ruta para exportar las compras por nombre de usuario en Pdf

router.get('/export/PDF/compras/name',exportControllers.exportComprasDataByNamePdf)

//Ruta para exportar todsas las compras en pdf

router.get('/export/PDF/compras',exportControllers.exportComprasDataPdf)

//Ruta para exportar las compras por fecha en pdf

router.get('/export/PDF/compras/date',exportControllers.exportComprasByDatePdf)

//Ruta para exportar las compras por fecha para el usuario en pdf

router.get('/export/PDF/compras/:id/userFecha',exportControllers.exportComprasUserDatePdf)


export default router